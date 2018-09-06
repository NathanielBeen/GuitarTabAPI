const tc = require('../controllers/tokenController');

function validateCreateToken(request, next){
    if (request.body.name != null){
        var name = request.body.name;
        tc.createToken(name, (token) =>{
            next(token);
        });
    }
    else next(null);
}

function validateAuthToken(request, needs_admin, next){
    if (request.body.token != null){
        var token = request.body.token;
        var result = tc.authToken(token, needs_admin);
        next(result);
    }
    else next(null);
}

module.exports = {
    validateCreateToken : validateCreateToken,
    validateAuthToken : validateAuthToken
}