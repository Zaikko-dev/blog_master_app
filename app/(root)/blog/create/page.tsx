import { auth } from '@/auth';
import BlogForm from '@/components/BlogForm';
import { redirect } from 'next/navigation';

const Page = async () => {
    const session = await auth();

    if (!session) redirect('/');

    return (
        <>
            <section className="pink_container !min-h-[230px]">
                <h1 className="heading">Crea tu nuevo blog</h1>
            </section>

            <BlogForm />
        </>
    );
};

export default Page;
