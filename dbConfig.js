/*require("dotenv").config();
const {Pool} =require("pg");

/*const {createPool} = require('mysql');
const pool = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"buttonledger",
    connectionLimit:100
});


const isProduction = process.env.NODE_ENV === "production";

const connectionString = `C:/xampp/phpMyAdmin//${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;


const pool = new Pool({
    connectionString: isProduction? process.env.DB_DATABASE_URL: connectionString
});

module.exports = {pool};*/

const {createPool} = require('mysql');

const poolbutton = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"buttonledger",
    connectionLimit:100
});
module.exports = {poolbutton};
