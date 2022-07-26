const { Client } = require("pg");

const client = new Client({
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    host: 'localhost',
}) 
client.connect(); 

module.exports =  client ;