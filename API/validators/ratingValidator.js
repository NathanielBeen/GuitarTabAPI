const db = require('../db');
const rc = require('../controllers/ratingController');
const uc = require('../controllers/userController');
const sc = require('../controllers/songController');

var error = require('../error');
var sendValidationError = error.sendValidationError;

function validateGetAllRatings(request, response){
    rc.getAllRatings(response);
}

function validateGetRating(request, response){
    if (request.body.rating_id != null){
        id = request.body.rating_id;

        if (Number.isInteger(id)) rc.getRating(id, response);
        else sendValidationError('"rating_id" must be an integer', response);
    }
    else sendValidationError('"rating_id" must be defined', response);
}

function validateGetSongRating(request, response){
    if (request.body.song_id != null){
        id = request.body.song_id;

        if(Number.isInteger(id)) rc.getSongRatings(id, response);
        else sendValidationError('"song_id" must be an integer', response);
    }
    else sendValidationError('"song_id" must be defined', response);
}

function validateGetUserRating(request, response){
    if (request.body.user_id != null){
        id = request.body.user_id;

        if(Number.isInteger(id)) rc.getUserRatings(id, response);
        else sendValidationError('"user_id" must be an integer', response);
    }
    else sendValidationError('"user_id" must be defined', response);
}

function validateCreateRating(request, response){
    if (request.body.song_id != null && request.body.user_id != null 
        && request.body.rating != null && request.body.text != null){
        song_id = request.body.song_id;
        user_id = request.body.user_id;
        rating = request.body.rating;
        text = request.body.text;

        if(!isNaN(rating) && rating >= 0 && rating <= 5 && Number.isInteger(song_id)
            && Number.isInteger(user_id)){
            sc.verifySongExists(song_id, (result) =>{
                if (!result) sendValidationError('song does not exist', response);
                else{
                    uc.getUserById(user_id, (err, result) =>{
                        if (err || !result || result.length != 1) sendValidationError('user does not exist', response);
                        else rc.createRating(song_id, user_id, rating, text, response);
                    });
                }
            });
        }
        else sendValidationError('"rating" must be between 0 and 5, "song_id" and "user_id" must be integers', response);
    }
    else sendValidationError('"song_id", "user_id", "rating", and "text" must be defined', response);
}

function validateRemoveRating(request, response){
    if (request.body.rating_id != null){
        id = request.body.rating_id;
        if(Number.isInteger(id)) rc.removeRating(id, response);
        else sendValidationError('"rating_id" must be an integer', response);
    }
    else sendValidationError('"rating_id" must be defined', response);
}

function validateRemoveMultipleRatings(request, response){
    if (request.body.rating_ids != null){
        ids = request.body.rating_ids;
        if (ids instanceof Array && ids.length > 0) rc.removeMultipleRatings(ids, response);
        else sendValidationError('"rating_ids" must be a non-empty array', response);
    }
    else sendValidationError('"rating_ids" must be defined', response);
}

function validateRemoveSongRatings(request, response){
    if (request.body.song_id != null){
        id = request.body.song_id;

        if(Number.isInteger(id)) rc.removeSongRatings(id, response);
        else sendValidationError('"song_id" must be an integer', response);
    }
    else sendValidationError('"song_id" must be defined', response);
}

function validateRemoveMultipleSongRatings(request, response){
    if (request.body.song_ids != null){
        ids = request.body.song_ids;

        if (ids instanceof Array && ids.length > 0) rc.removeMultipleSongRatings(ids, response);
        else sendValidationError('"song_ids" must be a non-empty array', response);
    }
    else sendValidationError('"song_ids" must be defined', response);
}

function validateRemoveUserRatings(request, response){
    if (request.body.user_id != null){
        id = request.body.user_id;

        if(Number.isInteger(id)) rc.removeUserRatings(id, response);
        else sendValidationError('"user_id" must be an integer', response);
    }
    else sendValidationError('"user_id" must be defined', response);
}

function validateUpdateRating(request, response){
    if (request.body.rating != null && request.body.text != null
        && request.body.rating_id != null){
        rating = request.body.rating;
        text = request.body.text;
        id = request.body.rating_id;

        if(!isNaN(rating) && rating >= 0 && rating <= 5 && Number.isInteger(id)){
            rc.getRating(id, (err, result) =>{
                if (err || !result || result.length !== 1) sendValidationError('rating does not exist', response);
                else rc.updateRating(id, rating, text, response);
            });
        }
        else sendValidationError('"rating" must be between 0 and 5 and "rating_id" must be an integer', response);
    }
    else sendValidationError('"rating", "text", and "rating_id" must be defined', response);
}

function validateUserIsAuthor(request, response){
    if (request.body.rating_id != null && request.body.user_id != null){
        rating_id = request.body.rating_id;
        user_id = request.body.user_id;

        if(Number.isInteger(rating_id) && Number.isInteger(user_id)){
            rc.userIsAuthor(rating_id, user_id, (success) =>{
                if (success) response(null);
                else error.sendAuthError('user is not author', error.NOT_AUTHOR, response);
            });
        }
        else sendValidationError('"rating_id" and "user_id" must be integers', response);
    }
    else sendValidationError('"rating_id" and "user_id" must be defined', response);
}

module.exports = {
    validateGetAllRatings : validateGetAllRatings,
    validateGetRating : validateGetRating,
    validateGetSongRating : validateGetSongRating,
    validateGetUserRating : validateGetUserRating,
    validateCreateRating : validateCreateRating,
    validateRemoveRating : validateRemoveRating,
    validateRemoveMultipleRatings : validateRemoveMultipleRatings,
    validateRemoveSongRatings : validateRemoveSongRatings,
    validateRemoveMultipleSongRatings : validateRemoveMultipleSongRatings,
    validateRemoveUserRatings : validateRemoveUserRatings,
    validateUpdateRating : validateUpdateRating,
    validateUserIsAuthor : validateUserIsAuthor
}