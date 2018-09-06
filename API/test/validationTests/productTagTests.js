const common = require('../common');
const ptv = require('../../validators/productTagValidator');

const chai = common.chai;
const should = common.should;
const expect = common.expect;
const models = common.models;

var tag_id, song_id, song_tag_id;

describe('get all song tags', () =>{
    it('should get all song tags from a filled database', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            ptv.validateGetAllSongTags({}, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(6);
                expect(result[0].SongId).to.equal(song_id);
                expect(result[2].TagId).to.equal(tag_id + 1);
                expect(result[4].SongId).to.equal(song_id + 1);
                expect(result[5].TagId).to.equal(tag_id + 4);
                done();
            });
        });
    });

    it('should return an empty set from an empty db', (done) =>{
        ptv.validateGetAllSongTags({}, (err, result) =>{
            should.not.exist(err);
            expect(result).to.have.lengthOf(0);
            done();
        });
    });
});

describe('get song tags by song id', () =>{
    beforeEach((done) =>{
        insertTagsSongsAndSongTags(done, (t, s, st) => {
            tag_id = t;
            song_id = s;
            song_tag_id = st;
            done();
        });
    });

    it('should get a list of tags with valid input', (done) =>{
        var req = common.createRequest({song_id : song_id + 1});
        ptv.validateGetSongTags(req, (err, result) =>{
            should.not.exist(err);
            var names = getTagNamesFromResult(result);
            expect(names).to.have.members(['tag2', 'tag3', 'tag5']);
            done();
        });
    });

    it('should not get a list of tags given incomplete input', (done) =>{
        var req = common.createRequest({});
        ptv.validateGetSongTags(req, (err, result) =>{
            should.exist(err);
            done();
        });
    });

    it('should get an empty list of tags given an invalid id', (done) =>{
        var req = common.createRequest({song_id : song_id + 4});
        ptv.validateGetSongTags(req, (err, result) =>{
            should.not.exist(err);
            expect(result).to.have.lengthOf(0);
            done();
        });
    });

    it('should not get a list of tags given string song_id', (done) =>{
        var req = common.createRequest({song_id : 'song_id'});
        ptv.validateGetSongTags(req, (err, result) =>{
            should.exist(err);
            done();
        });
    });
});

describe('create song tag', () =>{
    it('should create a songtag given valid input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 2, tags : ['tag2']});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 2});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag2', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should create a set of songtags given multiple valid inputs', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 2, tags : ['tag2', 'tag', 'tag3']});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 2});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not create a songtag given incomplete input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 2});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a songtag given an invalid song id', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 4, tags : ['tag2']});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a songtag given an invalid tag name', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 2, tags : ['tag0']});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a songtag given a song/tag pair that already exists', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 2, tags : ['tag5']});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a songtag set given some valid, some invalid tag names', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 2, tags : ['tag', 'tag2', 'tag7']});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create tag set when any song/tag parings exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 2, tags : ['tag5', 'tag', 'tag2', 'tag3']});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should create no tags given an empty array of tags', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 2, tags : []});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should create no tags given a non-array tags input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 2, tags : 'tag2'});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should create no tags given a string song_id', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : 'song_id', tags : ['tag2']});
            ptv.validateCreateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove song tags by song id', () =>{
    it('should remove songtags given valid input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1});
            ptv.validateRemoveSongTags(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove songtags given incomplete input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({});
            ptv.validateRemoveSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove songtags given an invalid song_id', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 4});
            ptv.validateRemoveSongTags(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag5', 'tag2', 'tag3', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove songtags given a song with no tags', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 3});
            ptv.validateRemoveSongTags(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag5', 'tag2', 'tag3', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove songtags given a string song id', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : 'song_id'});
            ptv.validateRemoveSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove song tags by multiple song ids', () =>{
    it('should remove songtags given correct input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 2]});
            ptv.validateRemoveMultipleSongTags(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(3);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag2', 'tag3', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove songtags when given incomplete input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({});
            ptv.validateRemoveMultipleSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
    
    it('should not remove songtags when given non-array song_ids', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : song_id});
            ptv.validateRemoveMultipleSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove songtags when given empty array song_ids', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : []});
            ptv.validateRemoveMultipleSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove songtags when given a song that doesnt exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : ['song']});
            ptv.validateRemoveMultipleSongTags(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(6);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove songtags when given a valid song that doesnt have any song tags', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id + 3]});
            ptv.validateRemoveMultipleSongTags(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(6);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should remove only correct songtags when some songs exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id + 1, 'song']});
            ptv.validateRemoveMultipleSongTags(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(3);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });
});

