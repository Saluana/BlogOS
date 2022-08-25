import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import validator from 'validator'
const prisma = new PrismaClient()

export interface Author {
    id: number
    username?: string
    firstName?: string
    lastName?: string
    roles? : string
    email?: string
    password?: string
    registrationDate?: Date
    avatarUrl?: string
    description?: string
    link? : string
    posts?: unknown[]
}

type ErrorMessage = string

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
    } else {
    return author ? author : "No author found with that id."
    }
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

async function updateAuthorsEmail(authorId: number, newEmail: string): Promise<Author | ErrorMessage> {
    const author = await prisma.author.update({
        where: {
            id: authorId
        },
        data: {
            email: newEmail
        }
    })

    return author ? author : "An error occurred" 
}

export default {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    getAuthorsPosts,
    updateAuthorsEmail
}