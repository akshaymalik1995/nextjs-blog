import PostCard from "./PostCard"

/**
 * Renders a list of posts using the PostCard component
 * @param {Array} posts - An array of post objects
 * @returns {JSX.Element} - A list of PostCard components
 */
export default function PostList({ posts }) {
   
    return (
        <>
            <div>
                {posts.map(post => (
                    <div key={post.id} >
                        <PostCard key={post.id}  post={post} />
                        <hr></hr>
                    </div>
                ))}
            </div>
        </>
    )
}