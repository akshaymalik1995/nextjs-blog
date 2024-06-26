import Link from 'next/link'
import Tags from './Tags';
import { Link as ScrollLink } from 'react-scroll';
export default function Blog({ post, headings }) {
    return (
        <>
            <nav className="breadcrumb my-4 dark:text-gray-300">
    <Link href="/blog" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100">Blog</Link>
    <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
    <span className="text-gray-700 dark:text-gray-100">{post.title}</span>
</nav>

<h1 className="header-title text-4xl text-gray-900 dark:text-white">{post.title}</h1>

{/* ADD TAGS */}
<Tags tags={post.tags} />
<div className="text-sm my-2 text-gray-600 dark:text-gray-400">
    {post.createdAt}
</div>
<hr className="border-gray-400 dark:border-gray-600"></hr>

{/* Table of Content */}
{headings && headings.length > 1 ? (<div className="my-8 ">
    <div className="text-gray-500 text-sm dark:text-gray-400">
        <h3 className="text-gray-700 text-lg mb-2 dark:text-white">Table of Contents</h3>
        <ul className="list-disc list-inside">
            {headings.map((heading, index) => (
                <li key={index} className={`pl-${heading.level * 2}  my-1`}>
                    <ScrollLink
                        to={heading.id}
                        smooth={true}
                        duration={500}
                        className="hover:text-gray-700 cursor-pointer dark:hover:text-gray-100"

                    >{heading.text}</ScrollLink>
                </li>
            ))}
        </ul>
    </div>
</div>) : ""}
{/* End Table of Content */}

<article dangerouslySetInnerHTML={{ __html: post.content }} className="prose my-8 lg:prose-lg text-gray-700 dark:text-gray-100">

</article>
        </>
    )
}