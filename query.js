// Delete all the posts from the database using Prisma Client


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const deleteAllPosts = async () => {
    const posts = await prisma.post.deleteMany()
    console.log(posts)
}

deleteAllPosts()
    .catch((e) => {
        throw e
    }
    )
    .finally(async () => {
        await prisma.$disconnect()
    }
    )
