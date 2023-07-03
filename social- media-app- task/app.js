import express from 'express';
import { connectToDB } from './src/database/database.js';
import router from './src/routes/index.router.js';
import dotenv from "dotenv";
dotenv.config();
connectToDB();
const app = express();

console.log(process.env.PORT);
app.use(express.json());
app.use(router);


const port = process.env.PORT || 3000;


app.listen(port, ()=>{
    console.log(`connected to  server ${port}`);
})