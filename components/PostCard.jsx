import Link from 'next/link'
import Tags from './Tags';

export default function PostCard({ post }) {
    const postURL = "/blog/" + post.slug;
    return (
        <div className="my-12 flex justify-between flex-col lg:flex-row dark:text-white">
    <span className="md:w-1/5 font-bold md:pt-1 text-gray-700 dark:text-gray-300">
        {post.createdAt}
    </span>
    <div className="md:w-5/6">
        <Link href={postURL}>
            <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-300 dark:text-gray-100 dark:hover:text-blue-400">
                {post.title}
            </h2>
        </Link>
        
        <Tags tags={post.tags} />
        <div className="text-gray-700 mt-2 dark:text-gray-300">
            {post.description.length > 200
                ? post.description.slice(0, 200) + "..."
                : post.description}
        </div>
        <Link
            className="my-4 font-bold text-blue-700 hover:text-blue-900 block transition-colors duration-300 dark:text-blue-400 dark:hover:text-blue-600"
            href={postURL}
        >
            Read more →
        </Link>
    </div>
</div>
    );
}