const common = require('../common');
const tv = require('../../validators/tokenValidator');

const chai = common.chai;
const should = common.should;
const expect = common.expect;
const models = common.models;

describe('create Token', () =>{
    beforeEach((done) =>{
        common.resetAllTables((err) =>{
            if (err) done(err);
            else{
                var insert = new models.Inserter( [['user', 'password', 0]], [], [], [], []);
                insert.executeInsert((err) =>{
                    done(err);
                });
            }
        });
    });

    it('should create a token when given correct name', (done) =>{
        var req = common.createRequest({ name : 'user' });
        tv.validateCreateToken(req, (token) =>{
            should.exist(token);
            done();
        });
    });

    it('should not create a token when given incorrect name', (done) =>{
        var req = common.createRequest({ name : 'user2' });
        tv.validateCreateToken(req, (token) =>{
            should.not.exist(token);
            done();
        });
    });

    it('should not create a token when not given a name', (done) =>{
        var req = common.createRequest({});
        tv.validateCreateToken(req, (token) =>{
            should.not.exist(token);
            done();
        });
    }); 
});

describe('auth Token', () =>{
    it('should auth a correct token', (done) =>{
        getValidToken(done, (token) =>{
            should.exist(token);
            var req = common.createRequest({ token : token });
            tv.validateAuthToken(req, 0, (result) =>{
                should.exist(result);
                done();
            });
        });
    });

    it('should auth an admin token', (done) =>{
        getValidAdminToken(done, (token) =>{
            should.exist(token);
            var req = common.createRequest({ token : token });
            tv.validateAuthToken(req, 1, (result) =>{
                should.exist(result);
                done();
            });
        });
    });

    it('should not auth a standard token when admin is required', (done) =>{
        getValidToken(done, (token) =>{
            should.exist(token);
            var req = common.createRequest({ token : token });
            tv.validateAuthToken(req, 1, (result) =>{
                should.not.exist(result);
                done();
            });
        });
    });

    it('should auth an admin token when standard is required', (done) =>{
        getValidAdminToken(done, (token) =>{
            should.exist(token);
            var req = common.createRequest({ token : token });
            tv.validateAuthToken(req, 0, (result) =>{
                should.exist(result);
                done();
            });
        });
    });

    it('should not auth an altered token', (done) =>{
        getValidAdminToken(done, (token) =>{
            should.exist(token);

            var alt_token;
            if (token[token.length - 1] == 's') alt_token = token.replace(/.$/,"");
            else alt_token = token.replace(/.$/, "t");

            var req = common.createRequest({ token : alt_token });
            tv.validateAuthToken(req, 0, (result) =>{
                should.not.exist(result);
                done();
            });
        });
    });

    it('should not auth when no token present', (done) =>{
        var req = common.createRequest({});
        tv.validateAuthToken(req, 0, (result) =>{
            should.not.exist(result);
            done();
        });
    });
});

function getValidToken(done, next){
    var insert = new models.Inserter( [['user', 'password', 0]], [], [], [], []);
    insert.executeInsert((err) =>{
        if (err) done(err);
        else{
            var req = common.createRequest({ name : 'user' });
            tv.validateCreateToken(req, (token) =>{
                next(token);
            });
        }
    });
}

function getValidAdminToken(done, next){
    var insert = new models.Inserter( [['user', 'password', 1]], [], [], [], []);
    insert.executeInsert((err) =>{
        if (err) done(err);
        else{
            var req = common.createRequest({ name : 'user' });
            tv.validateCreateToken(req, (token) =>{
                next(token);
            });
        }
    });
}