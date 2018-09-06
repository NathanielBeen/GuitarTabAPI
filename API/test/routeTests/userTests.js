const common = require('../common');
const app = require('../../app');
const db = require('./routeDb');

const chai = common.chai;
const should = common.should;
const expect = common.expect;

//valid login: user,password
//valid admin login: user2,password
const VALIDATION = 0;
const DATABASE = 1;
const AUTHENTICATION = 2;

describe('user routes', ()=>{
    describe('GET /', (done) =>{
        it('should get all users given correct input', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .get('/users/')
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(200);
                        res.body.should.have.property('result');
                        res.body.result.should.have.lengthOf(3);
                        res.body.result[0].Name.should.equal('user');
                        res.body.reuslt[1].Name.should.equal('user2');
                        res.body.result[2].Type.should.equal(0);
                        done();
                    });
                }
            });
        });
        
        it('should send auth error if no token given', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .get('/users/')
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(401);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('auth error');
                        result.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should send auth error if non-admin user token given', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .get('/users/')
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(401);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('auth error');
                        result.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });
    });

    describe('POST /signup', () =>{
        it('should create a user given correct inputs', (done) =>{
            chai.request(app)
            .post('/users/signup')
            .send({name : 'new_user', password : 'password'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('result');
                res.body.should.have.property('id');
                res.body.id.should.equal(user_id + 3);
                done();
            });
        });

        it('should send a validation error given invalid input', (done) =>{
            chai.request(app)
            .post('/users/signup')
            .send({name : 'new_user', password : 'pas'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('name must be at least 4 characters and password must be at least 8 characters');
                res.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });

        it('should send a validation error given a username that already exists', (done) =>{
            chai.request(app)
            .post('/users/signup')
            .send({name : 'user', password : 'pas'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('username already exists');
                res.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });
    });

    describe('POST /signup-admin', ()=>{
        it('should create a user given correct inputs', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                chai.request(app)
                    .post('/users/signup-admin')
                    .set('x-access-token', token)
                    .send({name : 'new_user', password : 'password'})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(200);
                        res.body.should.have.property('result');
                        res.body.should.have.property('id');
                        res.body.id.should.equal(user_id + 3);
                        done();
                    });
                }
            });
        });

        it('should send a validation error given invalid input', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                chai.request(app)
                    .post('/users/signup-admin')
                    .set('x-access-token', token)
                    .send({name : 'user', password : 'password'})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(401);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('auth error');
                        res.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error given no token', (done) =>{
            chai.request(app)
            .post('/users/signup-admin')
            .send({name : 'user', password : 'password'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('auth error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('POST /login', ()=>{
        it('should login a user given valid input', (done) =>{
            chai.request(app)
            .post('/users/login')
            .send({name : 'user', password : 'password'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('token');
                res.body.token.userId.should.equal(user_id);
                res.body.should.have.property('id');
                res.body.id.should.equal(user_id);
                done();
            });
        });

        it('should not login a user given incomplete input', (done) =>{
            chai.request(app)
            .post('/users/login')
            .send({name : 'user'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('auth error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });

        it('should not login a user given invalid login', (done) =>{
            chai.request(app)
            .post('/users/login')
            .send({name : 'user', password:'wrong'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('auth error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('GET /', () =>{
        it ('should get a user given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                chai.request(app)
                    .get('/users/'+user_id)
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(200);
                        res.body.should.have.property('result');
                        res.body.result.should.have.lengthOf(1);
                        res.body.result[0].Id.should.equal(user_id);
                        res.body.result[0].Name.should.equal('user');
                        res.body.result[0].Type.should.equal(0);
                        done();
                    });
                }
            });
        });

        it ('should get an empty result given an invalid id', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                chai.request(app)
                    .get('/users/'+(user_id - 1))
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(200);
                        res.body.should.have.property('result');
                        res.body.result.should.have.lengthOf(0);
                        done();
                    });
                }
            });
        });

        it ('should send an auth error given non-admin token', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                chai.request(app)
                    .get('/users/'+(user_id - 1))
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(401);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('auth error');
                        res.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it ('should send an auth error given no token', (done) =>{
            chai.request(app)
            .get('/users/'+(user_id - 1))
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('auth error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('DELETE /admin/', () =>{
        it ('should delete a user given valid input', (done) =>{
            chai.request(app)
            .delete('/users/admin/'+user_id)
            .send({name:'user2', password:'password'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('result');
                res.body.should.have.property('token');
                done();
            });
        });

        it ('should send an auth error given incomplete input', (done) =>{
            chai.request(app)
            .delete('/users/admin/'+user_id)
            .send({name:'user2'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('auth error');
                res.nody.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });

        it ('should send an auth error given non-admin login', (done) =>{
            chai.request(app)
            .delete('/users/admin/'+user_id)
            .send({name:'user', password : 'password'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('auth error');
                res.nody.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('PATCH /change-password', () =>{
        it ('should change a password given valid input', (done) =>{
            chai.request(app)
            .patch('/users/change-password')
            .send({name:'user', password:'password', new_password:'newpassword'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('result');
                res.body.should.have.property('token');
                done();
            });
        });

        it ('should send a validation error given an invalid new password', (done) =>{
            chai.request(app)
            .patch('/users/change-password')
            .send({name:'user', password:'password', new_password:'new?password'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('password must only contain numbers, letters, and underscores');
                res.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });

        it ('should not change a password given an invalid login', (done) =>{
            chai.request(app)
            .patch('/users/change-password')
            .send({name:'user', password:'password2', new_password:'new_password'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('auth error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('PATCH /change-user-type', ()=>{
        it('should change the user type given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                chai.request(app)
                    .get('/users/change-user-type')
                    .set('x-access-token', token)
                    .send({type : 1, user_id : user_id})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should send a validation error given invalid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                chai.request(app)
                    .get('/users/change-user-type')
                    .set('x-access-token', token)
                    .send({type : 1, user_id : 'user_id'})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(400);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('"type" must be 0 or 1 and "user_id" must be an integer');
                        res.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error given non-admin token', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                chai.request(app)
                    .get('/users/change-user-type')
                    .set('x-access-token', token)
                    .send({type : 1, user_id : user_id})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(400);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('auth error');
                        res.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error given no token', (done) =>{
            chai.request(app)
            .get('/users/change-user-type')
            .set('x-access-token', token)
            .send({type : 1, user_id : user_id})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('auth error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });
});