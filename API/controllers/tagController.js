var db = require('../db');
var Ptc = require('./productTagController');

function getAllTags(response){
    var query = 'SELECT * FROM tags';
    db.queryDb(query, response);
}

function getTag(id, response){
    var query = 'SELECT * FROM tags '
                +'WHERE Id = ?';
    db.queryDbWithValues(query, id, response);
}

function createTag(name, type, response){
    var query = 'INSERT INTO tags (Name, Type) '
                +'VALUES (?, ?)';
    var values = [name, type];
    db.queryDbWithValuesGetInsertId(query, values, response);
}

function removeTag(id, response){
    var query = 'DELETE FROM tags '
                +'WHERE Id = ?';
    db.queryDbWithValues(query, id, (err, result) =>{
        if (err) response(err, result);
        else Ptc.removeTagType(id, response);
    });
}

function removeMultipleTags(ids, response){
    var query = 'DELETE FROM tags '
                +'WHERE Id IN ('+'?,'.repeat(ids.length).slice(0, -1)+')';
    db.queryDbWithValues(query, ids, (err, result) =>{
        if (err) response(err, result);
        else Ptc.removeMultipleTagTypes(ids, response);
    });
}

function updateTag(id, name, type, response){
    var query = 'UPDATE tags '
                +'SET Name = ?, Type = ? '
                +'WHERE Id = ?';
    var values = [name, type, id];
    db.queryDbWithValues(query, values, response);
}

function updateMultipleTagTypes(ids, type, response){
    var query = 'UPDATE tags '
                +'SET Type = ? '
                +'WHERE Id IN ('+'?,'.repeat(ids.length).slice(0, -1)+')';
    var values = [type].concat(ids);
    db.queryDbWithValues(query, values, response);
}

function verifyNameIsValidTag(tag, response){
    var query = 'SELECT COUNT(*) AS NumTags '
                +'FROM tags WHERE Name = ?';
    db.queryDbWithValues(query, tag, (err, result) =>{
        if (err) response(false);
        else{
            var present = result[0].NumTags === 1;
            response(present);
        }
    });
}

function verifyNamesAreValidTags(tags, response){
    var query = 'SELECT COUNT(*) AS NumTags '
                +'FROM tags '
                +'WHERE Name IN ('+'?,'.repeat(tags.length).slice(0, -1)+')';
    db.queryDbWithValues(query, tags, (err, result) =>{
        if (err) response(false);
        else{
            var present = (tags.length === result[0].NumTags);
            response(present);
        }
    });
}

module.exports = {
    getAllTags : getAllTags,
    getTag : getTag,
    createTag: createTag, 
    removeTag: removeTag,
    removeMultipleTags : removeMultipleTags,
    updateTag: updateTag,
    updateMultipleTagTypes : updateMultipleTagTypes,
    verifyNameIsValidTag : verifyNameIsValidTag,
    verifyNamesAreValidTags, verifyNamesAreValidTags
}