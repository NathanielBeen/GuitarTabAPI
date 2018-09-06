var mysql = require('mysql');
var error = require('./error');
var connection = null;

function connectToDb(next){
    connection = (process.env.DB_TYPE === 'Production') ? connectToProdDb(next) : connectToTestDb(next);
    connection.connect((err) =>{ 
        console.log(err);
        next(err); });
}

function connectToProdDb(){
    return connection = mysql.createConnection({
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        socketPath : process.env.SOCKET,
        multipleStatements: true
    });
}

function connectToTestDb(){
    console.log(process.env.DB_USER);
    console.log(process.env.DB_PASS);
    console.log(process.env.DB_NAME);
    return connection = mysql.createConnection({
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        //socketPath : process.env.SOCKET,
        multipleStatements: true
    });
}

function sanitize(input){
    return connection.escape(input);
}

function queryDb(query, next){
    connection.query(query, (err, result) =>{
        if (err) error.sendDbError(err, next);
        else next(err, result);
    });
}

function queryDbWithValues(query, values, next){
    connection.query(query, values, (err, result) =>{
        if (err) error.sendDbError(err, next);
        else next(err, result);
    });
}

function queryDbWithValuesGetInsertId(query, values, next){
    connection.query(query, values, (err, result) =>{
        if (err) error.sendDbError(err, next);
        else{
            next(err, result.insertId);
        }
    });
}

module.exports = {
    connectToDb : connectToDb,
    sanitize : sanitize,
    queryDb : queryDb,
    queryDbWithValues : queryDbWithValues,
    queryDbWithValuesGetInsertId : queryDbWithValuesGetInsertId
}