import express from "express";
import route1 from "./routes/user.route.js";
import route3 from "./routes/permission.route.js";
import route2 from "./routes/role.route.js";


// import connection from "./db/connection.js";


const app= express();
app.use(express.json());
app.use("/user", route1);
app.use("/role", route2);
app.use("/permission", route3);


app.listen(3000, ()=> console.log("Server is running on ", 3000));




















