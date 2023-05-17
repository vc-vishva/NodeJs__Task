const dotenv = require('dotenv').config();
const express = require('express');

const fs = require('fs/promises');
const jwt = require('jsonwebtoken');
const bodyParser =require('body-parser')
const bcrypt = require('bcrypt');
const port = 3000;

const jwtRouter = require("./jwt.router");
const app =express();
app.use("/", jwtRouter);




app.use(bodyParser.json());


//


app.listen(3000,()=>{
    console.log(`connected ${port}`);
})