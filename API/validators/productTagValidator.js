var ptc = require('../controllers/productTagController');
var sc = require('../controllers/songController');
var tc = require('../controllers/tagController');

var error = require('../error');
var sendValidationError = error.sendValidationError;

function validateGetAllSongTags(request, response){
    ptc.getAllSongTags(response);
}

function validateGetSongTags(request, response){
    if (request.body.song_id != null){
        var id = request.body.song_id;

        if(Number.isInteger(id)) ptc.getSongTags(id, response);
        else sendValidationError('"song_id" must be an integer', response);
    }
    else sendValidationError('"song_id" must be defined', response);
}

function validateCreateSongTags(request, response){
    if (request.body.song_id != null && request.body.tags != null){
        var id = request.body.song_id;
        var tags = request.body.tags;

        if (tags instanceof Array && tags.length > 0 && Number.isInteger(id)){
            sc.verifySongExists(id, (result) =>{
                if (!result) sendValidationError('song does not exist', response);
                else{
                    tc.verifyNamesAreValidTags(tags, (result) =>{
                        if (!result) sendValidationError('not all tag names exist', response);
                        else ptc.createSongTags(id, tags, response);
                    });
                }
            });
        }
        else sendValidationError('"tags" must be a non-empty array and "song_id" must be an integer', response);
    }
    else sendValidationError('"song_id" and "tags" must be defined', response);
}

function validateRemoveSongTags(request, response){
    if (request.body.song_id != null){
        id = request.body.song_id;

        if(Number.isInteger(id)) ptc.removeSongTags(id, response);
        else sendValidationError('"song_id" must be an integer', response);
    }
    else sendValidationError('"song_id" must be defined', response);
}

function validateRemoveMultipleSongTags(request, response){
    if (request.body.song_ids != null){
        ids = request.body.song_ids;
        
        if (ids instanceof Array && ids.length > 0) ptc.removeMultipleSongTags(ids, response);
        else sendValidationError('"song_ids" must be a non-empty array', response);
    }
    else sendValidationError('"song_ids" must be defined', response);
}

function validateRemoveTagType(request, response){
    if (request.body.tag_id != null){
        id = request.body.tag_id;

        if(Number.isInteger(id)) ptc.removeTagType(id, response);
        else sendValidationError('"tag_id" must be an integer', response);
    }
    else sendValidationError('"tag_id" must be defined', response);
}

function validateRemoveMultipleTagType(request, response){
    if (request.body.tag_ids != null){
        ids = request.body.tag_ids;

        if(ids instanceof Array && ids.length > 0) ptc.removeMultipleTagTypes(ids, response);
        else sendValidationError('"tag_ids" must be a non-empty array', response);
    }
    else sendValidationError('"tag_ids" must be defined', response);
}

function validateRemoveSelectSongTags(request, response){
    if (request.body.song_id != null && request.body.tags != null){
        id = request.body.song_id;
        tags = request.body.tags;

        if (tags instanceof Array && tags.length > 0 && Number.isInteger(id)){
            sc.verifySongExists(id, (result) =>{
                if (!result) sendValidationError('song does not exist', response);
                else ptc.removeSelectSongTags(id, tags, response);
            });
        }
        else sendValidationError('"tags" must be a non-empty array and "song_id" must be an integer', response);
    }
    else sendValidationError('"song_id" and "tags" must be defined', response);
}

function validateRemoveTagsFromMultipleSongs(request, response){
    if (request.body.song_ids != null && request.body.tag != null){
        ids = request.body.song_ids;
        tag = request.body.tag;

        if (ids instanceof Array && ids.length > 0){
            tc.verifyNameIsValidTag(tag, (result) =>{
                if (!result) sendValidationError('tag does not exist', response);
                else ptc.removeTagFromMultipleSongs(ids, tag, response);
            });
        }   
        else sendValidationError('"song_ids" must be a non-empty array', response);
    }
    else sendValidationError('"song_ids" and "tag" must be defined', response);
}

function validateAddTagToMultipleSongs(request, response){
    if (request.body.song_ids != null && request.body.tag != null){
        ids = request.body.song_ids;
        tag = request.body.tag;

        if (ids instanceof Array && ids.length > 0){
            tc.verifyNameIsValidTag(tag, (result) =>{
                if (!result) sendValidationError('tag does not exist', response);
                else ptc.removeTagFromMultipleSongs(ids, tag, (err, result) =>{
                    if (err) response(err);
                    else ptc.addTagToMultipleSongs(ids, tag, response);
                });
            });
        }   
        else sendValidationError('"song_ids" must be a non-empty array', response);
    }
    else sendValidationError('"song_ids" and "tag" must be defined', response);
}

function validateUpdateSongTags(request, response){
    if (request.body.song_id != null && request.body.tags != null){
        id = request.body.song_id;
        tags = request.body.tags;

        if (tags instanceof Array && Number.isInteger(id)){
            sc.verifySongExists(id, (result) =>{
                if (!result) sendValidationError('song does not exist', response);
                else{
                    tc.verifyNamesAreValidTags(tags, (result) =>{
                        if (!result && tags.length > 0) sendValidationError('not all tag names exist', response);
                        else ptc.updateSongTags(id, tags, response);
                    });
                }
            });
        }
        else sendValidationError('"tags" must be an array and "song_id" must be an integer', response);
    }
    else sendValidationError('"song_id" must be defined', response);
}

module.exports = {
    validateGetAllSongTags : validateGetAllSongTags,
    validateGetSongTags : validateGetSongTags,
    validateCreateSongTags : validateCreateSongTags,
    validateRemoveSongTags : validateRemoveSongTags,
    validateRemoveMultipleSongTags : validateRemoveMultipleSongTags,
    validateRemoveTagType : validateRemoveTagType,
    validateRemoveMultipleTagType : validateRemoveMultipleTagType,
    validateRemoveSelectSongTags : validateRemoveSelectSongTags,
    validateRemoveTagsFromMultipleSongs : validateRemoveTagsFromMultipleSongs,
    validateAddTagToMultipleSongs : validateAddTagToMultipleSongs,
    validateUpdateSongTags : validateUpdateSongTags
}