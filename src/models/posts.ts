import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { Author } from './authors';

export interface Post {
    id: number
    title?: string
    date?: Date
    link?: string
    description?: string
    lastUpdated?: Date
    status?: string
    content?: string
    author?: Author
    authorId?: number
    featuredImageUrl?: string
    category?: string
    categoryId?: number
    tags?: string[]
}

interface NewPost {
    title: string
    description?: string
    content?: string
    authorId: number
    categoryId: number
    tags?: string[]
    link?: string
    featuredImageUrl?: string
}

type PostId = number;

type ErrorMessage = string

async function getAllPosts (): Promise<Post[] | ErrorMessage> {
    let allPosts = await prisma.post.findMany()

    return allPosts ? allPosts as Post[] : "No posts found." as ErrorMessage
}

async function getRangeOfPosts (start: number, end: number): Promise<Post[] | ErrorMessage> {
    let posts = await prisma.post.findMany({
        skip: start,
        take: end
    })

    return posts ? posts as Post[] : "No posts found." as ErrorMessage
}

async function getPostById (id: PostId): Promise<Post | ErrorMessage> {

    let post = await prisma.post.findFirst({
        where: {
            id
        }
    })

    return post ? post as Post : "No post found with that id." as ErrorMessage
}

async function createPost (post: NewPost): Promise<NewPost | ErrorMessage> {
    if (post.title.length < 1) {
        return "Title must be at least 1 character long"
    } else if (post.title.length > 60) {
        return "Title must be less than 60 characters long"
    } else if (!post.authorId) {
        return "Author id is required"
    } else if (!post.categoryId) {
        return "Category id is required"
    }

const newPost = await prisma.post.create({
    data: {
        title: post.title,
        description: post.description || "",
        content: post.content || "",
        authorId: post.authorId,
        categoryId: post.categoryId,
        tags: post.tags || [],
        link: post.link || post.title.replace(/\s/g, '-'),
        featuredImageUrl: post.featuredImageUrl || "",
    }
})

    return newPost ? newPost as NewPost : "Error creating post" as ErrorMessage
}

async function updatePost (updatedPost: Post): Promise<Post | ErrorMessage> {
    const oldPost = await getPostById(updatedPost.id);

    if (typeof oldPost === "string") {
        return "No post found with that id." as ErrorMessage
    } else if (updatedPost.title && updatedPost.title.length > 60) {
        return "Title must be less than 60 characters long"
    } else if (updatedPost.title && updatedPost.title.length < 1) {
        return "Title must be at least 1 character long"
    } 

    //update post 
    const changedPost = await prisma.post.update({
        where: {
            id: updatedPost.id
        },
        data: {
            title: updatedPost.title || oldPost.title,
            description: updatedPost.description || oldPost.description,
            content: updatedPost.content || oldPost.content,
            authorId: updatedPost.authorId || oldPost.authorId,
            categoryId: updatedPost.categoryId || oldPost.categoryId,
            tags: updatedPost.tags || oldPost.tags,
            link: updatedPost.link || oldPost.link,
            featuredImageUrl: updatedPost.featuredImageUrl || oldPost.featuredImageUrl,
            lastUpdated: new Date(),
            status: updatedPost.status || oldPost.status,
        }
    })

    return changedPost ? changedPost as Post : "Error updating post" as ErrorMessage
}

async function deletePost (id: PostId): Promise<Post | ErrorMessage> {
    const post = await getPostById(id);
    if (typeof post === "string") {
        return "No post found with that id." as ErrorMessage
    }

    const deletedPost = await prisma.post.delete({
        where: {
            id
        }
    })

    return deletedPost ? post as Post : "Error deleting post" as ErrorMessage
}

async function getPostCount(): Promise<number | ErrorMessage> {
    const count = await prisma.post.count()

    return count ? count : "No posts found." as ErrorMessage
}

export { getAllPosts, getRangeOfPosts, getPostById, createPost, updatePost, deletePost, getPostCount }