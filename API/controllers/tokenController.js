const jwt = require('jsonwebtoken');

const db = require('../db');
const uc = require('./userController');

var secret = 'secret';

function createToken(name, next){
    uc.getUserByName(name, (err, result) =>{
        if (err || result.length != 1) next(null, null);
        else{
            id = result[0].Id;
            type = result[0].Type;
            var token = jwt.sign(
                {
                    userId : id,
                    extended : type
                },
                secret,
                {
                    expiresIn: "1h"
                }
            );
            next(token);
        }
    });
}

function authToken(token, needs_admin){
    try{
        const decoded = jwt.verify(token, secret);
        if (needs_admin === 1 && decoded.extended === 0){ return null; }
        return decoded.userId;
    } catch(err){
        return null;
    }
}

module.exports = {
    createToken : createToken,
    authToken : authToken
}