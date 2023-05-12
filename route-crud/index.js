const dotenv = require('dotenv').config();
const express = require("express");
const app = express();
 const port = 3000;
//  const dbPath = "./db.json";
const pizzaRouter = require("./pizza.router");
const burgerRouter = require("./burger.router");
const pastaRouter = require("./pasta.router");

app.use("/pizza", pizzaRouter);
app.use("/burger", burgerRouter);
app.use("/pasta", pastaRouter);


app.listen(3000, () => {
    console.log(`Server started on port ${port}`);
});


















// const pizzaArray = data.pizza;
// const nextId = pizzaArray.length + 1;
// const newPizza = { id: nextId, name: "newpizzaname", price: 500 };
// pizzaArray.push(newPizza);
// const newData = JSON.stringify(data);
// console.log(newData);
// //



// app.listen(3000, () => {
//     console.log(`Server started on port ${port}`);
// });