describe('remove song tags by tag id', () =>{
    it('should remove all songtags of a given tag type given proper input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_id : tag_id + 4});
            ptv.validateRemoveTagType(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3']);
                    done();
                });
            });
        });
    });

    it('should not remove songtags given an incomplete input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({});
            ptv.validateRemoveTagType(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove songtags given an invalid tag id', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_id : tag_id + 6});
            ptv.validateRemoveTagType(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(6);
                    done();
                });
            });
        });
    });

    it('should not remove songtags given a tag with no songtags', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_id : tag_id + 5});
            ptv.validateRemoveTagType(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove songtags given a string tag_id', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_id : 'tag_id'});
            ptv.validateRemoveTagType(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove songtags by multiple tag ids', () =>{
    it('should remove songtags given correct input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : [tag_id, tag_id + 4]});
            ptv.validateRemoveMultipleTagType(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(2);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag2', 'tag3']);
                    done();
                });
            });
        });
    });

    it('should not remove songtags when given incomplete input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({});
            ptv.validateRemoveMultipleTagType(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
    
    it('should not remove songtags when given non-array tag_ids', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : tag_id});
            ptv.validateRemoveMultipleTagType(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove songtags when given empty array tag_ids', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : []});
            ptv.validateRemoveMultipleTagType(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove songtags when given a tag that doesnt exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : ['tag']});
            ptv.validateRemoveMultipleTagType(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(6);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove songtags when given a valid tag that doesnt have any song tags', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : [tag_id + 5]});
            ptv.validateRemoveMultipleTagType(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(6);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should remove only correct songtags when some tags exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tag_ids : [tag_id + 1, 'tag']});
            ptv.validateRemoveMultipleTagType(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(5);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag3', 'tag5', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });
});

describe('remove select songtags', () =>{
    it('should remove a songtag given valid inputs', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : ['tag2']});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 1});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(2);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag3', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove a songtag given incomplete input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({tags : ['tag2']});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove a songtag when tags is not an array', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : 'tag2'});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove a songtag when the song doesnt exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 4, tags : ['tag2']});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove a songtag when the tag doesnt exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : ['tag7']});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 1});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(3);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag2', 'tag3', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove a songtag when tags is an empty array', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : []});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
    
    it('should not remove a songtag when the song doesnt have the tag', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : ['tag']});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 1});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag2', 'tag3', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should remove multiple songtags when multiple tags given correctly', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : ['tag2', 'tag5']});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 1});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag3']);
                    done();
                });
            });
        });
    });

    it('should remove some songtags when some valid and some invalid tags given', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : ['tag2', 'tag7']});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 1});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag3', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should remove some songtags when the song only has some of the tags', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : ['tag', 'tag2', 'tag5']});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 1});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].Name).to.equal('tag3');
                    done();
                });
            });
        });
    });

    it('should not remove a songtag when tag_id is a string', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : 'song_id', tags : ['tag2']});
            ptv.validateRemoveSelectSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove tag from multiple songs', () =>{
    it('should remove tag when given correct inputs', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1], tag : 'tag5'});
            ptv.validateRemoveTagsFromMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(4);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5']);
                    result[3].SongId.should.equal(song_id + 2);
                    result[3].TagId.should.equal(tag_id + 4);
                    done();
                });
            });
        });
    });
    
    it('should not remove tag when given incomplete input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1]});
            ptv.validateRemoveTagsFromMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove tag when given non-array song_ids', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : song_id, tag : 'tag5'});
            ptv.validateRemoveTagsFromMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove tag when given empty array song_ids', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [], tag : 'tag5'});
            ptv.validateRemoveTagsFromMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should only remove tag from ids that exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id+ 4], tag : 'tag5'});
            ptv.validateRemoveTagsFromMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(5);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not remove tag when given tag name that doesnt exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id], tag : 'tag7'});
            ptv.validateRemoveTagsFromMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should remove no song tags when given songs that dont have the requested tag', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 2], tag : 'tag3'});
            ptv.validateRemoveTagsFromMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(6);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });
    
});


