import express from "express"; let router = express.Router();
import { SiteSettings, ErrorMessage } from "../models/types/types";
import * as settings from "../models/settings";
import { authenticate } from "../middleware/authenticate";
import { errorHandler } from "../scripts/errorHandler";
import { filterSettingsReq } from "../scripts/requestFilters";
import validator from "validator";

//Get site settings
router.get("/", async (req, res) => {
    try {
        const siteSettings = await settings.getSite();
        if (typeof siteSettings === "string") return res.status(400).send(siteSettings as ErrorMessage);
        return res.status(200).json(siteSettings as SiteSettings);
    } catch (err) {
        const error = errorHandler(err);
        return res.status(500).send(error);
    }
})

//Create site settings
router.post("/", authenticate, async (req, res) => {
    if (req.user.roles !== "admin") return res.status(401).send("Unauthorized.");
    if (!validator.isEmail(req.user.email)) return res.status(400).send("Invalid email.");
    const siteCount = await settings.getSiteCount();
    if (siteCount > 0) return res.status(400).send("Site already exists.");

    try {
        const siteSettings = await settings.createSite(req.user.email);
        if (typeof siteSettings === "string") return res.status(400).send(siteSettings as ErrorMessage);
        return res.status(200).json(siteSettings as SiteSettings);
    } catch (err) {
        const error = errorHandler(err);
        return res.status(500).send(error);
    }
});

//Update site settings
router.put("/", authenticate, async (req, res) => {
    if (req.user.roles !== "admin") return res.status(401).send("Unauthorized.");
    const siteCount = await settings.getSiteCount();
    if (siteCount === 0) return res.status(400).send("No site found.");
    const newSettings = filterSettingsReq(req.body);
    if (typeof newSettings === "string") return res.status(400).send(newSettings as ErrorMessage);

    try {
        const siteSettings = await settings.updateSettings(newSettings);
        if (typeof siteSettings === "string") return res.status(400).send(siteSettings as ErrorMessage);
        return res.status(200).json(siteSettings as SiteSettings);
    } catch (err) {
        const error = errorHandler(err);
        return res.status(500).send(error);
    }
});

export default router;