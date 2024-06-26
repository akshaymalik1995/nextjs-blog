import { PrismaClient } from "@prisma/client"


export const slugify = (text) => {
    // Add a random number of six digits to the end of the slug to avoid conflicts
    const randomNumber = Math.floor(Math.random() * 1000000)
    text = text.toString().toLowerCase()
    .replace(/\s/g, '-') // Replace spaces with -
    // Remove all symbols except -
    .replace(/[^\w-]+/g, '')
    .replace(/--/g, '-') // Replace multiple - with single -
    .replace(/^-/, "") // Trim - from start of text
    .replace(/-$/, "") // Trim - from end of text
    text = text + "-" + randomNumber
    return text
}


export const cacheContent = (req, res) => {
        res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=30')
}



export const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
}

export const serializePosts = (posts) => {
    if (posts && posts.length > 0) {
        return posts.map(post => {
            return {
              ...post,
              createdAt: formatDate(post.createdAt),
              updatedAt: formatDate(post.updatedAt),
            }
          })
    }
}

import {remark} from 'remark'
import html from 'remark-html'
import highlight from 'remark-highlight.js'

export async function markdownToHtml(markdown) {
    let result = await remark().use(html, {sanitize: false}).use(highlight).process(markdown)
    return result.toString()
}

// Find a post by its slug
export async function getPostBySlug(slug) {
    const prisma = new PrismaClient()
    let post = {}
    try {
        post = await prisma.post.findUnique({
            where: {
                slug
            },
            include: {
                tags: true
        }
    })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect()
    }
    return post
}

            

// Get all tags connected to a post  
export async function getTagsByPostId(id) {
    const prisma = new PrismaClient()
    let tags = []
    try {
        tags = await prisma.tag.findMany({
            where: {
                posts: {
                    some: {
                        id
                    }
                }
            }
        })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect()
    }
    return tags
}


export async function getTagsAndCounts() {
    // Do not include the tags that have no posts
    const prisma = new PrismaClient()
    let tags = []
    try {
        tags = await prisma.tag.findMany({
            // Select the tag name and the count of posts for each tag
            select: {
                name: true,
                _count: {
                    select: {
                        posts: true,
                    },
                    
                    
                }
            },
            // Order the tags by name in descending order
            orderBy: {
                name: 'desc'
            }
        })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect()
    }
    return tags
}

export async function getPostsByTag(tag) {
    const prisma = new PrismaClient()
    let posts = []
    try {
        posts = await prisma.post.findMany({
            where: {
                tags: {
                    some: {
                        name: tag
                    }
                }
            },
            include: {
                tags: true
            }
        })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect()
    }
    return serializePosts(posts)
}

// Get Posts from database


export async function getPosts({skip = 0, take = undefined, orderBy = "desc"}) {
    const prisma = new PrismaClient()
    let posts = []
    try {
        posts = await prisma.post.findMany({
            skip,
            take,
            orderBy: {
                createdAt: orderBy
            },
            // Include the tags for each post
            // Tags should be a list of objects with name and id
            include: {
                tags: {
                    select : {
                        name : true,
                        id : true
                    }
                }
            }

        })
    }
    catch (error) {
        console.log(error)
    }
    finally {
        await prisma.$disconnect()
    }

    

    return serializePosts(posts)
}