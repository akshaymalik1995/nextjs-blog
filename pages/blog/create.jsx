import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';
import matter from 'gray-matter';
import { markdownToHtml, formatDate } from '@/utils';
import {useUser} from "@clerk/nextjs"
import { useEffect } from 'react';

export default function Create() {
    const { isLoading, isSignedIn, user } = useUser()
    const router = useRouter();
    useEffect(() => {
        if (!isLoading && !isSignedIn) {
            router.push('/')
        }
    }, [isLoading, isSignedIn, user]
    )
    const [loading, setLoading] = useState(false);
    // Create state for publish checkbox
    const [publish, setPublish] = useState(true);
    const defaultContent = `---
title : A title for your post
description : A description for your post
date: ${formatDate(new Date())}
tags :
- tag1
- tag2
---
# Write your post here...`;

    const [content, setContent] = useState(defaultContent);
    const [error, setError] = useState(null);
    const [previewOn, setPreviewOn] = useState(false);
    const [previewContent, setPreviewContent] = useState();
    

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
        const res = await fetch('/api/blog', {
            method: 'POST',
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
            
                
            
            // Redirect to blog page
            console.log(data?.message)
            if (data?.post?.slug) {
                router.push(`/blog/${data.post.slug}`);
            }
            setLoading(false);
            
        } 
        else {
            // Set loading to false
            setLoading(false);
            // Show error message
            
            setError(data?.error);
        }
    }

    return (
        <div className="max-w-4xl p-4 mx-auto">
            {/* If loading is true, show loading component */}
            {loading && <Loading />}
            {/* Buttons to toggle Edit mode and Preview Mode */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={editModeHandler} className={`${!previewOn ? "btn-red" : "btn-black"} rounded-none flex-grow `}>Edit</button>
                <button onClick={previewModeHandler} className={`${previewOn ? "btn-red" : "btn-black"} rounded-none flex-grow `}>Preview</button>
            </div>

            {previewOn ? (
                <article className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: previewContent }}></article>
            ) : (
<form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    {/* If error is not null, show error message */}
                    {error && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-2" role="alert">
    <span className="block sm:inline">{error}</span>
  </div>
)}
                   
                    <textarea
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        className="textarea h-96 textarea-lg  border-none outline-none focus:border-none focus:outline-none font-mono scrollbar-none resize-y w-full"
                        id="content"
                        placeholder="Write your post here..."
                    ></textarea>
                </div>
                <div className="form-control">
                    <label className="flex items-center cursor-pointer">
                        <input
                            checked={publish}
                            onChange={(e) => setPublish(e.target.checked)}
                            type="checkbox"
                            className="form-checkbox h-5 w-5 text-gray-600"
                        />
                        <span className="ml-2 text-gray-700 text-bold">Publish</span>
                    </label>
                </div>
                <div className="form-control">
                    <button
                        type="submit"
                        className="btn-black"
                    >
                        Submit
                    </button>
                </div>
            </form>
            )}

            
        </div>
    )
}
