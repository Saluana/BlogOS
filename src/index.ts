import express from "express"; const app = express();
import dotenv from "dotenv"; dotenv.config();
import cors from "cors"; app.use(cors());
const port = process.env.SERVER_PORT || 3001;

app.use(express.json())

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})