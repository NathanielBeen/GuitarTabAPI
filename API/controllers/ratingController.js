const db = require('../db');

function getAllRatings(response){
    var query = 'SELECT ratings.*, users.Name as Name FROM ratings '
                +'JOIN users ON users.Id = ratings.UserId';
    db.queryDb(query, response);
}

function getRating(id, response){
    var query = 'SELECT ratings.*, users.Name as Name FROM ratings '
                +'JOIN users ON users.Id = ratings.UserId '
                +'WHERE ratings.Id = ?';
    db.queryDbWithValues(query, id, response);
}

function getSongRatings(id, response){
    var query = 'SELECT ratings.*, users.Name as Name FROM ratings '
                +'JOIN users ON users.Id = ratings.UserId '
                +'WHERE ratings.SongId = ?';
    db.queryDbWithValues(query, id, response);
}

function getUserRatings(id, response){
    var query = 'SELECT * FROM ratings '
                +'WHERE UserId = ?';
    db.queryDbWithValues(query, id, response);
}

function createRating(song_id, user_id, rating, text, response){
    var query = 'INSERT INTO ratings (SongId, UserId, Rating, Text) '
                +'VALUES (?, ?, ?, ?)';
    var values = [song_id, user_id, rating, text];
    db.queryDbWithValuesGetInsertId(query, values, (err, result) =>{
        if (err) response(err, result);
        else updateSongAvgRating(song_id, (err, song_result) =>{
            response(err, result)
        });
    });
}

function removeRating(id, response){
    var query = 'SELECT SongId FROM ratings WHERE Id = ?';
    db.queryDbWithValues(query, id, (err, result) =>{
        if (err || !result || result.length === 0) response(err, result);
        else{
            song_id = result[0].SongId;
            query = 'DELETE FROM ratings WHERE Id = ?';
            db.queryDbWithValues(query, id, (err, result) =>{
                if (err) response(err, result);
                else updateSongAvgRating(song_id, response);
            });
        }
    });
}

function removeMultipleRatings(ids, response){
    var query = 'SELECT SongId FROM ratings ' 
                +'WHERE Id IN ('+'?,'.repeat(ids.length).slice(0,-1)+')';
    db.queryDbWithValues(query, ids, (err, result) =>{
        if (err || !result || result.length === 0) response(err, result);
        else{
            song_ids = [];
            result.forEach(element => {
                song_ids.push(element.SongId);
            });
            query = 'DELETE FROM ratings '+ 
                    'WHERE Id IN ('+'?,'.repeat(ids.length).slice(0,-1)+')';
            db.queryDbWithValues(query, ids, (err, result) =>{
                if (err) response(err);
                else{
                    updateMultipleSongAvgRating(song_ids, response);
                }
            });
        }
    });
}

function removeSongRatings(id, response){
    var query = 'DELETE FROM ratings WHERE SongId = ?';
    db.queryDbWithValues(query, id, response);
}

function removeMultipleSongRatings(ids, response){
    var query = 'DELETE FROM ratings '
                +'WHERE SongId IN ('+'?,'.repeat(ids.length).slice(0,-1)+')';
    db.queryDbWithValues(query, ids, response);
}

function removeUserRatings(id, response){
    var query = 'SELECT SongId FROM ratings WHERE UserId = ?';
    db.queryDbWithValues(query, id, (err, result) =>{
        if (err) response(err, result);
        else if (!result || result.length === 0) response(new Error('no ratings'), result);
        else{
            songs = result;
            query = 'DELETE FROM ratings WHERE UserId = ?';
            db.queryDbWithValues(query, id, (err, result) =>{
                if (err) response(err, result);
                else{
                    ids = songs.map(s => s.SongId);
                    updateMultipleSongAvgRating(ids, response);
                } 
            });
        }
    });
}

function updateRating(id, rating, text, response){
    var query = 'UPDATE ratings SET Rating = ?, Text = ? '
                +'WHERE Id = ?;'
                +'SELECT SongId FROM ratings WHERE Id = ?';
    var values = [rating, text, id, id];
    db.queryDbWithValues(query, values, (err, result) =>{
        if (err || result[1][0] == null) response(err, result);
        else updateSongAvgRating(result[1][0].SongId, response);
    });
}

function updateSongAvgRating(id, response){
    var query = 'UPDATE songs JOIN (SELECT SongId, AVG(ratings.Rating) AS AvgRating '
        +'FROM ratings GROUP BY SongId) avgs '
        +'ON songs.Id = avgs.SongId '
        +'SET songs.Rating = avgs.AvgRating '
        +'WHERE songs.Id = ?';
    db.queryDbWithValues(query, id, response);
}

function updateMultipleSongAvgRating(ids, response){
    var query = 'UPDATE songs LEFT JOIN (SELECT SongId, AVG(ratings.Rating) AS AvgRating '
                +'FROM ratings GROUP BY SongId) avgs '
                +'ON songs.Id = avgs.SongId '
                +'SET songs.Rating = avgs.AvgRating '
                +'WHERE songs.Id IN ('+'?,'.repeat(ids.length).slice(0, -1)+')';

    db.queryDbWithValues(query, ids, (err, result) =>{
        if (err) response(err, result);
        else response(null, null);
    });
}

function userIsAuthor(rating_id, user_id, next){
    var query = 'SELECT UserId FROM ratings WHERE Id = ?';
    db.queryDbWithValues(query, rating_id, (err, result) =>{
        var is_author = (!err && result && result.length > 0 && result[0].UserId == user_id);
        next(is_author);
    });
}

module.exports = {
    getAllRatings : getAllRatings,
    getRating : getRating,
    getSongRatings : getSongRatings,
    getUserRatings : getUserRatings,
    createRating : createRating,
    removeRating : removeRating,
    removeMultipleRatings : removeMultipleRatings,
    removeSongRatings : removeSongRatings,
    removeMultipleSongRatings : removeMultipleSongRatings,
    removeUserRatings : removeUserRatings,
    updateRating : updateRating,
    userIsAuthor : userIsAuthor
}