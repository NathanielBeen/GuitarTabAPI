const common = require('../common');
const rv = require('../../validators/ratingValidator');
const sv = require('../../validators/songValidator');

const chai = common.chai;
const should = common.should;
const expect = common.expect;
const models = common.models;

describe('get all ratings', () =>{
    it ('should return valid result for filled db', (done) =>{
        insertRatingSet(done, (rating_id) =>{
            rv.validateGetAllRatings({}, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(5);
                expect(result[0].SongId).to.equal(0);
                expect(result[2].UserId).to.equal(0);
                expect(result[3].Rating).to.equal(4);
                done();
            });
        });
    });

    it('should return no results from an empty db', (done) =>{
        rv.validateGetAllRatings({}, (err, result) =>{
            should.not.exist(err);
            expect(result).to.have.lengthOf(0);
            done();
        });
    });
});

describe('get rating by id', () =>{
    it('should get a rating given valid input', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({rating_id : rating_id + 2});
            rv.validateGetRating(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Rating).to.equal(5);
                expect(result[0].SongId).to.equal(song_id + 2);
                expect(result[0].Name).to.equal('name');
                done();
            });
        });
    });

    it('should not get a rating given an invalid input', (done) =>{
        insertRatingSet(done, (rating_id) =>{
            var req = common.createRequest({});
            rv.validateGetRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not get a rating given an invalid id', (done) =>{
        insertRatingSet(done, (rating_id) =>{
            var req = common.createRequest({rating_id : rating_id + 5});
            rv.validateGetRating(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should not get a rating given a string rating_id', (done) =>{
        insertRatingSet(done, (rating_id) =>{
            var req = common.createRequest({rating_id : 'rating_id'});
            rv.validateGetRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('get song ratings', () =>{
    it('should get a list of song ratings given valid input', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({song_id : song_id});
            rv.validateGetSongRating(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Rating).to.equal(3);
                done();
            });
        });
    });

    it('should not get a list of song ratings given invalid input', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({});
            rv.validateGetSongRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should get an empty list of ratings given song which has no ratings', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({song_id : song_id + 1});
            rv.validateGetSongRating(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should not get ratings when given an invalid song id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({song_id : song_id + 3});
            rv.validateGetSongRating(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should not get a list of song ratings given string song_id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({song_id : 'song_id'});
            rv.validateGetSongRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('get user ratings', () =>{
    it('should get a list of ratings given valid input', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id});
            rv.validateGetUserRating(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].SongId).to.equal(song_id);
                expect(result[1].Rating).to.equal(5);
                done();
            });
        });
    });

    it('should not get a list of ratings given invalid input', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({});
            rv.validateGetUserRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should get an empty list of results given a user with no ratings', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id + 3});
            rv.validateGetUserRating(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should get an empty list of results given an invalid user id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id + 4});
            rv.validateGetUserRating(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should get no results when given a string user id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : 'user_id'});
            rv.validateGetUserRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('create rating', () =>{
    it('should create a rating given valid inputs', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id + 1, song_id : song_id + 1, rating : 2, text : 'text'});
            rv.validateCreateRating(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({rating_id : rating_id + 5});
                rv.validateGetRating(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].Name).to.equal('name2');
                    expect(result[0].Rating).to.equal(2);
                    done();
                });
            });
        });
    });

    it('should not create a rating given incomplete inputs', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id + 1, rating : 2, text : 'text'});
            rv.validateCreateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a rating given an invalid rating', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id + 1, song_id : song_id + 1, rating : -1, text : 'text'});
            rv.validateCreateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a rating given a string rating', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id + 1, song_id : song_id + 1, rating : 'four', text : 'text'});
            rv.validateCreateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a rating given an invalid song id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id + 1, song_id : song_id + 3, rating : 2, text: 'text'});
            rv.validateCreateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a rating given an invalid user id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id + 5, song_id : song_id + 1, rating : 2, text : 'text'});
            rv.validateCreateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a rating given song user has already rated', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id, song_id : song_id, rating : 2, text : 'text'});
            rv.validateCreateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a rating given a string user_id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : 'user_id', song_id : song_id, rating : 2, text : 'text'});
            rv.validateCreateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove rating', () =>{
    it('should remove a rating and update song rating given valid id', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({rating_id : rating_id + 2});
            rv.validateRemoveRating(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(4);
                    expect(result[2].Rating).to.equal(4);
                    
                    var req = common.createRequest({song_id : song_id + 2});
                    sv.validateGetSongById(req, (err, result) =>{
                        should.not.exist(err);
                        expect(result).to.have.lengthOf(1);
                        expect(result[0].Name).to.equal('name3');
                        expect(result[0].Rating).to.equal(3.5);
                        done();
                    });
                });
            });
        });
    });

    it('should not remove a rating given invalid input', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({});
            rv.validateRemoveRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove a rating given invalid id', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({rating_id : rating_id + 6});
            rv.validateRemoveRating(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(5);
                    done();
                });
            });
        });
    });

    it('should not remove a rating given a string input', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({rating_id : 'rating_id'});
            rv.validateRemoveRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove multiple ratings', (done) =>{
    it('should remove multiple ratings and update songs given valid ids', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({rating_ids : [rating_id, rating_id + 2]});
            rv.validateRemoveMultipleRatings(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(3);
                    expect(result[0].Rating).to.equal(3);
                    expect(result[1].Rating).to.equal(4);
                    sv.validateGetAllSongs({}, (err, result) =>{
                        should.not.exist(err);
                        expect(result).to.have.lengthOf(3);
                        expect(result[0].Rating).to.equal(3);
                        expect(result[2].Rating).to.equal(3.5);
                        done();
                    });
                });
            });
        });
    });

    it('should not remove ratings given incomplete input', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({});
            rv.validateRemoveMultipleRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove ratings given non-array rating_ids', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({rating_ids : rating_id});
            rv.validateRemoveMultipleRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove ratings given empty array rating_ids', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({rating_ids : []});
            rv.validateRemoveMultipleRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove ratings given invalid id', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({rating_ids : [rating_id + 5]});
            rv.validateRemoveMultipleRatings(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(5);
                    done();
                });
            });
        });
    });

    it('should remove some ratings given some valid rating_ids', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({rating_ids : [rating_id + 2, rating_id + 5]});
            rv.validateRemoveMultipleRatings(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(4);
                    expect(result[2].Rating).to.equal(4);
                    done();
                });
            });
        });
    });
    
    it('should remove ratings and set rating to null given rating_ids that remove all song ratings', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({rating_ids : [rating_id, rating_id + 1]});
            rv.validateRemoveMultipleRatings(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(3);
                    should.not.exist(result[0].Rating);
                    done();
                });
            });
        });
    });
    
});

