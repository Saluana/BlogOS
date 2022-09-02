import express from "express"; let router = express.Router();
import { Page, ErrorMessage } from "../models/types/types";
import * as pages from "../models/pages";
import { authenticate } from "../middleware/authenticate";
import { errorHandler } from "../scripts/errorHandler";
import { filterPageReq } from "../scripts/requestFilters";

//Get all pages
router.get("/", async (req, res) => {
    try {
        const allPages = await pages.getAllPages();
        return res.json(allPages);
    } catch (err) {
       const error = errorHandler(err);
       return res.status(400).json(error);
    }
})

//Get page by id
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json("Invalid id.");

    try {
        const page = await pages.getPageById(parseInt(req.params.id));
        return res.status(200).json(page);
    } catch (err) {
         const error = errorHandler(err);
         return res.status(400).json(error);
    }
})

//Create page
router.post("/", authenticate, async (req, res) => {
    if (req.user.roles !== "admin") return res.status(401).json("Unauthorized.");

    const page = filterPageReq(req.body);
    const id: number = req.user.id;

    if (isNaN(id)) return res.status(400).json("Invalid id.");
    if (typeof page === "string") return res.status(400).json(page);
    if (!page.hasOwnProperty("title")) return res.status(400).json("Title is required.");
    page.authorId = id;

    try {
        const newPage = await pages.createPage(page);
        return res.status(201).json(newPage);
    } catch (err) {
        const error = errorHandler(err);
        return res.status(400).json(error);
    }
})

//Update page
router.put("/:id", authenticate, async (req, res) => {
    if (req.user.roles !== "admin") return res.status(401).json("Unauthorized.");

    const id = Number(req.params.id);
    const page = filterPageReq(req.body);
    if (isNaN(id)) return res.status(400).json("Invalid id.");
    if (typeof page === "string") return res.status(400).json(page);
    page.id = id;

    try {
        const updatedPage = await pages.updatePage(page);
        return res.status(200).json(updatedPage);
    } catch (err) {
        const error = errorHandler(err);
        return res.status(400).json(error);
    }
})

//Delete page
router.delete("/:id", authenticate, async (req, res) => {
    if (req.user.roles !== "admin") return res.status(401).json("Unauthorized.");

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json("Invalid id.");

    try {
        const deletedPage = await pages.deletePage(id);
        if (typeof deletedPage === "string") return res.status(400).json(deletedPage);
        return res.status(200).json(deletedPage);
    } catch (err) {
        const error = errorHandler(err);
        return res.status(400).json(error);
    }
})

export default router;