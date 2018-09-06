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

describe('song routes', () =>{
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

    describe('GET /', () =>{
        it('should get all songs given valid input', (done) =>{
            chai.request(app)
            .get('/songs/')
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(200);
                result.body.result.should.be.a('array');
                result.body.result.should.have.lengthOf(2);
                result.body.result[0].Name.should.equal('song');
                result.body.result[1].Name.should.equal('song2');
                done();
            });
        });
    });

    describe('POST /', () =>{
        it('should post a song given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .post('/songs/')
                    .send({token : token, name : 'new_song', artist : 'new_artist', album : 'new_album',
                           tab : 'tab', tags : ['tag', 'tag2']})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(201);
                        done();
                    });
                }
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .post('/songs/')
                    .send({token : token, name : 'new_song', artist : 'new_artist', album : 'new_album',
                           tab : 'tab', tags : ['tag', 'tag7']})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(400);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('not all tag names exist');
                        result.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error when token not sent', (done) =>{
            chai.request(app)
            .post('/songs/')
            .send({name : 'new_song', artist : 'new_artist', album : 'new_album',
                   tab : 'tab', tags : ['tag', 'tag2']})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(401);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('auth error');
                result.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('GET /id', () =>{
        it('should get an id given correct input', (done) =>{
            chai.request(app)
            .get('/songs/id')
            .send({song_id : song_id})
            .end((err, result) =>{
                console.log(result);
                should.not.exist(err);
                result.should.have.status(200);
                result.body.result.should.be.a('array');
                result.body.result.should.have.lengthOf(1);
                result.body.result[0].Name.should.equal('song');
                result.body.result[0].Tags.should.equal('tag,tag2,tag4');
                result.body.result[0].TagTypes.should.equal('type,type2,type2');
                done();
            });
        });

        it('should get a validation error given malformed input', (done) =>{
            chai.request(app)
            .get('/songs/id')
            .send({song_id : 'song_id'})
            .end((err, result) =>{
                console.log(result);
                should.not.exist(err);
                result.should.have.status(400);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('"song_id" must be an integer');
                result.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });

        it('should get an empty result given invalid id', (done) =>{
            chai.request(app)
            .get('/songs/id')
            .send({song_id : song_id})
            .end((err, result) =>{
                console.log(result);
                should.not.exist(err);
                result.should.have.status(200);
                result.body.result.should.be.a('array');
                result.body.result.should.have.lengthOf(0);
                done();
            });
        });
    });

    describe('PATCH /id', () =>{
        it('should update a song given valid input', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/id')
                    .send({token : token, song_id : song_id, artist : 'new_artist',
                           album : 'new_album', tab : 'tab', tags : ['tag', 'tag4']})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(201);
                        done();
                    });
                }
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/id')
                    .send({token : token, song_id : song_id, artist : 'new_artist',
                           album : 'new_album', tab : 'tab', tags : 'tag5'})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(400);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('"tags" must be an array and "id" must be an integer');
                        result.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should send a validation error when user is not author', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/id')
                    .send({token : token, song_id : song_id + 1, artist : 'new_artist',
                           album : 'new_album', tab : 'tab', tags : 'tag5'})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(401);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('user is not author');
                        result.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error when token not sent', (done) =>{
            chai.request(app)
            .patch('/songs/id')
            .send({song_id : song_id, artist : 'new_artist',
                   album : 'new_album', tab : 'tab', tags : ['tag', 'tag4']})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(401);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('auth error');
                result.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('DELETE /id', () =>{
        it('should remove a song given valid input', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/songs/id')
                    .send({token : token, song_id : song_id})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/songs/id')
                    .send({token : token })
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(400);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('"song_id" and "user_id" must be defined');
                        result.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should send a validation error when user is not author', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/songs/id')
                    .send({token : token, song_id : song_id + 1})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(401);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('user is not author');
                        result.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error when token not sent', (done) =>{
            chai.request(app)
            .delete('/songs/id')
            .send({song_id : song_id})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(401);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('auth error');
                result.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('PATCH /admin/id', () =>{
        it('should update a song given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/admin/id')
                    .send({token : token, song_id : song_id, artist : 'new_artist', album : 'new_album', tags : ['tag', 'tag3']})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/admin/id')
                    .send({token : token, song_id : song_id, artist : 'new_artist', album : 'new_album', tags : ['tag', 5]})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(400);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('not all tag names exist');
                        result.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should send a validation error when user is not an admin', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/admin/id')
                    .send({token : token, song_id : song_id, artist : 'new_artist', album : 'new_album', tags : ['tag', 'tag3']})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(401);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('auth error');
                        result.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error when token not sent', (done) =>{
            chai.request(app)
            .patch('/songs/admin/id')
            .send({song_id : song_id, artist : 'new_artist', album : 'new_album', tags : ['tag', 'tag3']})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(401);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('auth error');
                result.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('PATCH /admin/multi-id', () =>{
        it('should update songs given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/admin/multi-id')
                    .send({token : token, song_ids : [song_id, song_id + 1], album : 'new_album', tags : ['tag', 'tag3']})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should update songs given second valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/admin/multi-id')
                    .send({token : token, song_ids : [song_id + 7, song_id + 1], album : 'new_album', artist : 'new_artist'})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/admin/multi-id')
                    .send({token : token, song_ids : [song_id], artist : 'new_artist', album : 'new_album', tags : 'tag'})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(400);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('"tags" must be a non-empty array if defined');
                        result.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should send a validation error when user is not an admin', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .patch('/songs/admin/multi-id')
                    .send({token : token, song_id : song_id, artist : 'new_artist', album : 'new_album', tags : ['tag', 'tag3']})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(401);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('auth error');
                        result.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error when token not sent', (done) =>{
            chai.request(app)
            .patch('/songs/admin/multi-id')
            .send({song_id : song_id, artist : 'new_artist', album : 'new_album', tags : ['tag', 'tag3']})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(401);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('auth error');
                result.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('DELETE /admin/id', () =>{
        it('should remove a song given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/songs/admin/id')
                    .send({token : token, song_id : song_id})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/songs/admin/id')
                    .send({token : token, song_id : 'song_id'})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(400);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('"song_id" must be an integer');
                        result.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should send a validation error when user is not an admin', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/songs/admin/id')
                    .send({token : token, song_id : song_id + 1})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(401);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('auth error');
                        result.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error when token not sent', (done) =>{
            chai.request(app)
            .delete('/songs/admin/id')
            .send({song_id : song_id})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(401);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('auth error');
                result.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('DELETE /admin/multi-id', () =>{
        it('should remove songs given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/songs/admin/multi-id')
                    .send({token : token, song_ids : [song_id, song_id + 1]})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(200);
                        done();
                    });
                }
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/songs/admin/multi-id')
                    .send({token : token, song_ids : 'song_id'})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(400);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('"song_ids" must be a non-empty array');
                        result.body.error.error_type.should.equal(VALIDATION);
                        done();
                    });
                }
            });
        });

        it('should send a validation error when user is not an admin', (done) =>{
            db.getValidToken((token) =>{
                if(!token) done(new Error('didnt get token'));
                else{
                    chai.request(app)
                    .delete('/songs/admin/multi-id')
                    .send({token : token, song_ids : [song_id + 1]})
                    .end((err, result) =>{
                        should.not.exist(err);
                        result.should.have.status(401);
                        result.body.should.have.property('error');
                        result.body.error.message.should.equal('auth error');
                        result.body.error.error_type.should.equal(AUTHENTICATION);
                        done();
                    });
                }
            });
        });

        it('should send an auth error when token not sent', (done) =>{
            chai.request(app)
            .delete('/songs/admin/multi-id')
            .send({song_id : song_id})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(401);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('auth error');
                result.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('GET /search', () =>{
        it('should get search results given valid input', (done) =>{
            chai.request(app)
            .get('/songs/search')
            .send({name : 'song', album : 'album', tags : ['tag4']})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(200);
                result.body.result.should.be.a('array');
                result.body.result.should.have.lengthOf(1);
                result.body.result[0].Artist.should.equal('artist');
                result.body.result[0].TagTypes.should.equal('type,type2,type2');
                done();
            });
        });

        it('should send a validation error given inproper tags input', (done) =>{
            chai.request(app)
            .get('/songs/search')
            .send({name : 'song', album : 'album', tags : 'tag4'})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(400);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('"tags" must be defined as a non-empty array');
                result.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });

        it('should send a validation error given no input', (done) =>{
            chai.request(app)
            .get('/songs/search')
            .send({})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(400);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('"name", "artist", "album", "author", "rating", or "tags" must be defined');
                result.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });
    });
});