import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';
import { formatDate } from '@/utils';
import { PrismaClient } from '@prisma/client';
import  matter from "gray-matter"
import { markdownToHtml } from '@/utils';
import { getAuth } from "@clerk/nextjs/server";
export async function getServerSideProps(context) {
    const { userId } = getAuth(context.req)
    if (!userId) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const { slug } = context.query
    let post = null
    // Get Post from database
    const prisma = new PrismaClient()
    try {
        post = await prisma.post.findUnique({
            where: {
                slug: slug
            },
            include: {
                tags: {
                    select: {
                        name: true
                    }
                }
            }


        })
    }
    catch (error) {
        console.log(error)
        // Return a 404 page
        return {
            notFound: true
        }
    }
    finally {
        await prisma.$disconnect()
    }


    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post: { ...post, createdAt: formatDate(post.createdAt), updatedAt: formatDate(post.updatedAt) }
        }
    }
}

export default function Edit(props) {
    const { post } = props;
    // Create refs for form elements
    const [loading, setLoading] = useState(false);
    const contentRef = useRef();
    // Create state for publish checkbox
    const [publish, setPublish] = useState(true);
    const defaultContent = `---
title : ${post.title}
description : ${post.description}
date : ${post.createdAt}
tags :
- ${post.tags.map(tag => tag.name).join('\n- ')}
---
${post.content}`;

    const [content, setContent] = useState(defaultContent);
    const [error, setError] = useState(null);
    const [previewOn, setPreviewOn] = useState(false);
    const [previewContent, setPreviewContent] = useState();

    const router = useRouter();

    // Handle preview mode
    const previewModeHandler = async (e) => {
        try {
            const parsed = matter(content);
            const html = await markdownToHtml(parsed.content);
            setPreviewContent(html);
        } 
        catch (error) {
            console.log(error);
        } finally {
            setPreviewOn(true);
        }

    }

    // Handle edit mode
    const editModeHandler = (e) => {
        setPreviewOn(false);
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Set loading to true
        setLoading(true);
        // Get values from form elements
        const published = publish;
        // Send Post Request to /api/blog
        const res = await fetch(`/api/blog/${post.id}`, {
            method: 'PUT',
            body: JSON.stringify({ content, published }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // Get response
        const data = await res.json();
        // If response is ok, redirect to blog page
        if (res.ok) {
            // Set loading to false
            setTimeout(() => {
                setLoading(false);
            }, 1000);
            // Redirect to blog page
            console.log(data.message)
            router.push(`/blog/${data.post.slug}`);
        }
        else {
            // Set loading to false
            setLoading(false);
            // Show error message
            setError(data.error);
        }
    }

    return (
        <div className="max-w-4xl p-4 mx-auto " >
            {/* If loading is true, show loading component */}
            {loading && <Loading />}

            {/* Buttons to toggle Edit mode and Preview Mode */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={editModeHandler} className={`${!previewOn ? "btn-red" : "btn-black"} rounded-none flex-grow `}>Edit</button>
                <button onClick={previewModeHandler} className={`${previewOn ? "btn-red" : "btn-black"} rounded-none flex-grow `}>Preview</button>
            </div>


            {/* If previewOn is true, show preview content */}
            {previewOn ? (
                <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: previewContent }}></article>
            ) : ( <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold">Edit Post</h1>
            <div className="form-control">
                {/* If error is not null, show error message */}
                {error && <p className="text-red-500 my-2 text-bold ">{error}</p>}
                <textarea ref={contentRef} onChange={(e) => setContent(e.target.value)} value={content} className="textarea h-96 textarea-lg  border-none outline-none focus:border-none focus:outline-none font-mono scrollbar-none resize-y w-full"></textarea>
            </div>
            <label className="flex items-center cursor-pointer">
                <input
                    checked={publish}
                    onChange={(e) => setPublish(e.target.checked)}
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-gray-600"
                />
                <span className="ml-2 text-gray-700 text-bold">Publish</span>
            </label>
            <div className="form-control">
                <button
                    type="submit"
                    className="btn-black"
                >
                    Submit
                </button>
            </div>
        </form>)}
        </div>
    )
}

