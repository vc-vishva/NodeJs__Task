import express from "express";

import { main } from "./db/connection.js";

import usersRouter from "./routes/user.router.js";
const app = express();
main();
// const port = 3000;
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", usersRouter);

app.listen(port, () => {
  console.log(`server started ${port}`);
});
