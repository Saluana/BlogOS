import express from 'express'; let router = express.Router();
import { Author, ErrorMessage, JWTPayload } from '../models/types/types';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import validator from 'validator';
import { createAuthor, getAuthorByEmail } from '../models/authors';
import {errorHandler} from '../scripts/errorHandler';

interface PrismaError {
    code: string;
    meta: {
        target: string[];
    }
    clientVersion: string;
}

function setPayload (author: Author): JWTPayload {
    let payload = author as JWTPayload;

    if (author.hasOwnProperty('password')) {
        delete author.password
    } else if (author.hasOwnProperty('description')) {
        delete author.description
    } 

    payload.iat = Date.now();
    payload.iss = process.env.WEBSITE_URL as string;

    return payload
}

//Create an author
router.post('/new-author', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).send("Missing required fields.");

    try {
        let author: Author | ErrorMessage = await createAuthor(username, email, password);
        if (typeof author === 'string') return res.status(400).send(author);
        const payload = setPayload(author);
        const token = JWT.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '30d' });
        return res.status(200).json({ author, token });
    } catch (err) {
        let error = errorHandler(err);
        return res.status(500).send(error);
    }

})

//Sign in
router.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Missing required fields.");
    if (password.length < 6) return res.status(400).send("Password does not match."); //Change l8er
    if (!validator.isEmail(email)) return res.status(400).send("Invalid email.") //Change l8er
    let author: Author | ErrorMessage;

    try {
        author = await getAuthorByEmail(email, false);

        if (typeof author === 'string') return res.status(400).send(author);

        let doesPasswordmatch = await bcrypt.compare(password, author.password as string);
        if (!doesPasswordmatch) return res.status(400).send("Password does not match.");

        const payload = setPayload(author);
        const token = JWT.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '30d' });

        return res.status(200).send({ author, token }); //Author sent back contains password. Change l8er
    } catch (err) {
        return res.status(500).send(err);
    }
})

export default router;




