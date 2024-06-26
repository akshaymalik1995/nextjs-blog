import Head from 'next/head'
import Link from 'next/link'
export default function CustomHead({ title, description, image, children }) {
    title = title ? title : "Next.js Blog"
    description = description ? description : "A blog built with Next.js"
    image = image ? image : "https://images.unsplash.com/photo-1622835047087-8b2b8b5b5b0f?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzNnx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=60"
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} key="title" />
            <meta property="og:description" content={description} key="description" />
            <meta property="og:image" content={image} key="image" />
            {children}
        </Head>
    )
}