describe('add tag to multiple songs', () =>{
    it('should add tag when given correct inputs', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1], tag : 'tag3'});
            ptv.validateAddTagToMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(7);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag3', 'tag5', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not add tag when given incomplete input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1]});
            ptv.validateAddTagToMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not add tag when given non-array song_ids', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : song_id, tag : 'tag5'});
            ptv.validateAddTagToMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not add tag when given empty array song_ids', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [], tag : 'tag5'});
            ptv.validateAddTagToMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should add tags to all ids regardless of existence', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id+ 4], tag : 'tag4'});
            ptv.validateAddTagToMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    console.log(result);
                    should.not.exist(err);
                    result.should.have.lengthOf(8);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag4', 'tag5', 'tag5', 'tag5', 'tag4']);
                    done();
                });
            });
        });
    });

    it('should not add tag when given tag name that doesnt exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id], tag : 'tag7'});
            ptv.validateAddTagToMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should add no song tags when given songs that already have the requested tag', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1, song_id + 2], tag : 'tag5'});
            ptv.validateAddTagToMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                ptv.validateGetAllSongTags({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(6);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag', 'tag2', 'tag3', 'tag5', 'tag5', 'tag5']);
                    done();
                });
            });
        });
    });
});

describe('update song tags', () =>{
    it('should update song tags when given proper input', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : ['tag2', 'tag4']});
            ptv.validateUpdateSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 1});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(2);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag2', 'tag4']);
                    done();
                });
            });
        });
    });

    it('should update song tags when no new tags given', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : []});
            ptv.validateUpdateSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 1});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(0);
                    done();
                });
            });
        });
    });

    it('should update song tags when only new tags given', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : ['tag2', 'tag3', 'tag4', 'tag5']});
            ptv.validateUpdateSongTags(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 1});
                ptv.validateGetSongTags(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(4);
                    var names = getTagNamesFromResult(result);
                    expect(names).to.have.members(['tag2', 'tag3', 'tag4', 'tag5']);
                    done();
                });
            });
        });
    });

    it('should not update song tags when tags is not an array', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : 'tag2'});
            ptv.validateUpdateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update song tags when tags is not an array', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : 'tag2'});
            ptv.validateUpdateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update song tags when id is a string', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : 'song_id', tags : ['tag2']});
            ptv.validateUpdateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update song tags when some tags do not exist', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 1, tags : ['tag2', 'tag7']});
            ptv.validateUpdateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update song tags given an invalid song id', (done) =>{
        insertTagsSongsAndSongTags(done, (tag_id, song_id, song_tag_id) =>{
            var req = common.createRequest({song_id : song_id + 4, tags : ['tag2']});
            ptv.validateUpdateSongTags(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});


function insertTagsSongsAndSongTags(done, next){
    var insert = new models.Inserter([], 
        [['tag', 0], ['tag2', 0], ['tag3', 1], ['tag4', 3], ['tag5', 0], ['tag6', 2]], 
        [['name', 'artist', 'album', 0, 3, 0, 'tab'],
        ['name2', 'artist2', 'album2', 0, 5, 0, 'tab'],
        ['name3', 'artist', 'album2', 1, 4, 0, 'tab'],
        ['name4', 'artist3', 'album2', 2, 4, 0, 'tab']], 
        [[0, 0], [0, 4], [1,1], [1,2], [1,4], [2,4]], []);
    insert.executeInsert((err) =>{
        if (err) done(err);
        else next(insert.getTagId(), insert.getSongId(), insert.getSongTagId());
    });
}

function getTagNamesFromResult(result){
    var result_names = [];
    result.forEach(tag => {
        result_names.push(tag.Name);
    });
    return result_names;
}

