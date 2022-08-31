import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import validator from 'validator'
const prisma = new PrismaClient()
import {Author, ErrorMessage} from './types/types'

function excludePassword(author: Author): Author {
    if (author.hasOwnProperty('password')) {
    delete author.password
    }
    return author
}

async function getAllAuthors (excludeUsersPassword: boolean = true): Promise<Author[] | null> {
    let allAuthors = await prisma.author.findMany()

    if (excludeUsersPassword) {
    let authors = allAuthors.map(author => excludePassword(author))
    return authors
    } else {
    return allAuthors
    }
}

async function getAuthorById (id: number, excludeUsersPassword: boolean = true): Promise<Author | ErrorMessage> {

    let author = await prisma.author.findFirst({
        where: {
            id
        }
    })

    if (excludeUsersPassword && author) {
    return excludePassword(author)
    } 

    return author ? author : "No author found with that id."
}

async function getAuthorByEmail(email: string, excludeUsersPassword: boolean = true): Promise<Author | ErrorMessage> {
    const author = await prisma.author.findFirst({
        where: {
            email
        }
    })

    if (excludeUsersPassword && author) {
    return excludePassword(author)
    } 
    
    return author ? author : "No author found with that email." as ErrorMessage
}

async function createAuthor (username: string, email: string, password: string, ): Promise<Author | ErrorMessage> {
    if (!validator.isEmail(email)) {
        return "Invalid email"
    } else if (username.length < 1) {
        return "Username must be at least 1 character long"
    } else if (password.length < 6) {
        return "Password must be at least 6 characters long"
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const author = await prisma.author.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    })

    return author ? author : "Error creating author"
}

async function getAuthorsPosts(authorId: number): Promise<Author | ErrorMessage> {
    const authorsPosts = await prisma.author.findFirst({
        where: {
            id: authorId
        },
        include: {
            posts: true
        }
    })

    return authorsPosts ? authorsPosts : "An error occurred" as ErrorMessage
}

async function updateAuthor(author: Author): Promise<Author | ErrorMessage> {
    const oldAuthor = await prisma.author.findFirst({
        where: {
            id: author.id
        }
    })

    if (!oldAuthor) {
        return "No author found with that id."
    }

    if (author.hasOwnProperty('password') && typeof author.password === 'string' && author.password.length > 6) {
        const hashedPassword = await bcrypt.hash(author.password, 10)
        author.password = hashedPassword
    } else {
        return "Password must be at least 6 characters long"
    }

    const updatedAuthor = await prisma.author.update({
        where: {
            id: author.id
        },
        data: {
            username: author.username || oldAuthor.username,
            firstName: author.firstName || oldAuthor.firstName,
            lastName: author.lastName || oldAuthor.lastName,
            roles: author.roles || oldAuthor.roles,
            email: author.email || oldAuthor.email,
            password: author.password || oldAuthor.password,
            registrationDate: author.registrationDate || oldAuthor.registrationDate,
            avatarUrl: author.avatarUrl || oldAuthor.avatarUrl,
            description: author.description || oldAuthor.description,
        }
    })

    return updatedAuthor ? updatedAuthor : "An error occurred"
}

export {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    getAuthorsPosts,
    updateAuthor,
    getAuthorByEmail
}