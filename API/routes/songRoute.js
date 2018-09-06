const express = require('express');
const sv = require('../validators/songValidator');
const auth = require('../validators/authentication');

const router = express.Router();

router.get("/", (request, response, next) =>{
    sv.validateGetAllSongs(request, (err, result) =>{
        sendResult(response, err, 200, result);
    });
});

router.post("/", (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            sv.validateCreateSong(request, (err, result) =>{
                sendIdResult(response, err, 201, 'song created', result);
            });
        }
    });
});

router.get("/:id", (request, response, next) =>{
    request.body.song_id = parseInt(request.params.id);
    sv.validateGetSongById(request, (err, result) =>{
        sendResult(response, err, 200, result);
    });
});

router.patch("/:id", (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.song_id = parseInt(request.params.id);
    auth.authToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            request.body.user_id = token_id;
            auth.authUserIsSongAuthor(request, (err) =>{
                if (err) sendFailed(response, err);
                else{
                    sv.validateUpdateSong(request, (err, result) =>{
                        sendResult(response, err, 200, 'song updated');
                    });
                }
            });
        }
    });
});

router.delete("/:id", (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.song_id = parseInt(request.params.id);
    auth.authToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            request.body.user_id = token_id;
            auth.authUserIsSongAuthor(request, (err) =>{
                if (err) sendFailed(response, err);
                else{
                    sv.validateRemoveSong(request, (err, result) =>{
                        sendResult(response, err, 200, 'song removed');
                    });
                }
            });
        }
    });
});

router.patch('/admin/:id', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.song_id = parseInt(request.params.id);
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            sv.validateUpdateSongWithoutTab(request, (err, result) =>{
                sendResult(response, err, 200, 'song updated');
            });
        }
    });
});

router.patch('/admin-multi/', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            sv.validateUpdateMultipleSongs(request, (err, result) =>{
                sendResult(response, err, 200, 'songs updated');
            });
        }
    });
});

router.delete('/admin/:id', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.song_id = parseInt(request.params.id);
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            sv.validateRemoveSong(request, (err, result) =>{
                sendResult(response, err, 200, 'song removed');
            });
        }
    });
});

router.delete('/admin-multi/', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            sv.validateRemoveMultipleSongs(request, (err, result) =>{
                sendResult(response, err, 200, 'song updated');
            });
        }
    });
});

router.post("/search", (request, response, next) =>{
    sv.validateSearchForSong(request, (err, result) =>{
        sendResult(response, err, 200, result);
    });
});

//maybe implement later
router.get('/page', (request, response, next) =>{
    sv.validateGetSongPage(request, (err, result) =>{
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