import express from "express";
import user from "./routes/user.route.js";
import permission from "./routes/permission.route.js";
import role from "./routes/role.route.js";

const app= express();
app.use(express.json());
app.use("/user", user);
app.use("/role", role);
app.use("/permission", permission);


app.listen(3000, ()=> console.log("Server is running on ", 3000));