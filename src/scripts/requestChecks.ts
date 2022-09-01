import { getPostById } from '../models/posts';

export async function isAuthorOfPost (authorId: number, PostId: number): Promise<boolean> {
    try {
    const post = await getPostById(PostId);
    if (typeof post === "string") return false;
    return post.authorId === authorId;
    } catch (err) {
        console.log(err)
        return false;
    }   
}

