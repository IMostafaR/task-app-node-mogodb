import dotenv from "dotenv";
import express from "express";
import { router } from "./src/router.js";

dotenv.config();
const app = express();
const port = 3000;

router(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
