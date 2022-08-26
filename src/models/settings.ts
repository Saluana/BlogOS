import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { SiteSettings, ErrorMessage } from './types/types';

async function createSite (email: string): Promise<SiteSettings | ErrorMessage> {
    const newSettings = await prisma.settings.create({
        data: {
            email
        }
    })

    return newSettings as SiteSettings || "Error creating site." as ErrorMessage
}

async function getSite (): Promise<SiteSettings | ErrorMessage> {
    const site = await prisma.settings.findFirst()

    return site ? site as SiteSettings : "No site found." as ErrorMessage
}

async function updateSettings (settings: SiteSettings): Promise<SiteSettings | ErrorMessage> {
    const oldSettings = await prisma.settings.findFirst()

    if (!oldSettings) {
        return "No site found." as ErrorMessage
    }

    const updatedSettings = await prisma.settings.update({
        where: {
            email: settings.email
        },
        data: {
            title: settings.title || oldSettings.title,
            description: settings.description || oldSettings.description,
            url: settings.url || oldSettings.url,
            email: settings.email || oldSettings.email,
            timezone: settings.timezone || oldSettings.timezone,
            language: settings.language || oldSettings.language,
            dateFormat: settings.dateFormat || oldSettings.dateFormat,
            postsPerPage: settings.postsPerPage || oldSettings.postsPerPage
        }
    })

    return updatedSettings as SiteSettings || "Error updating site." as ErrorMessage
}

export default {
    createSite,
    getSite,
    updateSettings
}