describe('remove song ratings', () =>{
    it('should remove song ratings given a valid input', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({song_id : song_id});
            rv.validateRemoveSongRatings(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(3);
                    expect(result[0].SongId).to.equal(song_id + 2);
                    expect(result[1].SongId).to.equal(song_id + 2);
                    expect(result[2].SongId).to.equal(song_id + 2);
                    done();
                });
            });
        });
    });

    it('should not remove song ratings given invalid input', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({});
            rv.validateRemoveSongRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove song ratings given invalid song id', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({song_id : song_id + 3});
            rv.validateRemoveSongRatings(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(5);
                    done();
                });
            });
        });
    });

    it('should not remove song ratings given a string song_id', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({song_id : 'song_id'});
            rv.validateRemoveSongRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove multiple song ratings', () =>{
    it('should remove song ratings given proper input', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 2]});
            rv.validateRemoveMultipleSongRatings(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(0);
                    done();
                });
            });
        });
    });

    it('should not remove ratings given incomplete input', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({});
            rv.validateRemoveMultipleSongRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove ratings given non-array song_ids', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({song_ids : song_id});
            rv.validateRemoveMultipleSongRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove ratings given empty array song_ids', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({song_ids : []});
            rv.validateRemoveMultipleSongRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove ratings given invalid id', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({song_ids : [song_id + 4]});
            rv.validateRemoveMultipleSongRatings(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(5);
                    done();
                });
            });
        });
    });

    it('should remove some ratings given some valid rating_ids', (done) =>{
        insertRatingAndSongSet(done, (rating_id, song_id) =>{
            var req = common.createRequest({song_ids : [song_id, 'song_id + 4']});
            rv.validateRemoveMultipleSongRatings(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(3);
                    expect(result[0].Rating).to.equal(5);
                    expect(result[1].Rating).to.equal(4);
                    expect(result[2].Rating).to.equal(3);
                    done();
                });
            });
        });
    });
});

