import express from "express";
import dotenv from "dotenv";
dotenv.config();
import routes from "./routes/index.route.js";

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3000, () => console.log("Server is running on 3000"));
