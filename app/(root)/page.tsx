import BlogCard, { BlogTypeCard } from '@/components/BlogCard';
import SearchForm from '../../components/SearchForm';
import { BLOGS_QUERY } from '@/sanity/lib/queries';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';

export default async function Home({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    const query = (await searchParams).query;
    const params = { search: query || null };
    const { data: posts } = await sanityFetch({ query: BLOGS_QUERY, params });

    return (
        <>
            <section className="pink_container">
                <h1 className="heading">
                    Escribe a tu manera, <br /> sobre lo que te apasiona
                </h1>
                <p className="sub-heading !max-w-3xl">
                    Crea un blog atractivo y original facilmente.
                </p>
                <SearchForm query={query} />
            </section>

            <section className="section_container">
                <p className="text-30-semibold">
                    {query ? `Resultados para "${query}" :` : 'Todos los blogs'}
                </p>

                <ul className="mt-7 card_grid">
                    {posts?.length > 0 ? (
                        posts.map((post: BlogTypeCard) => (
                            <BlogCard key={post?._id} post={post} />
                        ))
                    ) : (
                        <p className="no-results">No se encontraron blogs.</p>
                    )}
                </ul>
            </section>

            <SanityLive />
        </>
    );
}
