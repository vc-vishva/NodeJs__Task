import express from "express";
import { connectToDB } from "./db/connection";
import router from "./routes/index";

import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(router);
connectToDB();
const port = 3000;

app.listen(port, () => {
  console.log(`server connected ${port}`);
});
