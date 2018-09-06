const common = require('../common');

const rv = require('../../validators/ratingValidator');
const ptv = require('../../validators/productTagValidator');
const sv = require('../../validators/songValidator');

const chai = common.chai;
const should = common.should;
const expect = common.expect;
const models = common.models;

describe('get all songs', () =>{
    it('should get a list of songs given a filled database', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            sv.validateGetAllSongs({}, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].AuthorName).to.equal('user');
                var tag_concat = checkConcatItems(result[0].Tags,'tag,tag2,tag4');
                var tag_type_concat = checkConcatItems(result[0].TagTypes,'type,type2,type2');
                expect(tag_concat).to.equal(true);
                expect(tag_type_concat).to.equal(true);

                expect(result[1].AuthorName).to.equal('user2');
                var tag_concat = checkConcatItems(result[1].Tags,'tag2,tag3');
                var tag_type_concat = checkConcatItems(result[1].TagTypes,'type2,type2');
                expect(tag_concat).to.equal(true);
                expect(tag_type_concat).to.equal(true);
                done();
            });
        });
    });

    it('should get an empty list given an empty database', (done) =>{
        sv.validateGetAllSongs({}, (err, result) =>{
            should.not.exist(err);
            expect(result).to.have.lengthOf(0);
            done();
        });
    });
});

describe('get song by id', () =>{
    it('should get a song given a correct id', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 1});
            sv.validateGetSongById(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].AuthorName).to.equal('user2');
                var tag_concat = checkConcatItems(result[0].Tags,'tag2,tag3');
                var tag_type_concat = checkConcatItems(result[0].TagTypes,'type2,type2');
                expect(tag_concat).to.equal(true);
                expect(tag_type_concat).to.equal(true);
                done();
            });
        });
    });

    it('should not get a song given incomplete input', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({});
            sv.validateGetSongById(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not get a song given an invalid song id', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 2});
            sv.validateGetSongById(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should not get a song given a string song id', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : 'song_id + 2'});
            sv.validateGetSongById(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('create song', () =>{
    it('should create a song given valid inputs', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({name : 'song3', artist : 'artist2', album : 'album3', author : user_id + 2, tab : 'tab', tags : ['tag', 'tag3']});
            sv.validateCreateSong(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id + 2 });
                sv.validateGetSongById(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].AuthorName).to.equal('name3');
                    var tag_concat = checkConcatItems(result[0].Tags,'tag,tag3');
                    var tag_type_concat = checkConcatItems(result[0].TagTypes,'type,type2');
                    expect(tag_concat).to.equal(true);
                    expect(tag_type_concat).to.equal(true);
                    done();
                });
            });
        });
    });

    it('should not create a song given incomplete inputs', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({name : 'song3', artist : 'artist2', author : user_id + 2, tab : 'tab', tags : ['tag', 'tag3']});
            sv.validateCreateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a song if tags is not an array', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({name : 'song3', artist : 'artist2', album : 'album3', author : user_id + 2, tab : 'tab', tags : 'tag'});
            sv.validateCreateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a song if some tags do not exist', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({name : 'song3', artist : 'artist2', album : 'album3', author : user_id + 2, tab : 'tab', tags : ['tag', 'tag7']});
            sv.validateCreateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a song if user is invalid', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({name : 'song3', artist : 'artist2', album : 'album3', author : user_id + 3, tab : 'tab', tags : 'tag'});
            sv.validateCreateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not create a song if user is a string', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({name : 'song3', artist : 'artist2', album : 'album3', author : 'user_id + 3', tab : 'tab', tags : 'tag'});
            sv.validateCreateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove song', () =>{
    it('should remove a song and associated ratings and songtags given correct input', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 1});
            sv.validateRemoveSong(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].Name).to.equal('song');
                    rv.validateGetAllRatings({}, (err, result) =>{
                        should.not.exist(err);
                        expect(result).to.have.lengthOf(2);
                        expect(result[0].Rating).to.equal(4);
                        expect(result[1].Rating).to.equal(2);
                        ptv.validateGetAllSongTags({}, (err, result) =>{
                            should.not.exist(err);
                            expect(result).to.have.lengthOf(3);
                            expect(result[0].TagId).to.equal(tag_id);
                            expect(result[1].TagId).to.equal(tag_id + 1);
                            expect(result[2].TagId).to.equal(tag_id + 3);
                            done();
                        });
                    });
                });
            });
        });
    });

    it('should not remove a song given incomplete input', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({});
            sv.validateRemoveSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove a song given invalid user id', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 2});
            sv.validateRemoveSong(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(2);
                    expect(result[0].Name).to.equal('song');
                    expect(result[1].Name).to.equal('song2');
                    done();
                });
            });
        });
    });

    it('should not remove a song given a string user id', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : 'song_id + 2'});
            sv.validateRemoveSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('remove multiple songs', () =>{
    it('should remove songs and related ratings and songtags when given correct input', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1]});
            sv.validateRemoveMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(0);
                    ptv.validateGetAllSongTags({}, (err, result) =>{
                        should.not.exist(err);
                        result.should.have.lengthOf(0);
                        rv.validateGetAllRatings({}, (err, result) =>{
                            should.not.exist(err);
                            result.should.have.lengthOf(0);
                            done();
                        });
                    });
                });
            });
        });
    });

    it('should not remove songs given incomplete input', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({});
            sv.validateRemoveMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove songs given non-array song_ids', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : song_id});
            sv.validateRemoveMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove songs given empty array song_ids', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : []});
            sv.validateRemoveMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not remove songs given invalid id', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : ['song']});
            sv.validateRemoveMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(2);
                    rv.validateGetAllRatings({}, (err, result) =>{
                        should.not.exist(err);
                        result.should.have.lengthOf(4);
                        ptv.validateGetAllSongTags({}, (err, result) =>{
                            should.not.exist(err);
                            result.should.have.lengthOf(5);
                            done();
                        });
                    });
                });
            });
        });
    });

    it('should remove some songs, ratings, and songtags given some correct song ids', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : ['song', song_id]});
            sv.validateRemoveMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(1);
                    expect(result[0].Name).to.equal('song2');
                    ptv.validateGetAllSongTags({}, (err, result) =>{
                        should.not.exist(err);
                        result.should.have.lengthOf(2);
                        expect(result[0].TagId).to.equal(tag_id + 1);
                        rv.validateGetAllRatings({}, (err, result) =>{
                            should.not.exist(err);
                            result.should.have.lengthOf(2);
                            expect(result[0].Rating).to.equal(5);
                            done();
                        });
                    });
                });
            });
        });
    });
});

