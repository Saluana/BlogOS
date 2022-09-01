import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { Post, ErrorMessage, Category } from './types/types';

async function createCategory (category: Category): Promise<Category | ErrorMessage> {
    if (!category.title) {
        return "Category title is required." as ErrorMessage
    }
    //check if category with same title already exists
    const existingCategory = await prisma.category.findFirst({
        where: {
            title: category.title
        }
    })

    if (existingCategory) {
        return "Category with that title already exists." as ErrorMessage
    }

    const newCategory = await prisma.category.create({
        data: {
            title: category.title,
            description: category.description,
            link: category.link || category.title.replace(/\s/g, '-'),
            parent: category.parent || ""
        }
    })

    return newCategory as Category || "Error creating category." as ErrorMessage
}

async function getAllCategories (): Promise<Category[] | ErrorMessage> {
    let allCategories = await prisma.category.findMany()

    return allCategories ? allCategories as Category[] : "No categories found." as ErrorMessage
}

async function getCategoryById (id: number): Promise<Category | ErrorMessage> {
    let category = await prisma.category.findFirst({
        where: {
            id
        }
    })

    return category ? category as Category : "No category found with that id." as ErrorMessage
}

async function updateCategory (category: Category): Promise<Category | ErrorMessage> {
    if (!category.id) {
        return "Category id is required." as ErrorMessage
    }

    const oldCategory = await prisma.category.findFirst({
        where: {
            id: category.id
        }
    })

    if (!oldCategory) {
        return "No category found with that id." as ErrorMessage
    }
    
    const updatedCategory = await prisma.category.update({
        where: {
            id: category.id
        },
        data: {
            title: category.title || oldCategory.title,
            description: category.description || oldCategory.description,
            link: category.link || oldCategory.link,
            parent: category.parent || oldCategory.parent
        }
    })
    
    return updatedCategory as Category || "Error updating category." as ErrorMessage
}

async function removeCategory (id: number, removePosts: boolean = false): Promise<Category | ErrorMessage> {
    const category = await prisma.category.findFirst({
        where: {
            id
        }
    })
    
    if (!category) {
        return "No category found with that id." as ErrorMessage
    }

    const uncategorized = await prisma.category.findFirst({
        where: {
            title: "Uncategorized"
        }
    })

    if (uncategorized) {
        await prisma.post.updateMany({
            where: {
                categoryId: id
            },
            data: {
                categoryId: uncategorized.id
            }
        })
    } else {
        const newUncategorized = await prisma.category.create({
            data: {
                title: "Uncategorized",
                description: "Uncategorized posts",
                link: "uncategorized",
                parent: ""
            }
        })

        const updatedPosts = await prisma.post.updateMany({
            where: {
                categoryId: id
            },
            data: {
                categoryId: newUncategorized.id
            }
        })

        if (!updatedPosts) {
            return "Something went wrong moving the posts." as ErrorMessage
        }
    }

    var removedCategory = await prisma.category.delete({
        where: {
            id
        }
    })
    
    return removedCategory as Category || "Error removing category." as ErrorMessage
}

async function getPostsByCategory (id: number): Promise<Post[] | ErrorMessage> {
    const posts = await prisma.post.findMany({
        where: {
            categoryId: id
        }
    })

    return posts ? posts as Post[] : "No posts found." as ErrorMessage
}

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    removeCategory,
    getPostsByCategory
}
