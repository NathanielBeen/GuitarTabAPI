const tv = require('./tokenValidator');
const uv = require('./userValidator');
const sv = require('./songValidator');
const rv = require('./ratingValidator');
const error = require('../error');

function authToken(request, next){
    tv.validateAuthToken(request, 0, (token_id) =>{
        if (token_id){
            next(null, token_id);
        } 
        else error.sendAuthError('auth error', error.TOKEN, next);
    }); 
}

function authAdminToken(request, next){
    tv.validateAuthToken(request, 1, (token_id) =>{
        if (token_id){
            next(null, token_id);
        } 
        else error.sendAuthError('auth error', error.ADMIN_TOKEN, next);
    });
}

function authLogin(request, next){
    uv.validateVerifyPassword(request, (login_id) =>{
        if (login_id){
            tv.validateCreateToken(request, (token) =>{
                if (token) next(null, token, login_id);
                else error.sendAuthError('token not created', error.LOGIN, next);
            }); 
        }
        else error.sendAuthError('auth error', error.LOGIN, next);
    });
}

function authAdminLogin(request, next){
    uv.validateVerifyAdminPassword(request, (login_id) =>{
        if (login_id){
            request.body.login_id = login_id;
            tv.validateCreateToken(request, (token) =>{
                if (token) next(null, token, login_id);
                else error.sendAuthError('token not created', error.ADMIN_LOGIN, next);
            });
        }
        else error.sendAuthError('auth error', error.ADMIN_LOGIN, next);
    });
}

function authUserIsSongAuthor(request, next){
    sv.validateUserIsAuthor(request, (result) =>{
        next(result)
    });
}

function authUserIsRatingAuthor(request, next){
    rv.validateUserIsAuthor(request, (result) =>{
        next(result)
    }); 
}

module.exports = {
    authToken : authToken,
    authAdminToken : authAdminToken,
    authLogin : authLogin,
    authAdminLogin : authAdminLogin,
    authUserIsSongAuthor : authUserIsSongAuthor,
    authUserIsRatingAuthor : authUserIsRatingAuthor
}