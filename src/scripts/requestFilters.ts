import {NewPost, Post, ErrorMessage, Category, SiteSettings, Page} from '../models/types/types';

/* --- POST FILTERS --- */
//Filter requests for new posts
export function filterNewPostReq(requestBody: object): NewPost | ErrorMessage {
    const allowedKeys = ['title', 'description', 'content', 'authorId', 'categoryId', 'tags', 'link', 'featuredImageUrl', 'status'];
    const filteredBody = {};
    Object.keys(requestBody).forEach(key => {
        if (allowedKeys.includes(key)) {
            filteredBody[key as keyof object] = requestBody[key as keyof object];
        }
    })

    return filteredBody ? filteredBody as NewPost : "Invalid post." as ErrorMessage;
}

//Filter requests for updating posts
export function filterUpdatePostReq(requestBody: object): Post | ErrorMessage {
    const filteredPost = filterNewPostReq(requestBody);
    if (typeof filteredPost === "string") {
        return filteredPost as ErrorMessage;
    }

    return filteredPost as Post;
}

/* --- CATEGORY FILTERS --- */
export function filterNewCategoryReq(requestBody: object): Category | ErrorMessage {
    const allowedKeys = ['title', 'description', 'link', 'parent'];
    const filteredBody = {};
    Object.keys(requestBody).forEach(key => {
        if (allowedKeys.includes(key)) {
            filteredBody[key as keyof object] = requestBody[key as keyof object];
        }
    })
    if (!filteredBody.hasOwnProperty('title')) return "Title is required.";

    return filteredBody ? filteredBody as Category : "Invalid category." as ErrorMessage;
}

/* --- SITE SETTINGS FILTERS --- */
export function filterSettingsReq(requestBody: object): SiteSettings | ErrorMessage {
    const allowedKeys = ['title', 'description', 'url', 'email', 'timezone', 'language', 'dateFormat', 'postsPerPage'];
    const filteredBody = {};
    Object.keys(requestBody).forEach(key => {
        if (allowedKeys.includes(key)) {
            filteredBody[key as keyof object] = requestBody[key as keyof object];
        }
    })
    if (!filteredBody.hasOwnProperty('title')) return "Title is required.";

    return filteredBody ? filteredBody as SiteSettings : "Invalid site settings." as ErrorMessage;
}

/* --- PAGE FILTERS --- */
export function filterPageReq(requestBody: object): Page | ErrorMessage {
    const allowedKeys = ['link', 'title', 'content', 'featuredImageUrl', 'menuOrder', 'meta'];
    const filteredBody = {};
    Object.keys(requestBody).forEach(key => {
        if (allowedKeys.includes(key)) {
            filteredBody[key as keyof object] = requestBody[key as keyof object];
        }
    })

    return filteredBody ? filteredBody as Page : "Invalid page." as ErrorMessage;
}