describe('update song', () =>{
    it('should update a song given correct inputs', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id, artist : 'new_artist', album : 'new_album', tab : 'new_tab', tags : []});
            sv.validateUpdateSong(req, (err, result) =>{
                should.not.exist(err);
                var req = common.createRequest({song_id : song_id});
                sv.validateGetSongById(req, (err, result) =>{
                    should.not.exist(err);
                    expect(result).to.have.lengthOf(1);
                    expect(result[0].Artist).to.equal('new_artist');
                    expect(result[0].Album).to.equal('new_album');
                    expect(result[0].Tags).to.equal(null);
                    done();
                });
            });
        });
    });

    it('should not update a song given incomplete input', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id, artist : 'new_artist', tab : 'new_tab', tags : ['tag', 'tag2']});
            sv.validateUpdateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update a song when tags is not an array', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id, artist : 'new_artist', album : 'new_album', tab : 'new_tab', tags : 'tag'});
            sv.validateUpdateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update a song when some tags do not exist', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id, artist : 'new_artist', album : 'new_album', tab : 'new_tab', tags : ['tag', 'tag2', 'tag9']});
            sv.validateUpdateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update a song when the song does not exist', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 2, artist : 'new_artist', album : 'new_album', tab : 'new_tab', tags : ['tag']});
            sv.validateUpdateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update a song when the song id is a string', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : 'song_id + 2', artist : 'new_artist', album : 'new_album', tab : 'new_tab', tags : ['tag']});
            sv.validateUpdateSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

