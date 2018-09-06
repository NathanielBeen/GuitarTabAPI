const bcrypt = require('bcrypt');

const common = require('../common');
const uv = require('../../validators/userValidator');
const rv = require('../../validators/ratingValidator');

const chai = common.chai;
const should = common.should;
const expect = common.expect;
const models = common.models;

describe('get All users', () =>{
    it ('should get all users given a filled database', (done) =>{
        insertUserSet(done, (user_id) =>{
            uv.validateGetAllUsers({}, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('name2');
                expect(result[0].Type).to.equal(0);
                expect(result[1].Type).to.equal(1);
                done();
            });
        });
    });

    it('should return no results from an empty database', (done) =>{
        uv.validateGetAllUsers({}, (err, result) =>{
            should.not.exist(err);
            expect(result).to.have.lengthOf(0);
            done();
        });
    });
});

describe('get user by id', () =>{
    it ('should return a user given a correct id', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id + 1});
            uv.validateGetUserById(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Name).to.equal('name2');
                expect(result[0].Type).to.equal(1);
                done();
            });
        });
    });

    it('should not return a user given an incorrect id', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id + 2});
            uv.validateGetUserById(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should not return a user given no id', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({});
            uv.validateGetUserById(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not return a user given a string id', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id :'user_id'});
            uv.validateGetUserById(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('get user by name', () =>{
    it ('should return a user given a correct name', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name'});
            uv.validateGetUserByName(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Id).to.equal(user_id);
                expect(result[0].Type).to.equal(0);
                done();
            });
        });
    });

    it('should not return a user given an incorrect name', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name3'});
            uv.validateGetUserByName(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should not return a user given an invalid integer name', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 2});
            uv.validateGetUserByName(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should not return a user given no name', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({});
            uv.validateGetUserByName(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('create user', () =>{
    it ('should create a user given proper inputs', (done) =>{
        var req = common.createRequest({ name : 'username', password : 'password'});
        uv.validateCreateUser(req, 0, (err, result) =>{
            should.not.exist(err);
            id = result;
            var req = common.createRequest({ user_id : id });
            uv.validateGetUserById(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Name).to.equal('username');
                expect(result[0].Type).to.equal(0);
                done();
            });
        });
    });

    it('should not create a user when not all inputs given', (done) =>{
        var req = common.createRequest({ name : 'username' });
        uv.validateCreateUser(req, 0, (err, result) =>{
            should.exist(err);
            done();
        });
    });

    it('should not create a user when inputs contain symbols', (done) =>{
        var req = common.createRequest({ name : 'username!', password : 'pa$$word' });
        uv.validateCreateUser(req, 0, (err, result) =>{
            should.exist(err);
            done();
        });
    });

    it('should create a user when the inputs contain letters, numbers, and underscores', (done) =>{
        var req = common.createRequest({ name : 'user_name', password : '_password' });
        uv.validateCreateUser(req, 1, (err, result) =>{
            should.not.exist(err);
            id = result;
            var req = common.createRequest({ user_id : id });
            uv.validateGetUserById(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Name).to.equal('user_name');
                expect(result[0].Type).to.equal(1);
                done();
            });
        });
    });

    it('should not create a user when the inputs are too short', (done) =>{
        var req = common.createRequest({ name : 'use', password : 'passwor' });
        uv.validateCreateUser(req, 0, (err, result) =>{
            should.exist(err);
            done();
        });
    });

    it('should not create a user when the type is invalid', (done) =>{
        var req = common.createRequest({ name : 'username', password : 'password' });
        uv.validateCreateUser(req, 2, (err, result) =>{
            should.exist(err);
            done();
        });
    });

    it('should not create a user when the name already exists', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({ name : 'name', password : 'password5' });
            uv.validateCreateUser(req, 1, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove user', () =>{
    it('should remove the user and the users ratings when valid if given', (done) =>{
        insertUserAndRatingSet(done, (user_id, rating_id) =>{
            var req = common.createRequest({user_id : user_id + 1});
            console.log(user_id);
            uv.validateRemoveUser(req, (err, result) =>{
                should.not.exist(err);
                uv.validateGetUserById(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(0);
                    rv.validateGetAllRatings({}, (err, result) =>{
                        should.not.exist(err);
                        expect(result).to.have.lengthOf(1);
                        expect(result[0].Text).to.equal('text');
                        done();
                    });
                });
            });
        });
    });

    it('should not remove the user when no id given', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({});
            uv.validateRemoveUser(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove the user when incorrect id given', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id + 2});
            uv.validateRemoveUser(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove the user given a string user_id', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : 'user_id'});
            uv.validateRemoveUser(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('change user type', () =>{
    it('should change the user type when given correct input', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id, type : 1});
            uv.validateChangeUserType(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({user_id : user_id});
                uv.validateGetUserById(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].Name).to.equal('name');
                    expect(result[0].Type).to.equal(1);
                    done();
                });
            });
        });
    });

    it('should do nothing when correct input given and type set to not change', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id, type : 0});
            uv.validateChangeUserType(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({user_id : user_id});
                uv.validateGetUserById(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].Name).to.equal('name');
                    expect(result[0].Type).to.equal(0);
                    done();
                });
            });
        });
    });

    it('should not change the user when inputs not given', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id});
            uv.validateChangeUserType(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not change the user when incorrect id given', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id + 2, type : 1});
            uv.validateChangeUserType(req, (err, result) =>{
                should.not.exist(err);
                uv.validateGetAllUsers(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(2);
                    expect(result[0].Type).to.equal(0);
                    expect(result[1].Type).to.equal(1);
                    done();
                });
            });
        });
    });

    it('should not change the user when incorrect type given', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id, type : 2});
            uv.validateChangeUserType(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not change the user when string user_id given', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({user_id : 'user_id', type : 1});
            uv.validateChangeUserType(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('change user password', () =>{
    it('should change the password when proper input given', (done) =>{
        insertUser(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id, new_password : 'new_password'});
            uv.validateChangeUserPassword(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({ name : 'name', password : 'new_password'});
                uv.validateVerifyPassword(req, (result) =>{
                    should.exist(result)
                    done();
                });
            });
        });
    });

    it('should not change the password when inputs left out', (done) =>{
        insertUser(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id});
            uv.validateChangeUserPassword(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not change the password when new password contains symbols', (done) =>{
        insertUser(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id, new_password : 'new_pa$$word'});
            uv.validateChangeUserPassword(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not change the password when new password is too short', (done) =>{
        insertUser(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id, new_password : 'passwor'});
            uv.validateChangeUserPassword(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not change the password when given the wrong user id', (done) =>{
        insertUser(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id + 1, new_password : 'new_password'});
            uv.validateChangeUserPassword(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({ name : 'name', password : 'new_password'});
                uv.validateVerifyPassword(req, (result) =>{
                    should.not.exist(result);
                    done();
                });
            });
        });
    });

    it('should do nothing when given a matching password', (done) =>{
        insertUser(done, (user_id) =>{
            var req = common.createRequest({user_id : user_id, new_password : 'password'});
            uv.validateChangeUserPassword(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({ name : 'name', password : 'password'});
                uv.validateVerifyPassword(req, (result) =>{
                    should.exist(result);
                    done();
                });
            });
        });
    });

    it('should not change the password when the user_id is a string', (done) =>{
        insertUser(done, (user_id) =>{
            var req = common.createRequest({user_id : 'user_id', new_password : 'password2'});
            uv.validateChangeUserPassword(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('validate verify password', () =>{
    it('should verify the password given the correct credentials', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name', password : 'password'});
            uv.validateVerifyPassword(req, (result) =>{
                expect(result).to.equal(user_id);
                done();
            });
        });
    });

    it('should not verify the password given incomplete credentials', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name'});
            uv.validateVerifyPassword(req, (result) =>{
                expect(result).to.equal(null);
                done();
            });
        });
    });

    it('should not verify the password given mismathced password', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name', password : 'password2'});
            uv.validateVerifyPassword(req, (result) =>{
                expect(result).to.equal(null);
                done();
            });
        });
    });

    it('should not verify the password given wrong name', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name3', password : 'password'});
            uv.validateVerifyPassword(req, (result) =>{
                expect(result).to.equal(null);
                done();
            });
        });
    });

    it('should not verify the password given wrong password', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name', password : 'password4'});
            uv.validateVerifyPassword(req, (result) =>{
                expect(result).to.equal(null);
                done();
            });
        });
    });
});

