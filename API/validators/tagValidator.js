db = require('../db');
tc = require('../controllers/tagController');

var error = require('../error');
var sendValidationError = error.sendValidationError;

function validateGetAllTags(request, response){
    tc.getAllTags(response);
}

function validateGetTag(request, response){
    if (request.body.tag_id != null){
        var id = request.body.tag_id;

        if(Number.isInteger(id)) tc.getTag(id, response);
        else sendValidationError('"tag_id" must be an integer', response);
    }
    else sendValidationError('"tag_id" must be defined', response);
}

function validateCreateTag(request, response){
    if (request.body.name != null && request.body.type != null){
        var name = request.body.name;
        var type = request.body.type;
        tc.createTag(name, type, response);
    }
    else sendValidationError('"name" and "type" must be defined', response);
}

function validateRemoveTag(request, response){
    if (request.body.tag_id != null){
        var id = request.body.tag_id;

        if (Number.isInteger(id)) tc.removeTag(id, response);
        else sendValidationError('"tag_id" must be an integer', response);
    }
    else sendValidationError('"tag_id" must be defined', response);
}

function validateRemoveMultipleTags(request, response){
    if (request.body.tag_ids != null){
        var ids = request.body.tag_ids;

        if (ids instanceof Array && ids.length > 0) tc.removeMultipleTags(ids, response);
        else sendValidationError('"tag_ids" must be a non-empty array', response);
    }
    else sendValidationError('"tag_ids" must be defined', response);
}

function validateUpdateTag(request, response){
    if (request.body.tag_id != null && request.body.name != null
        && request.body.type != null){
        
        var id = request.body.tag_id;
        var name = request.body.name;
        var type = request.body.type;

        if (Number.isInteger(id)){
            tc.getTag(id, (err, result) =>{
                if (err || !result || result.length != 1) sendValidationError('tag does not exist', response);
                else tc.updateTag(id, name, type, response);
            });
        }
        else sendValidationError('"tag_id" must be an integer', response);
    }
    else sendValidationError('"tag_id", "name", and "type" must be defined', response);
}

function validateUpdateMultipleTagTypes(request, response){
    if (request.body.tag_ids != null && request.body.type != null){
        var ids = request.body.tag_ids;
        var type = request.body.type;

        if(ids instanceof Array && ids.length > 0) tc.updateMultipleTagTypes(ids, type, response);
        else sendValidationError('"tag_ids" must be a non-empty array', response);
    }
    else sendValidationError('"tag_ids" and "type" must be defined', response);
}

module.exports = {
    validateGetAllTags : validateGetAllTags,
    validateGetTag : validateGetTag,
    validateCreateTag : validateCreateTag,
    validateRemoveTag : validateRemoveTag, 
    validateRemoveMultipleTags : validateRemoveMultipleTags,
    validateUpdateTag : validateUpdateTag,
    validateUpdateMultipleTagTypes : validateUpdateMultipleTagTypes
}