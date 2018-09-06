var sc = require('../controllers/songController');
var uc = require('../controllers/userController');
var tc = require('../controllers/tagController');

var error = require('../error');
var sendValidationError = error.sendValidationError;

function validateGetAllSongs(request, response){
    sc.getAllSongs(response);
}

function validateGetSongPage(request, response){
    if (request.body.page != null){
        page = request.body.page;

        if(Number.isInteger(page)) sc.getSongPage(page, response);
        else sendValidationError('"page" must be an integer');
    }
    else sendValidationError('"page" must be defined', response);
}

function validateGetSongById(request, response){
    if (request.body.song_id != null){
        id = request.body.song_id;

        if (Number.isInteger(id)) sc.getSongById(id, response);
        else sendValidationError('"song_id" must be an integer', response);
    }
    else sendValidationError('"song_id" must be defined', response);
}

function validateCreateSong(request, response){
    if (request.body.name != null && request.body.artist != null
        && request.body.album != null && request.body.author != null
        && request.body.tab != null && request.body.tags != null){

        name = request.body.name;
        artist = request.body.artist;
        album = request.body.album;
        author = request.body.author;
        tab = request.body.tab;
        tags = request.body.tags;

        if (tags instanceof Array && Number.isInteger(author)){
            uc.getUserById(author, (err, result) =>{
                if (err || !result || result.length != 1) sendValidationError('author does not exist', response);
                else{
                    tc.verifyNamesAreValidTags(tags, (result) =>{
                        if (!result && tags.length > 0) sendValidationError('not all tag names exist', response);
                        else sc.createSong(name, artist, album, author, tab, tags, response);
                    });
                }
            });
        }
        else sendValidationError('"tags" must be an array and "author" must be an integer', response);
    }
    else sendValidationError('"name", "artist", "album", "author", "tab", and "tags"'
                            +'must be defined', response);
}

function validateRemoveSong(request, response){
    if (request.body.song_id != null){
        id = request.body.song_id;

        if (Number.isInteger(id)) sc.removeSong(id, response);
        else sendValidationError('"song_id" must be an integer', response);
    }
    else sendValidationError('"song_id" must be defined', response);
}

function validateRemoveMultipleSongs(request, response){
    if (request.body.song_ids != null){
        ids = request.body.song_ids;

        if (ids instanceof Array && ids.length > 0) sc.removeMultipleSongs(ids, response);
        else sendValidationError('"song_ids" must be a non-empty array', response);
    }
    else sendValidationError('"song_ids" must be defined', response);
}

function validateUpdateSong(request, response){
    if (request.body.song_id != null && request.body.artist != null 
        && request.body.album != null && request.body.tab != null 
        && request.body.tags != null){

        id = request.body.song_id;
        artist = request.body.artist;
        album = request.body.album;
        tab = request.body.tab;
        tags = request.body.tags;
        if (tags instanceof Array && Number.isInteger(id)){
            tc.verifyNamesAreValidTags(tags, (result) =>{
                if (!result && tags.length > 0) sendValidationError('not all tag names exist', response);
                else{
                    sc.getSongById(id, (err, result) =>{
                        if (err || result.length !== 1) sendValidationError('song does not exist', response);
                        else sc.updateSong(id, artist, album, tab, tags, response);
                    });
                }
            });
        }
        else sendValidationError('"tags" must be an array and "id" must be an integer', response);
    }
    else sendValidationError('"song_id", "artist", "album", "tab", and "tags" must be defined', response);
}

function validateUpdateSongWithoutTab(request, response){
    if (request.body.song_id != null && request.body.artist != null 
        && request.body.album != null && request.body.tags != null){

        id = request.body.song_id;
        artist = request.body.artist;
        album = request.body.album;
        tags = request.body.tags;
        if (tags instanceof Array && Number.isInteger(id)){
            tc.verifyNamesAreValidTags(tags, (result) =>{
                if (!result && tags.length > 0) sendValidationError('not all tag names exist', response);
                else{
                    sc.getSongById(id, (err, result) =>{
                        if (err || result.length !== 1) sendValidationError('song does not exist', response);
                        else sc.updateSongWithoutTab(id, artist, album, tags, response);
                    });
                }
            });
        }
        else sendValidationError('"tags" must be an array and "id" must be an integer', response);
    }
    else sendValidationError('"song_id", "artist", "album", and "tags" must be defined', response);
}

function validateUpdateMultipleSongs(request, response){
    if (request.body.song_ids != null && (request.body.artist != null 
        || request.body.album != null || request.body.tags != null)){

        ids = request.body.song_ids;
        artist = request.body.artist;
        album = request.body.album;
        tags = request.body.tags;
        if (ids instanceof Array && ids.length > 0 && (tags == null || tags instanceof Array)){
            if (tags == null || tags.length == 0) sc.updateMultipleSongs(ids, artist, album, tags, response);
            else if (tags instanceof Array && tags.length > 0){
                tc.verifyNamesAreValidTags(tags, (result) =>{
                    if (!result && tags != null && tags.length > 0) sendValidationError('not all tag names exist', response);
                    else sc.updateMultipleSongs(ids, artist, album, tags, response);
                });
            }
            else sendValidationError('"tags" must be an array if defined', response);
        }
        else sendValidationError('"song_ids" must be a non-empty array', response);
    }
    else sendValidationError('"song_ids" and ("artist", "album", and/or "tags") must be defined', response);
}

function validateSearchForSong(request, response){
        name = request.body.name;
        artist = request.body.artist;
        album = request.body.album;
        author = request.body.author;
        rating = request.body.rating;
        tags = request.body.tags;
        page = request.body.page;

        if (tags == null || (tags instanceof Array && tags.length > 0)){
            if (name != null || artist != null || album != null || author != null || rating != null || tags != null){
                sc.searchForSong(name, artist, album, author, rating, tags, page, response);
            }
            else sendValidationError('"name", "artist", "album", "author", "rating", or "tags" must be defined', response);
        }
        else sendValidationError('"tags" must be defined as a non-empty array', response);
}

function validateUserIsAuthor(request, response){
    if (request.body.song_id != null && request.body.user_id != null){
        song_id = request.body.song_id;
        user_id = request.body.user_id;

        if (Number.isInteger(song_id) && Number.isInteger(user_id)){
            sc.userIsAuthor(song_id, user_id, (success) =>{
                if(success) response(null);
                else error.sendAuthError('user is not author', error.NOT_AUTHOR, response);
            });
        }
        else sendValidationError('"song_id" and "user_id" must be integers', response);
    }
    else sendValidationError('"song_id" and "user_id" must be defined', response);
}

module.exports = {
    validateGetAllSongs : validateGetAllSongs,
    validateGetSongPage : validateGetSongPage,
    validateGetSongById : validateGetSongById,
    validateCreateSong : validateCreateSong,
    validateRemoveSong : validateRemoveSong,
    validateRemoveMultipleSongs : validateRemoveMultipleSongs,
    validateUpdateSong : validateUpdateSong,
    validateUpdateSongWithoutTab : validateUpdateSongWithoutTab,
    validateUpdateMultipleSongs : validateUpdateMultipleSongs,
    validateSearchForSong : validateSearchForSong,
    validateUserIsAuthor : validateUserIsAuthor,
}
