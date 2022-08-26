export interface Page {
    id?: number
    date?: Date
    link?: string
    lastUpdated?: Date
    status?: string
    title?: string
    content?: string
    authorId?: number
    author?: Author
    featuredImageUrl?: string
    menuOrder?: number
    meta?: string
}

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

export interface Category {
    id?: number;
    title?: string;
    count?: number;
    description?: string;
    link?: string;
    parent?: string;
    posts?: Post[]; 
 }

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

export interface NewPost {
    title: string
    description?: string
    content?: string
    authorId: number
    categoryId: number
    tags?: string[]
    link?: string
    featuredImageUrl?: string
}

export interface SiteSettings {
    id?: number
    title?: string
    description?: string
    url?: string
    email: string
    timezone?: string
    language?: string
    dateFormat?: string
    postsPerPage?: number
}

export type ErrorMessage = string;
export type PostId = number;