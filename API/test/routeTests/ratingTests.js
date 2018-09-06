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

describe('ratingRoute', ()=>{
    var song_id , tag_id, song_tag_id, user_id, rating_id;
    beforeEach((done) =>{
        common.resetAllTables((err) =>{
            if(err) done(err);
            else{
                db.insertTestInfo((si, ti, sti, ui, ri) =>{
                    song_id = si;
                    tag_id = ti;
                    song_tag_id = sti;
                    user_id = ui;
                    rating_id = ri;
                    done();
                });
            }
        });
    });
    
    describe('/ POST', () =>{
        it('should post a rating given correct input', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .post('/ratings/')
                    .set('x-access-token', token)
                    .send({song_id : song_id + 1, rating : 2, text : 'text'})
                    .end((err, result) =>{
                        should.not.exist(err);
                        console.log(result)
                        result.should.have.status(201);
                        result.id.should.equal(rating_id + 1);
                        done();
                    });
                }
            });
        });

        it('should send a validation error when given malformed input', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .post('/ratings/')
                    .set('x-access-token', token)
                    .send({song_id : song_id + 1, rating : 6, text : 'text'})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(400);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('"rating" must be between 0 and 5, "song_id" and "user_id" must be integers');
                        res.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should send a db error when given song/user pair that already exists', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .post('/ratings/')
                    .set('x-access-token', token)
                    .send({song_id : song_id, rating : 4, text : 'text'})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(500);
                        res.body.should.have.property('error');
                        res.body.error.error_type.should.equal(DATABASE);
                        done();
                    });
                }
            });
        });

        it('should send an auth error when not given a token', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .post('/ratings/')
                    .send({song_id : song_id, rating : 4, text : 'text'})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(401);
                        res.body.should.have.property('error');
                        res.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });
    });

    describe('GET /id', () =>{
        it('should get a rating given valid input', (done) =>{
            chai.request(app)
            .get('/ratings/'+rating_id)
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('result');
                res.body.result.should.be.a('array');
                res.body.result.should.have.lengthOf(1);
                res.body.result[0].should.have.property('Id');
                res.body.result[0].Id.should.equal(rating_id);
                res.body.result[0].should.have.property('Rating');
                res.body.result[0].Rating.should.equal(4);
                done();
            });
        });

        it('should get an empty result given wrong id', (done) =>{
            chai.request(app)
            .get('/ratings/'+(rating_id + 4))
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('result');
                res.body.result.should.be.an('array');
                res.body.result.should.have.lengthOf(0);
                done();
            });
        });

        it('should give a validation error given malformed input', (done) =>{
            chai.request(app)
            .get('/ratings/id')
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('"rating_id" must be an integer');
                res.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });
    });

    describe('PATCH /id', () =>{
        it('should update the rating given proper input', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/ratings/'+rating_id)
                    .set('x-access-token', token)
                    .send({rating : 1, text : 'new_text'})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should give a validation error given malformed input', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/ratings/rating_id')
                    .set('x-access-token', token)
                    .send({rating : 1, text : 'new_text'})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(400);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('"rating_id" and "user_id" must be integers');
                        res.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should give an auth error when user is not author', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/ratings/'+(rating_id+3))
                    .set('x-access-token', token)
                    .send({rating : 1, text : 'new_text'})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(401);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('user is not author');
                        res.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should give an auth error when no token present', (done) =>{
            chai.request(app)
            .patch('/ratings/'+(rating_id + 3))
            .send({rating : 1, text : 'new_text'})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('DELETE /id', ()=>{
        it('should remove a rating given valid input', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/ratings/'+rating_id)
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(200);
                        done();
                    });
                }
            });
        });

        
        it('should give a validation error given malformed input', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/ratings/'+'rating')
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(400);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('"rating_id" and "user_id" must be defined');
                        res.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should give auth error when user is not author', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/ratings/'+(rating_id + 3))
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(401);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('user is not author');
                        res.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should give an auth error when no token present', (done) =>{
            chai.request(app)
            .delete('/ratings/'+ (rating_id + 3))
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('DELETE /admin/id', () =>{
        it('should remove a rating given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/ratings/admin/'+rating_id)
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should give a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/ratings/admin/id')
                    .set('x-access-token', token)
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(400);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('"rating_id" must be an integer');
                        res.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should give auth error when user is not an admin', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/ratings/admin/'+rating_id)
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

        it('should give an auth error when no token present', (done) =>{
            chai.request(app)
            .delete('/ratings/'+(rating_id + 3))
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('DELETE /admin/multi-id', () =>{
        it('should remove ratings given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/ratings/admin/multi-id')
                    .set('x-access-token', token)
                    .send({rating_ids : [rating_id + 1, rating_id + 2]})
                    .end((err, res) =>{
                        console.log(res);
                        should.not.exist(err);
                        res.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should give a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/ratings/admin/multi-id')
                    .set('x-access-token', token)
                    .send({rating_ids : []})
                    .end((err, res) =>{
                        should.not.exist(err);
                        res.should.have.status(400);
                        res.body.should.have.property('error');
                        res.body.error.message.should.equal('"rating_ids" must be a non-empty array');
                        res.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should give auth error when user is not an admin', (done) =>{
            db.getValidToken((token) =>{
                if (!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/ratings/admin/multi-id')
                    .set('x-access-token', token)
                    .send({rating_id : rating_id})
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

        it('should give an auth error when no token present', (done) =>{
            chai.request(app)
            .delete('/ratings/multi-id')
            .send({rating_id : rating_id + 3})
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(401);
                res.body.should.have.property('error');
                res.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('GET /song-ratings', () =>{
        it('should get song ratings given valid input', (done) =>{
            chai.request(app)
            .get('/ratings/song-ratings/'+song_id)
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('result');
                res.body.result.should.be.a('array');
                res.body.result.should.have.lengthOf(2);
                res.body.result[0].Id.should.equal(rating_id + 1);
                res.body.result[1].Id.should.equal(rating_id);
                done();
            });
        });

        it('should get an empty result given wrong id', (done) =>{
            chai.request(app)
            .get('/ratings/song-ratings/'+(song_id + 2))
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('result');
                res.body.result.should.be.an('array');
                res.body.result.should.have.lengthOf(0);
                done();
            });
        });

        it('should give a validation error given malformed input', (done) =>{
            chai.request(app)
            .get('/ratings/song-ratings/song_id')
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('"song_id" must be an integer');
                res.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });
    });

    describe('GET /user-ratings', () =>{
        it('should get user ratings given valid input', (done) =>{
            chai.request(app)
            .get('/ratings/user-ratings/'+(user_id + 2))
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('result');
                res.body.result.should.be.a('array');
                res.body.result.should.have.lengthOf(2);
                res.body.result[0].Id.should.equal(rating_id + 1);
                res.body.result[1].Id.should.equal(rating_id + 3);
                done();
            });
        });

        it('should get an empty result given wrong id', (done) =>{
            chai.request(app)
            .get('/ratings/user-ratings/'+(user_id + 2))
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.have.property('result');
                res.body.result.should.be.an('array');
                res.body.result.should.have.lengthOf(0);
                done();
            });
        });

        it('should give a validation error given malformed input', (done) =>{
            chai.request(app)
            .get('/ratings/user-ratings/')
            .end((err, res) =>{
                should.not.exist(err);
                res.should.have.status(400);
                res.body.should.have.property('error');
                res.body.error.message.should.equal('"user_id" must be defined');
                res.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });
    });
});