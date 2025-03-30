import { client } from '@/sanity/lib/client';
import { BLOGS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries';
import BlogCard, { BlogTypeCard } from './BlogCard';

const UserBlogs = async ({ id }: { id: string }) => {
    const blogs = await client.fetch(BLOGS_BY_AUTHOR_QUERY, { id });

    return (
        <>
            {blogs.length > 0 ? (
                blogs.map((startup: BlogTypeCard) => (
                    <BlogCard key={startup._id} post={startup} />
                ))
            ) : (
                <p className="no-result">No hay blog publicados.</p>
            )}
        </>
    );
};

export default UserBlogs;
