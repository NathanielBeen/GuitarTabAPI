var common = require('./common');
var app = require('../app');

/*
describe('function tests', () =>{
    beforeEach((done) =>{
        common.resetAllTables((err) =>{
            if (err) done(err);
            else done();
        });
    });
    importTest("tokenController", './validationTests/tokenTests');
    importTest("tagController", './validationTests/tagTests');
    importTest("userController", './validationTests/userTests');
    importTest("authentication", './validationTests/authenticationTests');
    importTest("productTagController", './validationTests/productTagTests');
    importTest("ratingController", './validationTests/ratingTests');
    importTest("searchController", './validationTests/searchTests');
    importTest("songController", './validationTests/songTests');
});*/

describe('route tests', () =>{
    importRouteTest('./routeTests/ratingTests');
});

function importTest(name, path){
    describe(name, () => {
        require(path);
    });
}

function importRouteTest(path){
    require(path);       
}