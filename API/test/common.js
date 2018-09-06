var chai = require('chai');
var chaiHttp = require('chai-http');
var db = require('../db');
var models = require('./models');

var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

function resetAllTables(done){
    if (process.env.DB_TYPE === 'Production'){
        console.log("tried to delete all data in production");
        done(new Error());
        return;
    }
    var query = 'DELETE FROM ratings;'
                +'DELETE FROM songs;'
                +'DELETE FROM songtags;'
                +'DELETE FROM tags;'
                +'DELETE FROM users';
    db.queryDb(query, (err, result) =>{
        if (err){
            console.log('failed to clear db '+err);
            done(err);
        }
        else done();
    });
}

function createRequest(body){
    return {body : body}
}

module.exports = {
    chai : chai,
    should : should,
    expect, expect,
    db : db,
    models : models,
    resetAllTables : resetAllTables,
    createRequest : createRequest
}