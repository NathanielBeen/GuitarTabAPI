const common = require('../common');
const tv = require('../../validators/tokenValidator');

function insertTestInfo(next){
    var insert = new common.models.Inserter(
        [['user', 'password', 0], ['user2', 'password', 1], ['name3', 'password', 0]],
        [['tag', 'type'], ['tag2', 'type2'], ['tag3', 'type2'], ['tag4', 'type2']],
        [['song', 'artist', 'album', 0, 3, 0, 'tab'], ['song2', 'artist2', 'album2', 1, 5, 0, 'tab']],
        [[0, 0], [0,1], [0,3], [1,1], [1,2]],
        [[0, 0, 4, 'text'], [0, 2, 2, 'text'], [1, 1, 5, 'text'], [1, 2, 5, 'text']]
    );
    insert.executeInsert((err) =>{
        if(err) done(err);
        else next(insert.getSongId(), insert.getTagId(), insert.getSongTagId(), insert.getUserId(), insert.getRatingId());
    });
}

function getValidToken(next){
    var req = common.createRequest({name : 'user'});
    tv.validateCreateToken(req, (result) =>{
        next(result);
    });
}

function getValidAdminToken(next){
    var req = common.createRequest({name : 'user2'});
    tv.validateCreateToken(req, (result) =>{
        next(result);
    });
}

module.exports = {
    insertTestInfo, insertTestInfo,
    getValidToken : getValidToken,
    getValidAdminToken : getValidAdminToken
}