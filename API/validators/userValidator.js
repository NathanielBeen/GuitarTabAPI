const uc = require('../controllers/userController');

var error = require('../error');
var sendValidationError = error.sendValidationError;

function validateGetAllUsers(request, response){
    uc.getAllUsers(response);
}

function validateGetUserPage(request, response){
    if (request.body.page != null){
        page = request.body.page;

        if(Number.isInteger(page)) uc.getUserPage(page, response);
        else sendValidationError('"page" must be an integer', response);
    }
    else sendValidationError('"page" must be defined', response);
}

function validateGetUserById(request, response){
    if (request.body.user_id != null){
        var id = request.body.user_id;

        if(Number.isInteger(id)) uc.getUserById(id, response);
        else sendValidationError('"user_id" must be an integer', response);
    }
    else sendValidationError('"user_id" must be defined', response);
}

function validateGetUserByName(request, response){
    if (request.body.name != null){
        var name = request.body.name;
        uc.getUserByName(name, response);
    }
    else sendValidationError('"name" must be defined', response);
}

function validateCreateUser(request, type, response){
    if (request.body.name != null && request.body.password != null && type != null){
        var name = request.body.name;
        var password = request.body.password;
        var regex = RegExp("^[a-zA-Z0-9_]+$");

        if (!regex.test(name) || !regex.test(password)){
            sendValidationError('name and password must only contain numbers, letters, and underscores', response);
            return;
        }
        if (name.length < 4 || password.length < 8){
            sendValidationError('name must be at least 4 characters and password must be at least 8 characters', response);
            return;
        }
        if (type != 0 && type != 1){
            sendValidationError('invalid type', response);
            return;
        }
        uc.getUserByName(name, (err, result) =>{
            if (err) sendValidationError('error accessing db', response);
            else if (result.length > 0) sendValidationError('username already exists', response);
            else uc.createUser(name, password, type, response);
        });
    }
    else sendValidationError('"name" and "password" must be defined', response);
}

function validateRemoveUser(request, response){
    if (request.body.user_id != null){
        var id = request.body.user_id;

        if (Number.isInteger(id)) uc.removeUser(id, response);
        else sendValidationError('"user_id" must be an integer', response);
    }
    else sendValidationError('"user_id" must be defined', response);
}

function validateChangeUserType(request, response){
    if (request.body.user_id != null && request.body.type != null){
        var id = request.body.user_id;
        var type = request.body.type;

        if ((type === 0 || type === 1) && Number.isInteger(id)) uc.changeUserType(id, type, response);
        else sendValidationError('"type" must be 0 or 1 and "user_id" must be an integer', response);
    }
    else sendValidationError('"user_id" and "type" must be defined', response);
}

function validateChangeUserPassword(request, response){
    if (request.body.user_id != null && request.body.new_password != null){
        var id = request.body.user_id;
        var password = request.body.new_password;
        var regex = RegExp("^[a-zA-Z0-9_]+$");

        if (!regex.test(password)){
            sendValidationError('password must only contain numbers, letters, and underscores', response);
            return;
        }
        if (password.length < 8){
            sendValidationError('password must be at least 8 characters', response);
            return;
        }
        if (!Number.isInteger(id)){
            sendValidationError('"user_id" must be an integer', response);
            return;
        }
        uc.changeUserPassword(id, password, response);
    }
    else sendValidationError('"user_id" and "new_password" must be defined', response);
}

function validateVerifyPassword(request, response){
    if (request.body.name != null && request.body.password != null){
        var name = request.body.name;
        var password = request.body.password;
        uc.verifyPassword(name, password, (id) =>{
            response(id);
        });
    }
    else response(null);
}

function validateVerifyAdminPassword(request, response){
    if (request.body.name != null && request.body.password != null){
        var name = request.body.name;
        var password = request.body.password;
        uc.verifyAdminPassword(name, password, (id) =>{
            response(id);
        });
    }
    else response(null);
}

module.exports = {
    validateGetAllUsers : validateGetAllUsers,
    validateGetUserPage : validateGetUserPage,
    validateGetUserById : validateGetUserById,
    validateGetUserByName : validateGetUserByName,
    validateCreateUser : validateCreateUser,
    validateRemoveUser : validateRemoveUser, 
    validateChangeUserPassword : validateChangeUserPassword, 
    validateChangeUserType : validateChangeUserType,
    validateVerifyPassword : validateVerifyPassword,
    validateVerifyAdminPassword : validateVerifyAdminPassword
}
