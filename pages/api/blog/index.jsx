// API to create a new blog post
// Receives the blog post data in the request body
// Saves the blog post data to the database using Primsa Client

import { PrismaClient } from "@prisma/client"
import { slugify } from "@/utils"
import  matter from "gray-matter"
import { getAuth } from "@clerk/nextjs/server";
import { getTagsByPostId } from "@/utils";
export default async function handler(req, res) {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" })
    }
    // Get the title, description, tags, content, publish from the request body
    let { content, published } = req.body
    if (!content) {
        return res.status(400).json({ error: "Please add some content" })
    }
    
    
    // Instantiate Prisma Client
    const prisma = new PrismaClient()

    // Parse the markdown content using gray-matter
    let parsed
    try {
        parsed = matter(content)
    } catch (error) {
        console.log(error)
        // Return a meaningful error message
        return res.status(500).json({ error: "Something went wrong"})
    }
    
    
    content = parsed.content
    if (!content) {
        return res.status(400).json({ error: "Please add some content" })
    }
    const title = parsed.data?.title || ""
    if (!title) {
        return res.status(400).json({ error: "Please add a title" })
    }

    const description = parsed.data.description || ""
    const tags = parsed.data.tags || []
    published = published || false
    const createdAt = parsed.data.date || new Date()
    const slug = slugify(title)

    

    // Create a new blog post in the database
    try {
        const post = await prisma.post.create({
            data: {
                title,
                description,
                content,
                published,
                createdAt,
                slug,
                tags: {
                    connectOrCreate: tags.map(tag => {
                        return {
                            where: {
                                name: tag.toLowerCase()
                            },
                            create: {
                                name: tag.toLowerCase()
                            }
                        }
                    })
                }
            }
        })
        if (post) {
            res.status(201).json({ message: "Blog post created successfully", post })
        }
    } catch (error) {
        // Return an error if something goes wrong
        res.status(500).json({ error: "Unable to create blog post" })
    } finally {
        // Close the database connection
        await prisma.$disconnect()
    }
}