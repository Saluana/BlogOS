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
            email: oldSettings.email
        },
        data: settings
    })

    return updatedSettings as SiteSettings || "Error updating site." as ErrorMessage
}

async function getSiteCount (): Promise<number> {
    const siteCount = await prisma.settings.count()
    return siteCount ? siteCount : 0
}

export {
    createSite,
    getSite,
    updateSettings,
    getSiteCount
}