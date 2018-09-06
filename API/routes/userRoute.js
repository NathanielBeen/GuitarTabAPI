const express = require('express');
const uv = require('../validators/userValidator');
const auth = require('../validators/authentication');

const router = express.Router();

router.get('/', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            uv.validateGetAllUsers(request, (err, result) =>{
                sendResult(response, err, 200, result);
            });
        }
    });
});

router.post('/signup', (request, response, next) =>{
    uv.validateCreateUser(request, 0, (err, result) =>{
        sendIdResult(response, err, 200, 'user created', result);
    });
});

router.post('/singup-admin', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            uv.validateCreateUser(request, 1, (err, result) =>{
                sendIdResult(response, err, 200, 'admin created', result);
            });
        }
    });
});

router.post('/login', (request, response, next) =>{
    auth.authLogin(request, (err, token, login_id) =>{
        sendTokenResult(response, err, 200, 'login successful', token, login_id);
    });
});

router.get('/:id', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.user_id = parseInt(request.params.id);
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            uv.validateGetUserById(request, (err, result) =>{
                sendResult(response, err, 200, result);
            });
        }
    });
});

router.delete('/', (request, response, err) =>{
    auth.authLogin(request, (err, token, login_id) =>{
        if (err) sendFailed(response, err);
        else{
            request.body.user_id = login_id;
            uv.validateRemoveUser(request, (err, result) =>{
                sendResult(response, err, 200, 'user removed');
            });
        }
    });
});

router.delete('/admin/:id', (request, response, err) =>{
    request.body.user_id = parseInt(request.params.id);
    auth.authAdminLogin(request, (err, token, login_id) =>{
        if (err) sendFailed(response, err);
        else{
            uv.validateRemoveUser(request, (err, result) =>{
                sendTokenResult(response, err, 200, 'user removed', token, login_id);
            });
        }
    });
});

router.patch('/change-password', (request, response, err) =>{
    auth.authLogin(request, (err, token, login_id) =>{
        if (err) sendFailed(response, err);
        else{
            request.body.user_id = login_id;
            uv.validateChangeUserPassword(request, (err, result) =>{
                sendTokenResult(response, err, 200, 'password changed', token, login_id);
            });
        }
    });
});

router.patch('/change-user-type', (request, response, err) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            uv.validateChangeUserType(request, (err, result) =>{
                sendResult(response, err, 200, 'type changed');
            });
        }
    });
});

function sendResult(response, err, success_code, message){
    if (err) response.status(err.getCode()).json({error : err});
    else response.status(success_code).json({result : message});
}

function sendIdResult(response, err, success_code, message, id){
    if (err) response.status(err.getCode()).json({error : err});
    else response.status(success_code).json({result : message, id : id});
}

function sendTokenResult(response, err, success_code, message, token, id){
    if (err) response.status(err.getCode()).json({error : err});
    else response.status(success_code).json({result : message, token : token, id : id});
}

function sendFailed(response, err){
    response.status(err.getCode()).json({error : err});
}

module.exports = router;