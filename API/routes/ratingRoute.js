const express = require('express');
const rv = require('../validators/ratingValidator');
const auth = require('../validators/authentication');

const router = express.Router();
router.get('/', (request, response, next) =>{
    rv.validateGetAllRatings(request, (err, result) =>{
        sendResult(response, err, 200, result);
    });
});

router.post('/', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            rv.validateCreateRating(request, (err, result) =>{
                sendIdResult(response, err, 201, 'rating created', result);
            });
        }
    });
});

router.get('/:id', (request, response, next) =>{
    request.body.rating_id = parseInt(request.params.id);
    rv.validateGetRating(request, (err, result) =>{
        sendResult(response, err, 200, result);
    });
});

router.patch('/:id', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.rating_id = parseInt(request.params.id);
    auth.authToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            request.body.user_id = token_id;
            auth.authUserIsRatingAuthor(request, (err) =>{
                if (err) sendFailed(response, err);
                else{
                    rv.validateUpdateRating(request, (err, result) =>{
                        sendResult(response, err, 200, 'rating updated');
                    });
                }
            });
        }
    });
});

router.delete('/:id', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.rating_id = parseInt(request.params.id);
    auth.authToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            request.body.user_id = token_id;
            auth.authUserIsRatingAuthor(request, (err) =>{
                if (err) sendFailed(response, err);
                else{
                    rv.validateRemoveRating(request, (err, result) =>{
                        sendResult(response, err, 200, 'rating deleted');
                    });
                }
            });
        }
    });
});

router.delete('/admin/:id', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.rating_id = parseInt(request.params.id);
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            rv.validateRemoveRating(request, (err, result) =>{
                sendResult(response, err, 200, 'rating deleted');
            });
        }
    });
});

router.delete('/admin-multi/', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            rv.validateRemoveMultipleRatings(request, (err, result) =>{
                sendResult(response, err, 200, 'ratings removed');
            });
        }
    });
});

router.get('/song-ratings/:id', (request, response, next) =>{
    request.body.song_id = parseInt(request.params.id);
    rv.validateGetSongRating(request, (err, result) =>{
        sendResult(response, err, 200, result);
    });
});

router.get('/user-ratings/:id', (request, response, next) =>{
    request.body.user_id = parseInt(request.params.id);
    rv.validateGetUserRating(request, (err, result) =>{
        sendResult(response, err, 200, result);
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

function sendFailed(response, err){
    response.status(err.getCode()).json({error : err});
}

module.exports = router;