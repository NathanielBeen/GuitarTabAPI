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

describe('tag routes', () =>{
    describe('GET /', (done) =>{
        it('should get all tags given valid input', (done) =>{
            chai.request(app)
            .get('/tags/')
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(200);
                result.body.result.should.be.a('array');
                result.body.result.should.have.lengthOf(4);
                result.body.result[0].Name.should.equal('tag');
                result.body.result[1].Name.should.equal('tag2');
                result.body.result[2].Name.should.equal('tag3');
                result.body.result[3].Name.should.equal('tag4');
                done();
            });
        });
    });

    describe('POST /', () =>{
        it('should post a tag given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .post('/tags/')
                .set('x-access-token', token)
                .send({name : 'new_tag', type : 'new_type'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(201);
                    done();
                });
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .post('/tags/')
                .set('x-access-token', token)
                .send({name : 'new_tag'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(400);
                    result.body.should.have.property('error');
                    result.body.error.message.should.equal('"name" and "type" must be defined');
                    result.body.error.error_type.should.equal(VALIDATION);
                    done();
                });
            });
        });

        it('should send a database error given a name that already exists', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .post('/tags/')
                .set('x-access-token', token)
                .send({name : 'tag', type : 'new_type'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(500);
                    result.body.should.have.property('error');
                    result.body.error.error_type.should.equal(DATABASE);
                    done();
                });
            });
        });

        it('should send an auth error given a name that already exists', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .post('/tags/')
                .send({name : 'new_tag', type : 'new_type'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(401);
                    result.body.should.have.property('error');
                    result.body.error.error_type.should.equal(AUTHENTICATION);
                    done();
                });
            });
        });
    });

    describe('GET /id', ()=>{
        it('should get a tag given valid input', (done) =>{
            chai.request(app)
            .get('/tags/'+tag_id)
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(200);
                result.body.result.should.be.a('array');
                result.body.result.should.have.lengthOf(1);
                result.body.result[0].Name.should.equal('tag');
                done();
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            chai.request(app)
            .get('/tags/tag_id')
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(400);
                result.body.should.have.property('error');
                result.body.error.message.should.equal('"tag_id" must be an integer');
                result.body.error.error_type.should.equal(VALIDATION);
                done();
            });
        });

        it('should return no results given an invalid id', (done) =>{
            chai.request(app)
            .get('/tags/'+(tag_id + 4))
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(200);
                result.body.result.should.be.a('array');
                result.body.result.should.have.lengthOf(0);
                done();
            });
        });
    });

    describe('PATCH /id', () =>{
        it('should update a token given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .patch('/tags/'+tag_id)
                .set('x-access-token', token)
                .send({name : 'new_tag', type : 'new_type'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(200);
                    done();
                });
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .patch('/tags/'+tag_id)
                .set('x-access-token', token)
                .send({type : 'new_type'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(400);
                    result.body.should.have.property('error');
                    result.body.error.message.should.equal('"tag_id", "name", and "type" must be defined');
                    result.body.error.error_type.should.equal(VALIDATION);
                    done();
                });
            });
        });

        it('should send a db error when updating the name to one that already exists', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .patch('/tags/'+(tag_id + 1))
                .set('x-access-token', token)
                .send({name : 'tag', type : 'new_type'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(500);
                    result.body.should.have.property('error');
                    result.body.error.error_type.should.equal(DATABASE);
                    done();
                });
            });
        });

        it('should send an auth error given non-admin token', (done) =>{
            db.getValidToken((token) =>{
                chai.request(app)
                .patch('/tags/'+tag_id)
                .set('x-access-token', token)
                .send({name : 'new_tag', type : 'new_type'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(401);
                    result.body.should.have.property('error');
                    result.body.error.error_type.should.equal(AUTHENTICATION);
                    done();
                });
            });
        });
    });

    describe('DELETE /id', ()=>{
        it('should delete a tag given correct input', (done)=>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .delete('/tags/'+tag_id)
                .set('x-access-token', token)
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(200);
                    done();
                });
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .delete('/tags/tag_id')
                .set('x-access-token', token)
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(400);
                    result.body.should.have.property('error');
                    result.body.error.message.should.equal('"tag_id" must be an integer');
                    result.body.error.error_type.should.equal(VALIDATION);
                    done();
                });
            });
        });

        it('should send an auth error given no token', (done) =>{
            chai.request(app)
            .delete('/tags/'+tag_id)
            .set('x-access-token', token)
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(401);
                result.body.should.have.property('error');
                result.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });

    describe('DELETE /multi-id', () =>{
        it('should delete a tag given correct input', (done)=>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .delete('/tags/multi-id/')
                .set('x-access-token', token)
                .send({tag_ids : [tag_id, tag_id + 1]})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(200);
                    done();
                });
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .delete('/tags/multi-id/')
                .set('x-access-token', token)
                .send({})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(400);
                    result.body.should.have.property('error');
                    result.body.error.message.should.equal('"tag_ids" must be defined');
                    result.body.error.error_type.should.equal(VALIDATION);
                    done();
                });
            });
        });

        it('should send an auth error given non-admin token', (done) =>{
            db.getValidToken((token) =>{
                chai.request(app)
                .delete('/tags/multi-id/')
                .set('x-access-token', token)
                .send({tag_ids : [tag_id]})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(401);
                    result.body.should.have.property('error');
                    result.body.error.error_type.should.equal(AUTHENTICATION);
                    done();
                });
            });
        });
    });

    describe('PATCH /multi-id', () =>{
        it('should update a token given valid input', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .patch('/tags/multi-id/')
                .set('x-access-token', token)
                .send({tag_ids : [tag_id, 'tag', tag_id + 2], type : 'new_type'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(200);
                    done();
                });
            });
        });

        it('should send a validation error given malformed input', (done) =>{
            db.getValidAdminToken((token) =>{
                chai.request(app)
                .patch('/tags/multi-id/')
                .set('x-access-token', token)
                .send({tag_ids : [], type : 'new_type'})
                .end((err, result) =>{
                    should.not.exist(err);
                    result.should.have.status(400);
                    result.body.should.have.property('error');
                    result.body.error.message.should.equal('"tag_ids" must be a non-empty array');
                    result.body.error.error_type.should.equal(VALIDATION);
                    done();
                });
            });
        });

        it('should send an auth error given non-valid token', (done) =>{
            chai.request(app)
            .patch('/tags/multi-id/')
            .set('x-access-token', token)
            .send({tag_id : tag_id, name : 'new_tag', type : 'new_type'})
            .end((err, result) =>{
                should.not.exist(err);
                result.should.have.status(401);
                result.body.should.have.property('error');
                result.body.error.error_type.should.equal(AUTHENTICATION);
                done();
            });
        });
    });
});