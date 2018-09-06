var db = require('../db');

function getAllSongTags(response){
    var query = 'SELECT songtags.*, tags.Name FROM songtags '
                +'LEFT OUTER JOIN tags ON songtags.TagId = tags.Id';
    db.queryDb(query, response);
}

function getSongTags(id, response){
    var query = 'SELECT DISTINCT tags.Name FROM songtags '
                +'JOIN tags ON songtags.TagId = tags.Id '
                +'WHERE SongId = ?';
    db.queryDbWithValues(query, id, response);
}

function createSongTags(id, tags, response){
    var query = 'INSERT INTO songtags (SongId, TagId) '
                +'SELECT ?, tags.Id '
                +'FROM tags '
                +'WHERE tags.Name IN ('+'?,'.repeat(tags.length).slice(0, -1)+')';
    var values = [id].concat(tags);
    db.queryDbWithValues(query, values, response);
}

function createMultipleSongTags(ids, tags, response){
    var query = '';
    var values = [];
    ids.forEach(id => {
        query += 'INSERT INTO songtags (SongId, TagId) '
                 +'SELECT ?, tags.Id '
                 +'FROM tags '
                 +'WHERE tags.Name IN ('+'?,'.repeat(tags.length).slice(0, -1)+'); ';
        this_value = [id].concat(tags);
        values = values.concat(this_value);
    });
    db.queryDbWithValues(query, values, response);
}

function removeSongTags(id, response){
    var query = 'DELETE FROM songtags '
                +'WHERE SongId = ?';
    db.queryDbWithValues(query, id, response);
}

function removeMultipleSongTags(ids, response){
    var query = 'DELETE FROM songtags '
                +'WHERE SongId IN ('+'?,'.repeat(ids.length).slice(0, -1)+')';
    db.queryDbWithValues(query, ids , response);
}

function removeTagType(id, response){
    var query = 'DELETE FROM songtags '
                +'WHERE TagId = ?';
    db.queryDbWithValues(query, id, response);
}

function removeMultipleTagTypes(ids, response){
    var query = 'DELETE FROM songtags '
                +'WHERE TagId IN ('+'?,'.repeat(ids.length).slice(0, -1)+')';
    db.queryDbWithValues(query, ids, response);
}

function removeSelectSongTags(id, tags, response){
    var query = 'DELETE FROM songtags '
                +'WHERE SongId = ? AND TagId '
                +'IN (SELECT Id FROM tags '
                +'WHERE Name IN ('+'?,'.repeat(tags.length).slice(0, -1)+'))';
    var values = [id].concat(tags);
    db.queryDbWithValues(query, values, response);
}

function removeTagFromMultipleSongs(ids, tag, response){
    var query = 'DELETE FROM songtags '
                +'WHERE SongId IN ('+'?,'.repeat(ids.length).slice(0, -1)+') '
                +'AND TagId = (SELECT tags.Id FROM tags '
                +'WHERE Name = ?)';
    var values = ids.concat([tag]);
    db.queryDbWithValues(query, values, response);
}

function addTagToMultipleSongs(ids, tag, response){
    var query = 'SELECT Id FROM tags WHERE Name = ?';
    db.queryDbWithValues(query, tag, (err, result) =>{
        if (err) response(err, result);
        else{
            var query = 'INSERT INTO songtags (SongId, TagId) '
                +'VALUES ?';
            var values = []
            ids.forEach(id =>{
                values.push([id, result[0].Id]);
            });
            db.queryDbWithValues(query, [values], response);
        }
    });
}

function updateSongTags(id, new_tags, response){
    removeSongTags(id, (err, result) =>{
        if (err || new_tags.length == 0) response(err, result);
        else createSongTags(id, new_tags, response);
    });
}

function updateMultipleSongTags(ids, new_tags, response){
    removeMultipleSongTags(ids, (err, result) =>{
        if (err || new_tags.length == 0) response(err, result);
        else createMultipleSongTags(ids, new_tags, response);
    });
}

module.exports = {
    getAllSongTags : getAllSongTags,
    getSongTags : getSongTags,
    createSongTags : createSongTags,
    removeSongTags : removeSongTags,
    removeMultipleSongTags : removeMultipleSongTags,
    removeTagType : removeTagType,
    removeMultipleTagTypes : removeMultipleTagTypes,
    removeTagFromMultipleSongs : removeTagFromMultipleSongs,
    addTagToMultipleSongs : addTagToMultipleSongs,
    updateSongTags : updateSongTags,
    updateMultipleSongTags : updateMultipleSongTags,
    removeSelectSongTags : removeSelectSongTags,
}