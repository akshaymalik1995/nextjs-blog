
// Import Prisma Client to interact with the database
import { PrismaClient } from "@prisma/client"

// Import slugify function to create a slug from the title
import { slugify , getTagsByPostId} from "@/utils"


// Import gray-matter to parse markdown content
import  matter from "gray-matter"
import { getAuth } from "@clerk/nextjs/server";
export default async function handler(req, res) {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" })
    }

    // If the request method is DELETE
    if (req.method === "DELETE") {
        // Get the id from the request query
        const { id } = req.query
        // If id is not present in the query, return an error
        if (!id) {
            return res.status(400).json({ error: "Please add a post id" })
        }
        // Instantiate Prisma Client
        const prisma = new PrismaClient()
        try {
            // Delete the post with the given id
            const post = await prisma.post.delete({
                where: {
                    id: parseInt(id)
                }
            })
            // If post is deleted successfully, return success message
            if (post) {
                return res.status(200).json({ message: "Post deleted successfully" })
            }
            // If post is not found, return error message
            else {
                return res.status(404).json({ error: "Post not found" })
            }
        }
        // If there is an error, return error message
        catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Something went wrong" })
        }
        // Disconnect Prisma Client
        finally {
            await prisma.$disconnect()
        }
    }
    // If the request method is PUT
    if (req.method === 'PUT' ) {
        // Get the id from the request query
        const { id } = req.query
        // If id is not present in the query, return an error
        if (!id) {
            return res.status(400).json({ error: "Please add a post id" })
        }
        
        // Get the content and published status from the request body
        let { content, published } = req.body
       
        // If content is not present in the request body, return an error
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
            return res.status(500).json({ error: "There were some error parsing the metadata. Make sure the metadata is in correct format." })
        }
        
        // Get the content from the parsed markdown
        content = parsed.content
        // If content is not present in the parsed markdown, return an error
        if (!content) {
            return res.status(400).json({ error: "Please add some content" })
        }
        // Get the title from the parsed markdown
        const title = parsed.data?.title || ""
        // If title is not present in the parsed markdown, return an error
        if (!title) {
            return res.status(400).json({ error: "Please add a title" })
        }
        // Create a slug from the title
        let slug = slugify(title)
        // Get the description from the parsed markdown
        const description = parsed.data.description || ""
        // Get the tags from the parsed markdown
        const tags = parsed.data.tags || []
        // Set published status to false if not present in the request body
        published = published || false
        const createdAt = parsed.data.date || new Date()

        const oldTags = await getTagsByPostId(+id)

        try {
            // Update the post with the given id
            const post = await prisma.post.update({
                where: {
                    id: +id
                },
                data: {
                    title,
                    description,
                    content,
                    published,
                    createdAt,
                    slug,
                    // Disconnect all the previous tags and connect the new tags
                    
                    tags: {
                        disconnect: oldTags.map((tag) => {
                            return {
                                id: tag.id
                            }
                        }
                        ),
                        // Create or connect new tags
                        connectOrCreate: tags.map((tag) => {
                            return {
                                where: {
                                    name: tag.toLowerCase()
                                },
                                create: {
                                    name: tag.toLowerCase()
                                }
                            }
                        }


                        )
                    }
                }
            })
            // If post is updated successfully, return success message and updated post
            if (post) {
                return res.status(200).json({ message: "Post Updated successfully" , post})
            }
            // If post is not found, return error message
            else {
                return res.status(404).json({ error: "Post not found" })
            }
        }
        // If there is an error, return error message
        catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Update failed" })
        }
        // Disconnect Prisma Client
        finally {
            await prisma.$disconnect()
        }
    }
}
