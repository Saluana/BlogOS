import express from "express"; let router = express.Router();
import { NewPost, ErrorMessage, JWTPayload } from "../models/types/types";
import * as posts from "../models/posts";
import { authenticate } from "../middleware/authenticate";
import {filterNewPostReq, filterUpdatePostReq} from "../scripts/requestFilters";
import {isAuthorOfPost} from "../scripts/requestChecks";

//Create a new post
router.post("/", authenticate, async (req, res) => {
    req.body.authorId = req.user.id;
    const newPost: NewPost | ErrorMessage = filterNewPostReq(req.body);

    if (typeof newPost === "string") return res.status(400).send(newPost);

    try {
        const post = await posts.createPost(newPost as NewPost);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).send(err);
    }
});

//get all posts
router.get("/all-posts", async (req, res) => {
    try {
        const allPosts = await posts.getAllPosts();
        return res.status(200).json(allPosts);
    } catch (err) {
        return res.status(500).send(err);
    }
});

//get post by link
router.get("/link/:link", async (req, res) => {
try {
    const post = await posts.getPostByLink(req.params.link);
    return res.status(200).json(post);
} catch (err) {
    return res.status(500).send(err);
}
})

//get post by id
router.get("/:id", async (req, res) => {
    const id: number = Number(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid id.");

    try {
        const post = await posts.getPostById(id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).send(err);
    }
})

//Get post by page number and limit
router.get("/", async (req, res) => {
    const { page, limit } = req.query;

    if (isNaN(Number(page)) || isNaN(Number(limit))) return res.status(400).send("Invalid page or limit.");
    if (Number(page) < 1 || Number(limit) < 1) return res.status(400).send("Page or limit must be greater than 0.");
    
    const start: number = (Number(page) - 1) * Number(limit);
    const end: number = Number(page) * Number(limit);
    

    const rangeOfPosts = await posts.getRangeOfPosts(start, end);
    if (typeof rangeOfPosts === "string") return res.status(400).send(rangeOfPosts);
    return res.status(200).json(rangeOfPosts);
});

//Edit post
router.put("/:id", authenticate, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid id.");

    const didAuthorPost = await isAuthorOfPost(req.user.id, id);
    if (!didAuthorPost) return res.status(403).send("You do not have permission to edit this post.");

    const post = filterUpdatePostReq(req.body);
    if (typeof post === "string") return res.status(400).send(post);
    
    post.id = id;
    post.authorId = req.user.id;

    try {
        const updatedPost = await posts.updatePost(post);
        return res.status(200).json(updatedPost);
    } catch (err) {
        return res.status(500).send(err);
    }
})

//Delete post
router.delete("/:id", authenticate, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid id.");

    const didAuthorPost: boolean = await isAuthorOfPost(req.user.id, id);
    if (!didAuthorPost && req.user.roles != ("admin" || "editor")) return res.status(403).send("You do not have permission to delete this post.");

    try {
        const deletedPost = await posts.deletePost(id);
        return res.status(200).json(deletedPost);
    } catch (err: unknown) {
        return res.status(500).send(err);
    }
})

export default router