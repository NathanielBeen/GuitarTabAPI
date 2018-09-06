const bcrypt = require('bcrypt');
const db = require('../db');
const rc = require('./ratingController');

function getAllUsers(response){
    var query = 'SELECT Id, Name, Type FROM users';
    db.queryDb(query, response);
}

function getUserPage(page, response){
    var query = 'SELECT Id, Name, Type FROM users ';
                +'LIMIT 10 OFFSET ?';
    db.queryDb(query, page, response);
}

function getUserById(id, response){
    var query = 'SELECT Id, Name, Type FROM users '
                +'WHERE Id = ?';
    db.queryDbWithValues(query, id, response);
}

function getUserByName(name, response){
    var query = 'SELECT Id, Name, Type FROM users '
                +'WHERE Name LIKE ?';
    db.queryDbWithValues(query, name, response);
}

function createUser(name, password, type, response){
    bcrypt.hash(password, 10, (err, hash) =>{
        if (err) response(err, null);
        else{
            var query = 'INSERT INTO users (Name, Password, Type) '
                        +'VALUES (?, ?, ?)';
            var values = [name, hash, type];
            db.queryDbWithValuesGetInsertId(query, values, response);
        }
    });
}

function removeUser(id, response){
    var query = 'DELETE FROM users WHERE Id = ?';
    db.queryDbWithValues(query, id, (err, result) =>{
        if (err) response(err, result);
        else rc.removeUserRatings(id, response);
    });
}

function changeUserType(id, type, response){
    var query = 'UPDATE users SET Type = ? '
                +'WHERE Id = ?';
    var values = [type, id];
    db.queryDbWithValues(query, values, response);
}

function changeUserPassword(id, password, response){
    bcrypt.hash(password, 10, (err, hash) =>{
        if (err) response(err, null);
        else{
            var query = 'UPDATE users SET Password = ? '
            +'WHERE Id = ?';
            var values = [hash, id];
            db.queryDbWithValues(query, values, response);
        }
    });
}

function verifyPassword(name, password, next){
    getAllUserDetailsByName(name, (err, result) =>{
        if (err || !result || result.length === 0) next(null);
        else bcrypt.compare(password, result[0].Password, (err, res) =>{
            if (err || !res) next(null);
            else next(result[0].Id);
        });
    });
}

function verifyAdminPassword(name, password, next){
    getAllUserDetailsByName(name, (err, result) =>{
        if (err || !result || result.length === 0 || result[0].Type === 0) next(null);
        else bcrypt.compare(password, result[0].Password, (err, res) =>{
            if (err || !res) next(null);
            else next(result[0].Id);
        });
    });
}

function getAllUserDetailsByName(name, response){
    var query = 'SELECT * FROM users '
                +'WHERE Name LIKE ?';
    db.queryDbWithValues(query, name, response);
}

module.exports = {
    getAllUsers : getAllUsers,
    getUserPage : getUserPage,
    getUserById : getUserById,
    getUserByName : getUserByName,
    createUser : createUser,
    removeUser : removeUser,
    changeUserType : changeUserType,
    changeUserPassword : changeUserPassword,
    verifyPassword : verifyPassword,
    verifyAdminPassword : verifyAdminPassword
}