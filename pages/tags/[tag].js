import { getPostsByTag, cacheContent } from "@/utils";
import PostList from "@/components/PostList";
export async function getServerSideProps(context) {
    const {req, res} = context
    cacheContent(req, res)
    const { tag } = context.params;
    const posts = await getPostsByTag(tag);
    if (!posts) {
        return {
        notFound: true
        };
    }
    return {
        props: {
        posts,
        tag
        }
    };
}

export default function Tag(props) {
    const { posts, tag } = props;
    return (
        <>
        <div className="container max-w-3xl mx-auto" >
            <h1 className="text-4xl my-12">
                Posts tagged with <span className="text-green-800" >{tag}</span>
                </h1>
            <PostList posts={posts} />
        </div>
        </>
    );
}