import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();


console.log("env===>",process.env.MYSQL_HOST);

const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DATABASE;

const connection = mysql.createConnection({

    host: host,
    user: user,
    password: password,
    database: database
    
});


connection.connect((error)=>{
    if(error) return console.log('error', error);
    console.log("connection successfully to DB");
});

export default connection;