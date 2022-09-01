import express from "express"; let router = express.Router();
import { Category, ErrorMessage } from "../models/types/types";
import * as categories from "../models/categories";
import { filterNewCategoryReq } from "../scripts/requestFilters";
import { authenticate } from "../middleware/authenticate";
import {errorHandler} from "../scripts/errorHandler";


//Get all categories
router.get("/", async (req, res) => {
    const allCategories = await categories.getAllCategories();
    if (typeof allCategories === "string") return res.status(400).send(allCategories as ErrorMessage);
    try {
    return res.status(200).json(allCategories as Category[]);
    } catch (err) {
        let error = errorHandler(err);
        return res.status(500).send(error);
    }
});

//Get category by id
router.get("/:id", async (req, res) => {
    const id: number = Number(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid id.");
    try {
    const category = await categories.getCategoryById(id);
    if (typeof category === "string") return res.status(400).send(category as ErrorMessage);
    return res.status(200).json(category as Category);
    } catch (err) {
        const error = errorHandler(err);
        return res.status(400).send(error);
    }
    return 
})

//Create category
router.post("/", async (req, res) => {
    const category = filterNewCategoryReq(req.body);
    if (typeof category === "string") return res.status(400).send(category as ErrorMessage);

    try {
    const newCategory = await categories.createCategory(category as Category);
    if (typeof newCategory === "string") return res.status(400).send(newCategory as ErrorMessage);
    res.status(200).json(newCategory as Category);
    } catch (err) {
        const error = errorHandler(err);
        return res.status(500).send(error);
    }

    return 
})

//Update category
router.put("/:id", authenticate,async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid id.");

    const category = filterNewCategoryReq(req.body);
    if (typeof category === "string") return res.status(400).send(category as ErrorMessage);
    category.id = id;

    try {
    var updatedCategory = await categories.updateCategory(category as Category);
    if (typeof updatedCategory === "string") return res.status(400).send(updatedCategory as ErrorMessage);
    return res.status(200).json(updatedCategory as Category);
    } catch (err) {
       let error = errorHandler(err);
        return res.status(400).send(error);
    }

    return 
})

//Delete category
router.delete("/:id", authenticate, async (req, res) => {
    if (req.user.roles !== "admin") return res.status(401).send("Unauthorized.");
    console.log(req.params.id)

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).send("Invalid id.");

    try {
    const deletedCategory = await categories.removeCategory(id);
    if (typeof deletedCategory === "string") return res.status(400).send(deletedCategory as ErrorMessage);
    return res.status(200).json(deletedCategory as Category);
    } catch (err) {
        console.log(err)
        const error = errorHandler(err);
        return res.status(500).send(error);
    }

    return 
})

export default router;