describe('verify admin password', () =>{
    it('should verify the password given the correct credentials', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name2', password : 'password2'});
            uv.validateVerifyAdminPassword(req, (result) =>{
                expect(result).to.equal(user_id + 1);
                done();
            });
        });
    });

    it('should not verify the password given incomplete credentials', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name'});
            uv.validateVerifyAdminPassword(req, (result) =>{
                expect(result).to.equal(null);
                done();
            });
        });
    });

    it('should not verify the password given mismathced password', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name2', password : 'password'});
            uv.validateVerifyAdminPassword(req, (result) =>{
                expect(result).to.equal(null);
                done();
            });
        });
    });

    it('should not verify the password given wrong name', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name3', password : 'password'});
            uv.validateVerifyAdminPassword(req, (result) =>{
                expect(result).to.equal(null);
                done();
            });
        });
    });

    it('should not verify the password given wrong password', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name2', password : 'password4'});
            uv.validateVerifyAdminPassword(req, (result) =>{
                expect(result).to.equal(null);
                done();
            });
        });
    });

    it('should not verify the password given correct credentials but non-admin account', (done) =>{
        insertUserSet(done, (user_id) =>{
            var req = common.createRequest({name : 'name', password : 'password'});
            uv.validateVerifyAdminPassword(req, (result) =>{
                expect(result).to.equal(null);
                done();
            });
        });
    });
});

function insertUser(done, next){
    var req = common.createRequest({ name : 'name', password : 'password'});
    uv.validateCreateUser(req, 0, (err, result) =>{
        var id = result;
        if (err) done(err);
        else next(id);
    });
}

function insertUserSet(done, next){
    var req = common.createRequest({ name : 'name', password : 'password'});
    uv.validateCreateUser(req, 0, (err, result) =>{
        var id = result;
        if (err) done(err);
        else{
            var req = common.createRequest({ name : 'name2', password : 'password2'});
            uv.validateCreateUser(req, 1, (err, result) =>{
                if (err) done(err);
                else next(id);
            });
        }
    });
}

function insertUserAndRatingSet(done, next){
    bcrypt.hash('password', 10, (err, pass_1) =>{
        bcrypt.hash('password2', 10, (err, pass_2) =>{
            var insert = new models.Inserter(
                [['name', pass_1, 0], ['name2', pass_2, 1]], [], [], [],
                [[0, 0, 5, 'text'], [0, 1, 4, 'text2'], [1, 1, 5, 'text3']]);
            insert.executeInsert((err) =>{
                if (err) done(err);
                else next(insert.getUserId(), insert.getRatingId());
            });
        });
    });
}