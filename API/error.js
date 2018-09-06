const VALIDATION = 0;
const DATABASE = 1;
const AUTHENTICATION = 2;

const LOGIN = 0;
const ADMIN_LOGIN = 1;
const TOKEN = 2;
const ADMIN_TOKEN = 3;
const NOT_AUTHOR = 4;

class Error{
    constructor(code, message, error_type){
        this.code = code;
        this.message = message;
        this.error_type = error_type;
    }

    getCode(){ return this.code; }
    getMessage(){ return this.message; }
    getErrorType(){ return this.error_type; }
}

class ValidationError extends Error{
    constructor(message){
        super(400, message, VALIDATION);
    }
}

class AuthError extends Error{
    constructor(message, needed_auth){
        super(401, message, AUTHENTICATION);
        this.needed_auth = needed_auth;
    }

    getAuthNeeded(){ return this.needed_auth; }
}

class DbError extends Error{
    constructor(error){
        super(500, 'db error occurred', DATABASE);
        this.error = error;
    }

    getDbError(){ return this.error; }
}

function sendValidationError(message, response){
    var error = new ValidationError(message);
    response(error, null);
}

function sendAuthError(message, needed_auth, response){
    var error = new AuthError(message, needed_auth);
    response(error, null);
}

function sendDbError(error, response){
    var error = new DbError(error);
    response(error, null);
}

module.exports = {
    LOGIN : LOGIN,
    ADMIN_LOGIN : ADMIN_LOGIN,
    TOKEN : TOKEN,
    ADMIN_TOKEN : ADMIN_TOKEN,
    NOT_AUTHOR : NOT_AUTHOR,
    sendValidationError : sendValidationError,
    sendAuthError : sendAuthError,
    sendDbError : sendDbError
}