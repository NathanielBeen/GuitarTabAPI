const express = require('express');
const tv = require('../validators/tagValidator');
const auth = require('../validators/authentication');

const router = express.Router();

router.get('/', (request, response, next) =>{
    tv.validateGetAllTags(request, (err, result) =>{
        sendResult(response, err, 200, result);
    });
});

router.post('/', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            tv.validateCreateTag(request, (err, result) =>{
                sendIdResult(response, err, 200, 'tag created', result);
            });
        }
    });
});

router.get('/:id', (request, response, next) =>{
    request.body.tag_id = parseInt(request.params.id);
    tv.validateGetTag(request, (err, result) =>{
        sendResult(response, err, 200, result);
    });
});

router.patch('/:id', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.tag_id = parseInt(request.params.id);
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            tv.validateUpdateTag(request, (err, result) =>{
                sendResult(response, err, 200, 'tag updated');
            });
        }
    });
});

router.delete('/:id', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    request.body.tag_id = parseInt(request.params.id);
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            tv.validateRemoveTag(request, (err, result) =>{
                sendResult(response, err, 200, 'tag deleted');
            });
        }
    });
});

router.delete('/multi-id/', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            tv.validateRemoveMultipleTags(request, (err, result) =>{
                sendResult(response, err, 200, 'tags deleted');
            });
        }
    });
});

router.patch('/multi-id/', (request, response, next) =>{
    request.body.token = request.headers['x-access-token'];
    auth.authAdminToken(request, (err, token_id) =>{
        if (err) sendFailed(response, err);
        else{
            tv.validateUpdateMultipleTagTypes(request, (err, result) =>{
                sendResult(response, err, 200, 'tags updated');
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

function sendFailed(response, err){
    response.status(err.getCode()).json({error : err});
}

module.exports = router;