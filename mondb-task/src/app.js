import express from "express";

import { main } from "./db/connection.js";

import usersRouter from "./routes/user.router.js";
import placesRouter from "./routes/places.router.js";
import authRouter from "./routes/jwt.router.js";
const app = express();
main();
// const port = 3000;
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/places", placesRouter);
app.use("/", authRouter);

app.listen(port, () => {
  console.log(`server started ${port}`);
});
