import {NewPost, Post, ErrorMessage} from '../models/types/types';

/* --- POST FILTERS --- */
export function filterNewPostReq(requestBody: object): NewPost | ErrorMessage {
    const allowedKeys = ['title', 'description', 'content', 'authorId', 'categoryId', 'tags', 'link', 'featuredImageUrl', 'status'];
    const filteredBody = {};
    Object.keys(requestBody).forEach(key => {
        if (allowedKeys.includes(key)) {
            filteredBody[key as keyof object] = requestBody[key as keyof object];
        }
    })
    if (!filteredBody.hasOwnProperty('title')) return "Title is required.";
    if (!filteredBody.hasOwnProperty('categoryId')) return "Category is required.";

    return filteredBody ? filteredBody as NewPost : "Invalid post." as ErrorMessage;
}

export function filterUpdatePostReq(requestBody: object): Post | ErrorMessage {
    const filteredPost = filterNewPostReq(requestBody);
    if (typeof filteredPost === "string") {
        return filteredPost as ErrorMessage;
    }

    return filteredPost as Post;
}
