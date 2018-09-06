const common = require('../common');
const bcrypt = require('bcrypt');
const auth = require('../../validators/authentication');
const tv = require('../../validators/tokenValidator');

const chai = common.chai;
const should = common.should;
const expect = common.expect;
const models = common.models;

describe('auth token', () =>{
    it('should auth a correct token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name'});
            tv.validateCreateToken(req, (result) =>{
                should.exist(result);
                var req = common.createRequest({token : result});
                auth.authToken(req, (err) =>{
                    should.not.exist(err);
                    done();
                });
            });
        });
    });

    it('should auth an admin token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name2'});
            tv.validateCreateToken(req, (result) =>{
                should.exist(result);
                var req = common.createRequest({token : result});
                auth.authToken(req, (err) =>{
                    should.not.exist(err);
                    done();
                });
            });
        });
    });

    it('should not auth when a token doesnt exist', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({});
            auth.authToken(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should should not auth an altered token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name'});
            tv.validateCreateToken(req, (result) =>{
                should.exist(result);

                var alt_token;
                if (result[result.length - 1] == 's') alt_token = result.replace(/.$/,"");
                else alt_token = result.replace(/.$/, "t");
                var req = common.createRequest({token : alt_token});
                auth.authToken(req, (err) =>{
                    should.exist(err);
                    done();
                });
            });
        });
    });
});

describe('auth admin token', () =>{
    it('should auth a correct token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name2'});
            tv.validateCreateToken(req, (result) =>{
                should.exist(result);
                var req = common.createRequest({token : result});
                auth.authAdminToken(req, (err) =>{
                    should.not.exist(err);
                    done();
                });
            });
        });
    });

    it('should not auth a non-admin token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name'});
            tv.validateCreateToken(req, (result) =>{
                should.exist(result);
                var req = common.createRequest({token : result});
                auth.authAdminToken(req, (err) =>{
                    should.exist(err);
                    done();
                });
            });
        });
    });

    it('should not auth given no token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({});
            auth.authAdminToken(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not auth an altered token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name2'});
            tv.validateCreateToken(req, (result) =>{
                should.exist(result);

                var alt_token;
                if (result[result.length - 1] == 's') alt_token = result.replace(/.$/,"");
                else alt_token = result.replace(/.$/, "t");
                var req = common.createRequest({token : alt_token});
                auth.authAdminToken(req, (err) =>{
                    should.exist(err);
                    done();
                });
            });
        });
    });
});

describe('auth login', (done) =>{
    it('should pass a valid login and create a token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name', password : 'password'});
            auth.authLogin(req, (err, token) =>{
                should.not.exist(err);
                should.exist(token);
                done();
            });
        });
    });

    it('should pass an admin login and create a token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name2', password : 'password'});
            auth.authLogin(req, (err, token) =>{
                should.not.exist(err);
                should.exist(token);
                done();
            });
        });
    });

    it('should not pass an invalid login and not create a token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name2', password : 'password2'});
            auth.authLogin(req, (err, token) =>{
                should.not.exist(token);
                should.exist(err);
                done();
            });
        });
    });

    it('should not pass an incomplete login and not create a token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name2'});
            auth.authLogin(req, (err, token) =>{
                should.not.exist(token);
                should.exist(err);
                done();
            });
        });
    });
});

describe('auth admin login', () =>{
    it('should pass a valid login and create a token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name2', password : 'password'});
            auth.authAdminLogin(req, (err, token) =>{
                should.not.exist(err);
                should.exist(token);
                done();
            });
        });
    });

    it('should not pass a non-admin login and not create a token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name', password : 'password'});
            auth.authAdminLogin(req, (err, token) =>{
                should.not.exist(token);
                should.exist(err);
                done();
            });
        });
    });

    it('should not pass an invalid login and not create a token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name2', password : 'password2'});
            auth.authAdminLogin(req, (err, token) =>{
                should.not.exist(token);
                should.exist(err);
                done();
            });
        });
    });

    it('should not pass an incomplete login and not create a token', (done) =>{
        insertUsers(done, (user_id) =>{
            var req = common.createRequest({name : 'name2'});
            auth.authAdminLogin(req, (err, token) =>{
                should.not.exist(token);
                should.exist(err);
                done();
            });
        });
    });
});

function insertUsers(done, next){
    bcrypt.hash('password', 10, (err, pass_1) =>{
        var inserts = new models.Inserter(
            [['name', pass_1, 0], ['name2', pass_1, 1]],
            [], [], [], []);
        inserts.executeInsert((err) =>{
            if (err) done(err);
            else next(inserts.getUserId());
        });
    });
}