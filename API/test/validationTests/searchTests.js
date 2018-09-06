const common = require('../common');

const sv = require('../../validators/songValidator');

const chai = common.chai;
const should = common.should;
const expect = common.expect;
const models = common.models;

describe('search tags', () =>{
    it('should return 3 results from a name search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({name : 'name'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(3);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('long_name');
                expect(result[2].Name).to.equal('name2');
                done();
            });
        });
    });

    it('should return 0 results from unmatched name search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({name : 'not_other'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should return 4 results from an artist search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({artist : 'artist'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(4);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('long_name');
                expect(result[2].Name).to.equal('other');
                expect(result[3].Name).to.equal('other2');
                done();
            });
        });
    });

    it('should return 1 result from specific artist search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({artist : 'long_artist'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Name).to.equal('long_name');
                done();
            });
        });
    });

    it('should return 2 results from an album search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({album : 'other'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].Name).to.equal('long_name');
                expect(result[1].Name).to.equal('long_other');
                done();
            });
        });
    });

    it('should return 0 results from an unmatched album search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({album : 'unmatched'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should return 3 results from an author search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({author : 'name'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(3);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('other');
                expect(result[2].Name).to.equal('other2');
                done();
            });
        });
    });

    it('should return 2 results from a rating search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({rating : 4});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].Name).to.equal('long_name');
                expect(result[1].Name).to.equal('name2');
                done();
            });
        });
    });

    it('should return 3 results from a single tag search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({tags : ['tag4']});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(3);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('long_other');
                expect(result[2].Name).to.equal('other2');
                done();
            });
        });
    });

    it('should return 2 results from a multi tag search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({tags : ['tag3', 'tag4']});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('other2');
                done();
            });
        });
    });

    it('should return 0 results from an unmatched tag search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({tags : ['tag5']});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should return 2 results from a name and artist search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({name : 'name', artist : 'artist'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('long_name');
                done();
            });
        });
    });

    it('should return 1 result from a name, artist, and album search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({name : 'name', artist: 'artist', album : 'album'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Name).to.equal('name');
                done();
            });
        });
    });

    it('should return 2 results from an author and rating search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({author : 'name', rating : 3});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('other');
                done();
            });
        });
    });

    it('should return 2 results from a name, artist, and rating search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({name : 'name', artist : 'artist', rating : 3});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('long_name');
                done();
            });
        });
    });

    it('should return 2 results from a tag and album search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({album : 'album', tags : ['tag', 'tag3']});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(2);
                expect(result[0].Name).to.equal('name');
                expect(result[1].Name).to.equal('other');
                done();
            });
        });
    });

    it('should return 1 result from a tag and name search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({tags : ['tag4'], name : 'long_other'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Name).to.equal('long_other');
                done();
            });
        });
    });

    it('should return 1 result from a every field search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({name : 'other', artist : 'artist', album : 'long_album', author : 'name', rating : 2, tags : ['tag', 'tag3']});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(1);
                expect(result[0].Name).to.equal('other');
                done();
            });
        });
    });

    it('should return 0 results from an every field search', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({name : 'other', artist : 'other', album : 'long_album', author : 'name', rating : 2, tags : ['tag', 'tag3']});
            sv.validateSearchForSong(req, (err, result) =>{
                should.not.exist(err);
                expect(result).to.have.lengthOf(0);
                done();
            });
        });
    });

    it('should return 0 results when tags is an empty array', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({tags : []});
            sv.validateSearchForSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should return 0 results when tags is not an array', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({tags : 'tag'});
            sv.validateSearchForSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });

    it('should return 0 results when no parameters are defined', (done) =>{
        insertSongsForSearching(done, () =>{
            var req = common.createRequest({});
            sv.validateSearchForSong(req, (err, result) =>{
                should.exist(err);
                done();
            });
        });
    });
});

function insertSongsForSearching(done, next){
    var insert = new models.Inserter(
        [['name', 'password', 0], ['long_name', 'password', 0], ['other', 'password', 1]],
        [['tag', 0], ['tag2', 0], ['tag3', 0], ['tag4', 1], ['tag5', 0], ['tag6', 0]],
        [['name', 'artist', 'album', 0, 3, 0, 'tab'], ['long_name', 'long_artist', 'other', 1, 4, 0, 'tab'],
        ['other', 'artist', 'long_album', 0, 3, 0, 'tab'], ['long_other', 'other', 'other', 2, 2, 0, 'tab'],
        ['name2', 'other', 'album2', 2, 5, 0, 'tab'], ['other2', 'artist', 'album', 0, 2, 0, 'tab']],
        [[0, 0], [0,1], [0,2], [0,3], [1,2], [1,5], [2,0], [2,2], [3,3], [5,2], [5,3], [5,5]],
        []);
    insert.executeInsert((err) =>{
        if(err) done(err);
        else next();
    });
}