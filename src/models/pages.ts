import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import {Page, ErrorMessage} from './types/types';
import {stringToLink} from '../scripts/parsers'

async function createPage (page: Page): Promise<Page | ErrorMessage> {

    if (!page.title) return "Page title is required." as ErrorMessage
    const existingPage = await prisma.page.findFirst({
        where: {
            link: page.link || stringToLink(page.title)
        }
    })

    if (existingPage) return "Page with that link already exists." as ErrorMessage
    if (!page.authorId) return "Page author id is required." as ErrorMessage

    const newPage = await prisma.page.create({
        data: {
            title: page.title,
            link: page.link || stringToLink(page.title),
            content: page.content || "",
            authorId: page.authorId,
            status: page.status || "draft",
            featuredImageUrl: page.featuredImageUrl || "",
            meta: page.meta || "{}"
        }
    })

    return newPage as Page || "Error creating page." as ErrorMessage
}

async function getAllPages (): Promise<Page[] | ErrorMessage> {
    let allPages = await prisma.page.findMany()

    return allPages ? allPages as Page[] : "No pages found." as ErrorMessage
}

async function getPageById (id: number): Promise<Page | ErrorMessage> {
    let page = await prisma.page.findFirst({
        where: {
            id
        }
    })

    return page ? page as Page : "No page found with that id." as ErrorMessage
}

async function updatePage (page: Page): Promise<Page | ErrorMessage> {
    const oldPage = await prisma.page.findFirst({
        where: {
            id: page.id
        }
    })

    if (!oldPage) return "No page found with that id." as ErrorMessage

    const updatedPage = await prisma.page.update({
        where: {
            id: page.id
        },
        data: {
            title: page.title || oldPage.title,
            link: page.link || oldPage.link,
            content: page.content || oldPage.content,
            authorId: page.authorId || oldPage.authorId,
            status: page.status || oldPage.status,
            featuredImageUrl: page.featuredImageUrl || oldPage.featuredImageUrl,
            meta: page.meta || oldPage.meta,
            lastUpdated: new Date()
        }
    })

    return updatedPage as Page || "Error updating page." as ErrorMessage
}

async function deletePage (id: number): Promise<Page | ErrorMessage> {
    const oldPage = await prisma.page.findFirst({
        where: {
            id
        }
    })

    if (!oldPage) return "No page found with that id." as ErrorMessage

    const deletedPage = await prisma.page.delete({
        where: {
            id
        }
    })

    return deletedPage as Page || "Error deleting page." as ErrorMessage
}

export { createPage, getAllPages, getPageById, updatePage, deletePage }