const common = require('../common');
const tv = require('../../validators/tagValidator');
const ptv = require('../../validators/productTagValidator');

const chai = common.chai;
const should = common.should;
const expect = common.expect;
const models = common.models;


describe('get All tags', () =>{
    it('should return no results for empty db', (done) =>{
        tv.validateGetAllTags({}, (err, result) =>{
            should.not.exist(err);
            expect(result).to.have.lengthOf(0);
            done();
        });
    });

    it('should return correct results for filled db', (done) =>{
        insertTagSet(done, (tag_id) =>{
            tv.validateGetAllTags({}, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(3);
                expect(result[0]).to.have.property('Id');
                expect(result[0].Id).to.equal(tag_id);
                expect(result[1]).to.have.property('Name');
                expect(result[1].Name).to.equal('tag2');
                expect(result[2]).to.have.property('Type');
                expect(result[2].Type).to.equal('type2');
                done();
            });
        });
    });
});

describe('get tag', () =>{
    it('should return a tag given proper id', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({tag_id : tag_id + 1})
            tv.validateGetTag(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0]).to.have.property('Name');
                expect(result[0].Name).to.equal('tag2');
                done();
            });
        });
    });

    it('should not return a tag when given no id', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({})
            tv.validateGetTag(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not return a tag when given incorrect id', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({tag_id : tag_id - 1})
            tv.validateGetTag(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should not return a tag when tag_id is a string', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({tag_id : 'tag_id - 1'})
            tv.validateGetTag(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});


describe('create tag', () =>{
    it('should create a tag when given correct inputs', (done) =>{
        var req = common.createRequest({name : 'created_tag', type: 'type1'});
        tv.validateCreateTag(req, (err, result) =>{
            should.not.exist(err);
            tv.validateGetAllTags({}, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Name).to.equal('created_tag');
                done();
            });
        });
    });

    it('should not create a tag when not all inputs given', (done) =>{
        var req = common.createRequest({type: 'type1'});
        tv.validateCreateTag(req, (err, result) =>{
            should.exist(err);
            done();
        });
    });

    it('should not create a tag with duplicate name', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({name: 'tag', type: 'type3'});
            tv.validateCreateTag(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove tag', () =>{
    it('should remove a tag and associated songtags given correct input', (done) =>{
        insertTagsAndProductTagSet(done, (tag_id, song_tag_id) =>{
            var req = common.createRequest({ tag_id : tag_id + 1});
            tv.validateRemoveTag(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({ tag_id : tag_id + 1});
                tv.validateGetTag(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(0);
                    ptv.validateGetAllSongTags({}, (err, result) =>{
                        should.not.exist(err);
                        expect(result).to.have.lengthOf(1);
                        done();
                    })
                });
            });
        });
    });

    it('should not remove a tag given invalid tag id', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_id : tag_id + 3});
            tv.validateRemoveTag(req, (err, result) =>{
                should.not.exist(err);
                tv.validateGetAllTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(3);
                    done();
                });
            });
        });
    });

    it('should not remove a tag given no tag id', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({});
            tv.validateRemoveTag(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove a tag given a string tag id', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_id : 'tag_id'});
            tv.validateRemoveTag(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove multiple tags', () =>{
    it('should remove tags and associated song tags given correct input', (done) =>{
        insertTagsAndProductTagSet(done, (tag_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : [tag_id, tag_id + 2]});
            tv.validateRemoveMultipleTags(req, (err, result) =>{
                should.not.exist(err);
                tv.validateGetAllTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(1);
                    result[0].Name.should.equal('tag2');
                    ptv.validateGetAllSongTags({}, (err, result) =>{
                        should.not.exist(err);
                        result.should.have.lengthOf(2);
                        result[0].TagId.should.equal(tag_id + 1);
                        result[1].TagId.should.equal(tag_id + 1);
                        result[0].SongId.should.equal(0);
                        result[1].SongId.should.equal(1);
                        done();
                    });
                });
            });
        });
    });
    
    it('should not remove tags given incomplete input', (done) =>{
        insertTagsAndProductTagSet(done, (tag_id, song_tag_id) =>{
            var req = common.createRequest({});
            tv.validateRemoveMultipleTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove tags given non_array tag_ids', (done) =>{
        insertTagsAndProductTagSet(done, (tag_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : tag_id});
            tv.validateRemoveMultipleTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove tags given non_array tag_ids', (done) =>{
        insertTagsAndProductTagSet(done, (tag_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : tag_id});
            tv.validateRemoveMultipleTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove tags given invalid id', (done) =>{
        insertTagsAndProductTagSet(done, (tag_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : [tag_id + 4]});
            tv.validateRemoveMultipleTags(req, (err, result) =>{
                should.not.exist(err);
                tv.validateGetAllTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(3);
                    ptv.validateGetAllSongTags({}, (err, result) =>{
                        should.not.exist(err);
                        result.should.have.lengthOf(3);
                        done();
                    });
                });
            });
        });
    });

    it('should remove some tags given some valid ids', (done) =>{
        insertTagsAndProductTagSet(done, (tag_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : [tag_id + 4, tag_id + 1]});
            tv.validateRemoveMultipleTags(req, (err, result) =>{
                should.not.exist(err);
                tv.validateGetAllTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(2);
                    result[0].Name.should.equal('tag');
                    result[1].Name.should.equal('tag3');
                    ptv.validateGetAllSongTags({}, (err, result) =>{
                        should.not.exist(err);
                        result.should.have.lengthOf(1);
                        result[0].TagId.should.equal(tag_id + 2);
                        result[0].SongId.should.equal(0);
                        done();
                    });
                });
            });
        });
    });
    
});