describe('remove user ratings', () =>{
    it('should remove all user ratings given a valid input and update the song ratings', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id});
            rv.validateRemoveUserRatings(req, (err, result) =>{
                should.not.exist(err);
                rv.validateGetAllRatings({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(3);
                    expect(result[0].UserId).to.equal(user_id + 1);
                    expect(result[1].UserId).to.equal(user_id + 1);
                    expect(result[2].UserId).to.equal(user_id + 2);
                    sv.validateGetAllSongs({}, (err, result) =>{
                        should.not.exist(err);
                        expect(result).to.have.lengthOf(3);
                        expect(result[0].Rating).to.equal(3);
                        expect(result[1].Rating).to.equal(5);
                        expect(result[2].Rating).to.equal(3.5);
                        done();
                    });
                });
            });
        });
    });

    it('should not remove user ratings given an incomplete input', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({});
            rv.validateRemoveUserRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should remove no ratings given an invalid user id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : user_id + 3});
            rv.validateRemoveUserRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove user ratings given a string user_id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({user_id : 'user_id'});
            rv.validateRemoveUserRatings(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('update rating', () =>{
    it('should update the rating given a valid input and update song rating', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({rating : 2, text : 'new text', rating_id : rating_id + 2});
            rv.validateUpdateRating(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({rating_id : rating_id + 2});
                rv.validateGetRating(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].SongId).to.equal(song_id + 2);
                    expect(result[0].UserId).to.equal(user_id + 0);
                    expect(result[0].Rating).to.equal(2);
                    expect(result[0].Text).to.equal('new text');
                    sv.validateGetAllSongs({}, (err, result) =>{
                        should.not.exist(err);
                        expect(result).to.have.lengthOf(3);
                        expect(result[2].Rating).to.equal(3);
                        done();
                    });
                });
            });
        });
    });

    it('should not update the rating given an incomplete rating', (done) =>{
        insertRatingSet(done, (rating_id) =>{
            var req = common.createRequest({rating : 4, rating_id : rating_id + 2});
            rv.validateUpdateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update the rating given a rating outside of the normal range', (done) =>{
        insertRatingSet(done, (rating_id) =>{
            var req = common.createRequest({rating : 6, text : 'new text', rating_id : rating_id + 2});
            rv.validateUpdateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update the rating given a string rating', (done) =>{
        insertRatingSet(done, (rating_id) =>{
            var req = common.createRequest({rating : 'six', text : 'new text', rating_id : rating_id + 2});
            rv.validateUpdateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update the rating given a string rating_id', (done) =>{
        insertRatingSet(done, (rating_id) =>{
            var req = common.createRequest({rating : 4, text : 'new text', rating_id : 'rating_id'});
            rv.validateUpdateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update the rating given an invalid rating id', (done) =>{
        insertRatingSet(done, (rating_id) =>{
            var req = common.createRequest({rating : 4, text : 'new text', rating_id : rating_id + 6});
            rv.validateUpdateRating(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('user is author', () =>{
    it('should validate given a valid input', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({rating_id : rating_id + 2, user_id : user_id});
            rv.validateUserIsAuthor(req, (err) =>{
                should.not.exist(err);
                done();
            });
        });
    });

    it('should not validate an incomplete input', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({rating_id : rating_id + 2});
            rv.validateUserIsAuthor(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not validate the wrong user for a rating', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({rating_id : rating_id + 2, user_id : user_id + 1});
            rv.validateUserIsAuthor(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not validate an invalid rating id', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({rating_id : rating_id + 5, user_id : user_id});
            rv.validateUserIsAuthor(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not validate string inputs', (done) =>{
        insertRatingSongAndUserSet(done, (rating_id, song_id, user_id) =>{
            var req = common.createRequest({rating_id : 'rating_id', user_id : 'user_id'});
            rv.validateUserIsAuthor(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });
});


function insertRatingSet(done, next){
    var insert = new models.Inserter([], [], [], [], 
    [[0, 0, 3, 'text'], [0, 1, 3, 'text'], [2, 0, 5, 'text'],
    [2, 1, 4, 'text'], [2, 2, 3, 'text']]);
    insert.executeInsert((err) =>{
        if (err) done(err);
        else next(insert.getRatingId());
    });
}

function insertRatingAndSongSet(done, next){
    var insert = new models.Inserter([], [], 
    [['name', 'artist', 'album', 0, 3, 0, 'tab'],
    ['name2', 'artist2', 'album2', 0, 5, 0, 'tab'],
    ['name3', 'artist', 'album2', 1, 4, 0, 'tab']], [], 
    [[0, 0, 3, 'text'], [0, 1, 3, 'text'], [2, 0, 5, 'text'],
    [2, 1, 4, 'text'], [2, 2, 3, 'text']]);
    insert.executeInsert((err) =>{
        if (err) done(err);
        else next(insert.getRatingId(), insert.getSongId());
    });
}

function insertRatingSongAndUserSet(done, next){
    var insert = new models.Inserter([['name', 'password', 0], 
        ['name2', 'password', 1], ['name3', 'password', 0], ['name4', 'password', 0]], [], 
        [['name', 'artist', 'album', 0, 3, 0, 'tab'],
        ['name2', 'artist2', 'album2', 0, 5, 0, 'tab'],
        ['name3', 'artist', 'album2', 1, 4, 0, 'tab']], [], 
        [[0, 0, 3, 'text'], [0, 1, 3, 'text'], [2, 0, 5, 'text'],
        [2, 1, 4, 'text'], [2, 2, 3, 'text']]);
        insert.executeInsert((err) =>{
            if (err) done(err);
            else next(insert.getRatingId(), insert.getSongId(), insert.getUserId());
        });
}
