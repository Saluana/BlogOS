import express from "express"; const app = express();
import dotenv from "dotenv"; dotenv.config();
import cors from "cors"; app.use(cors());
const port = process.env.SERVER_PORT || 3001;

app.use(express.json())

import authentication from "./routes/authentication"; app.use("/api/auth", authentication);
import posts from "./routes/posts"; app.use("/api/posts", posts);
import categories from "./routes/categories"; app.use("/api/categories", categories);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})