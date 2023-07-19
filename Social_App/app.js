import express from "express";
import { connectToDB } from "./src/database/database.js";
import router from "./src/routes/index.router.js";
import dotenv from "dotenv";
import YAML from "yamljs";
import swaggerUI from "swagger-ui-express";
// import swaggerJSDoc from "swagger-jsdoc";
const swaggerJSDoc = YAML.load("./swagger.yaml");
const app = express();
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDoc));
// import { version } from "joi";
dotenv.config();
connectToDB();
// const specs = swaggerJSDoc(options);
//swaggerUI.setup(swaggerJSDoc)
// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "social app  Api",
//       version: "1.0.0",
//       description: "simple express  Api ",
//     },
//     servers: [
//       {
//         url: "http://localhost:3000",
//       },
//     ],
//   },
//   apis: ["./routes/*.js"],
// };

console.log(process.env.PORT);
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`connected to  server ${port}`);
});
