import connection from "./connection.js";

const query = (query)=>{
    return new Promise((resolve, reject)=>{
        connection.query(query, (error, result, fields)=>{
            if(error) return reject(error);
            resolve(result);
        });
    }).catch(error =>{
        throw error;
    })
}

export default query;