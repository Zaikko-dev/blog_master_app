'use client';

import { useState, useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createContent } from '@/lib/actions';
import { formSchema } from '@/lib/validation';

const BlogForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [content, setContent] = useState('');
    const router = useRouter();

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                link: formData.get('link') as string,
                content,
            };

            await formSchema.parseAsync(formValues);

            const result = await createContent(prevState, formData, content);

            if (result.status == 'SUCCESS') {
                toast('Success', {
                    description: 'Tu blog se ha publicado correctamente',
                });

                router.push(`/blog/${result._id}`);
            }

            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErorrs = error.flatten().fieldErrors;

                setErrors(fieldErorrs as unknown as Record<string, string>);

                toast('Error', {
                    description:
                        'Por favor revisa los campos y vuelve a intentarlo',
                });

                return {
                    ...prevState,
                    error: 'Validation failed',
                    status: 'ERROR',
                };
            }

            toast('Error', {
                description: 'Un error inesperado ha ocurrido',
            });

            return {
                ...prevState,
                error: 'An unexpected error has occurred',
                status: 'ERROR',
            };
        }
    };

    const [state, formAction, isPending] = useActionState(handleFormSubmit, {
        error: '',
        status: 'INITIAL',
    });

    return (
        <form action={formAction} className="startup-form">
            <div>
                <label htmlFor="title" className="startup-form_label">
                    Titulo
                </label>
                <Input
                    id="title"
                    name="title"
                    className="startup-form_input"
                    required
                    placeholder="Titulo del blog"
                />

                {errors.title && (
                    <p className="startup-form_error">{errors.title}</p>
                )}
            </div>

            <div>
                <label htmlFor="description" className="startup-form_label">
                    Descripcion
                </label>
                <Textarea
                    id="description"
                    name="description"
                    className="startup-form_textarea"
                    required
                    placeholder="Describe en pocas palabras tu blog"
                />

                {errors.description && (
                    <p className="startup-form_error">{errors.description}</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="startup-form_label">
                    Categoria
                </label>
                <Input
                    id="category"
                    name="category"
                    className="startup-form_input"
                    required
                    placeholder="(Tecnologia, Salud, Educacion ...)"
                />

                {errors.category && (
                    <p className="startup-form_error">{errors.category}</p>
                )}
            </div>

            <div>
                <label htmlFor="link" className="startup-form_label">
                    URL
                </label>
                <Input
                    id="link"
                    name="link"
                    className="startup-form_input"
                    required
                    placeholder="URL de la imagen"
                />
                {errors.link && (
                    <p className="startup-form_error">{errors.link}</p>
                )}
            </div>

            <div data-color-mode="light">
                <label htmlFor="contenido" className="startup-form_label">
                    Contenido
                </label>

                <MDEditor
                    value={content}
                    onChange={(value) => setContent(value as string)}
                    id="contenido"
                    preview="edit"
                    height={300}
                    style={{ borderRadius: 20, overflow: 'hidden' }}
                    textareaProps={{
                        placeholder:
                            'Describe con detalle tu idea y publicala.',
                    }}
                    previewOptions={{
                        disallowedElements: ['style'],
                    }}
                />

                {errors.content && (
                    <p className="startup-form_error">{errors.content}</p>
                )}
            </div>

            <Button
                type="submit"
                className="startup-form_btn text-white"
                disabled={isPending}
            >
                {isPending ? 'Publicando ...' : 'Publica tu blog'}
                <Send className="size-6 ml-2" />
            </Button>
        </form>
    );
};

export default BlogForm;