describe('update tag', () =>{
    it('should update a tag given correct inputs', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_id : tag_id, name : 'new_name', type : 19});
            tv.validateUpdateTag(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({ tag_id : tag_id});
                tv.validateGetTag(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].Name).to.equal('new_name');
                    expect(result[0].Type).to.equal('19');
                    done();
                });
            });
        });
    });

    it('should not update a tag given invalid id', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_id : tag_id + 3, name : 'new_name', type : 19});
            tv.validateUpdateTag(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update given correct id but incorrect inputs', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_id : tag_id, type : 19});
            tv.validateUpdateTag(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update a tag given a string tag_id', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_id : 'tag_id', name : 'new_name', type : 19});
            tv.validateUpdateTag(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update a tag given a name that already exists', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_id : tag_id + 1, name : 'tag', type : 19});
            tv.validateUpdateTag(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('update mulitple tag types', () =>{
    it('should update tags given correct input', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_ids : [tag_id, tag_id + 2], type : 'new_type'});
            tv.validateUpdateMultipleTagTypes(req, (err, result) =>{
                should.not.exist(err);
                tv.validateGetAllTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(3);
                    expect(result[0].Name).to.equal('tag');
                    expect(result[0].Type).to.equal('new_type');
                    expect(result[1].Name).to.equal('tag2');
                    expect(result[1].Type).to.equal('type1');
                    expect(result[2].Name).to.equal('tag3');
                    expect(result[2].Type).to.equal('new_type');
                    done();
                });
            });
        });
    });

    it('should not update tags given non-arry tag_ids', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_ids : tag_id + 2, name : 'new_name', type : 19});
            tv.validateUpdateMultipleTagTypes(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update given empty array tag_ids', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({ tag_ids : [], type : 19});
            tv.validateUpdateMultipleTagTypes(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update a tag given no type', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({tag_ids : [tag_id]});
            tv.validateUpdateMultipleTagTypes(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update tags given an invalid id', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({tag_ids : [tag_id + 3], type : 'new_type'});
            tv.validateUpdateMultipleTagTypes(req, (err, result) =>{
                should.not.exist(err);
                tv.validateGetAllTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(3);
                    result[0].Type.should.equal('type1');
                    result[1].Type.should.equal('type1');
                    result[2].Type.should.equal('type2');
                    done();
                });
            });
        });
    });

    it('should update some tags given some valid ids', (done) =>{
        insertTagSet(done, (tag_id) =>{
            var req = common.createRequest({tag_ids : [tag_id + 3, tag_id], type : 'new_type'});
            tv.validateUpdateMultipleTagTypes(req, (err, result) =>{
                should.not.exist(err);
                tv.validateGetAllTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(3);
                    result[0].Id.should.equal(tag_id);
                    result[0].Type.should.equal('new_type');
                    result[1].Type.should.equal('type1');
                    result[2].Type.should.equal('type2');
                    done();
                });
            });
        });
    });
});


function insertTagSet(done, next){    
    var insert = new models.Inserter( [], [['tag', 'type1'], ['tag2', 'type1'], ['tag3', 'type2']], [], [], []);
    insert.executeInsert((err) =>{
        if (err) done(err);
        else next(insert.getTagId());
    });
}

function insertTagsAndProductTagSet(done, next){    
    var insert = new models.Inserter( [], [['tag', 'type1'], ['tag2', 'type1'], ['tag3', 'type2']], [], 
        [[0, 1], [0,2], [1,1]], []);
    insert.executeInsert((err) =>{
        if (err) done(err);
        else next(insert.getTagId(), insert.getSongTagId());
    });
}