describe('update multiple songs', (done) =>{
    it('should update a song given correct inputs', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1], artist : 'new_artist', album : 'new_album', tags : []});
            sv.validateUpdateMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(2);
                    result[0].Artist.should.equal('new_artist');
                    result[0].Album.should.equal('new_album');
                    should.not.exist(result[0].Tags);
                    result[1].Artist.should.equal('new_artist');
                    result[1].Album.should.equal('new_album');
                    should.not.exist(result[1].Tags);
                    done();
                });
            });
        });
    });

    it('should update songs given only album and ids', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1], album : 'new_album'});
            sv.validateUpdateMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(2);
                    result[0].Artist.should.equal('artist');
                    result[0].Album.should.equal('new_album');
                    var tags = checkConcatItems(result[0].Tags, 'tag,tag2,tag4');
                    tags.should.equal(true);
                    result[1].Artist.should.equal('artist2');
                    result[1].Album.should.equal('new_album');
                    var tags = checkConcatItems(result[1].Tags, 'tag2,tag3');
                    tags.should.equal(true);
                    done();
                });
            });
        });
    });

    it('should update songs given only artist and ids', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1], artist : 'new_artist'});
            sv.validateUpdateMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(2);
                    result[0].Artist.should.equal('new_artist');
                    result[0].Album.should.equal('album');
                    var tags = checkConcatItems(result[0].Tags, 'tag,tag2,tag4');
                    tags.should.equal(true);
                    result[1].Artist.should.equal('new_artist');
                    result[1].Album.should.equal('album2');
                    var tags = checkConcatItems(result[1].Tags, 'tag2,tag3');
                    tags.should.equal(true);
                    done();
                });
            });
        });
    });

    it('should update songs given only tags and ids', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : [song_id, song_id + 1], tags : ['tag', 'tag4']});
            sv.validateUpdateMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(2);
                    result[0].Artist.should.equal('artist');
                    result[0].Album.should.equal('album');
                    var tags = checkConcatItems(result[0].Tags, 'tag,tag4');
                    tags.should.equal(true);
                    result[1].Artist.should.equal('artist2');
                    result[1].Album.should.equal('album2');
                    var tags = checkConcatItems(result[1].Tags, 'tag,tag4');
                    tags.should.equal(true);
                    done();
                });
            });
        });
    });

    it('should not update songs when song_ids is not an array', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : song_id, artist : 'new_artist', album : 'new_album', tab : 'new_tab', tags : 'tag'});
            sv.validateUpdateMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update songs when tags is defined and not an array', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : [song_id], tags : 'tag'});
            sv.validateUpdateMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update songs when tags is defined and some dont exist', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : [song_id], tags : ['tag', 'tag9']});
            sv.validateUpdateMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not update songs when only song_ids defined', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : [song_id]});
            sv.validateUpdateMultipleSongs(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should update some songs when the some songs exist', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_ids : [song_id, 'song_id'], tags : []});
            sv.validateUpdateMultipleSongs(req, (err, result) =>{
                should.not.exist(err);
                sv.validateGetAllSongs({}, (err, result) =>{
                    should.not.exist(err);
                    result.should.have.lengthOf(2);
                    should.not.exist(result[0].Tags);
                    var tags = checkConcatItems(result[1].Tags, 'tag2,tag3');
                    tags.should.equal(true);
                    done();
                });
            });
        });
    });
});

describe('user is author', () =>{
    it('should verify user given valid input', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 1, user_id : user_id +1});
            sv.validateUserIsAuthor(req, (err) =>{
                should.not.exist(err);
                done();
            });
        });
    });

    it('should not verify using incomplete input', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 1});
            sv.validateUserIsAuthor(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not verify when the user does not match the song', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 1, user_id : user_id });
            sv.validateUserIsAuthor(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not verify when the user does not exist', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 1, user_id : user_id + 3});
            sv.validateUserIsAuthor(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not verify when the song does not exist', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : song_id + 2, user_id : user_id });
            sv.validateUserIsAuthor(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should not verify when the song_id is a string', (done) =>{
        insertSongsTagsSongTagsUsersAndRatings(done, (song_id, tag_id, song_tag_id, user_id, rating_id) =>{
            var req = common.createRequest({song_id : 'song_id + 2', user_id : user_id });
            sv.validateUserIsAuthor(req, (err) =>{
                should.exist(err);
                done();
            });
        });
    });
});

function insertSongsTagsSongTagsUsersAndRatings(done, next){
    var insert = new models.Inserter(
        [['user', 'password', 0], ['user2', 'password', 1], ['name3', 'password', 0]],
        [['tag', 'type'], ['tag2', 'type2'], ['tag3', 'type2'], ['tag4', 'type2']],
        [['song', 'artist', 'album', 0, 3, 0, 'tab'], ['song2', 'artist2', 'album2', 1, 5, 0, 'tab']],
        [[0, 0], [0,1], [0,3], [1,1], [1,2]],
        [[0, 0, 4, 'text'], [0, 2, 2, 'text'], [1, 1, 5, 'text'], [1, 2, 5, 'text']]
    );
    insert.executeInsert((err) =>{
        if(err) done(err);
        else next(insert.getSongId(), insert.getTagId(), insert.getSongTagId(), insert.getUserId(), insert.getRatingId());
    });
}

function checkConcatItems(found, expected){
    var split_items = found.split(',').sort();
    var exp = expected.split(',').sort();

    if (split_items.length != exp.length) return false;
    for(var i = 0; i < split_items.length; i++){
        if (split_items[i] != exp[i]){return false;}
    }
    return true;
}