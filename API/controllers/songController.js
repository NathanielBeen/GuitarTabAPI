var db = require('../db');
var Ptc = require('./productTagController');
var Rc = require('./ratingController');

function getAllSongs(response){
    let query = 'SELECT songs.Id, songs.Name, Artist, Album, AuthorId, Rating, '
                +'users.Name As AuthorName, ' 
                +'GROUP_CONCAT(tags.Name) As Tags, '
                +'GROUP_CONCAT(tags.Type) As TagTypes '
                +'FROM songs '
                +'LEFT OUTER JOIN users ON users.Id = songs.AuthorId '
                +'LEFT OUTER JOIN songtags ON songtags.SongId = songs.Id '
                +'LEFT OUTER JOIN tags ON tags.Id = songtags.TagId '
                +'GROUP BY songs.Id, songs.Name, Artist, Album, Rating, AuthorName '
                +'ORDER BY Popularity';
    db.queryDb(query, response);
}
    
function getSongPage(page, response){
    let query = 'SELECT songs.Id, songs.Name, Artist, Album, AuthorId, Rating, '
                +'users.Name AS AuthorName, '  
                +'GROUP_CONCAT(tags.Name) As Tags, '
                +'GROUP_CONCAT(tags.Type) As TagTypes '
                +'FROM songs '
                +'LEFT OUTER JOIN users ON users.Id = songs.AuthorId '
                +'LEFT OUTER JOIN songtags ON songtags.SongId = songs.Id '
                +'LEFT OUTER JOIN tags ON tags.Id = songtags.TagId '
                +'GROUP BY songs.Id, songs.Name, Artist, Album, Rating, AuthorName '
                +'ORDER BY Popularity'
                +'LIMIT 10 OFFSET '+10*page;
    db.queryDb(query, response);
}

function getSongById(id, response){
    let query = 'SELECT songs.Id, songs.Name, Artist, Album, AuthorId, Rating, Tab, '
                +'users.Name As AuthorName, '  
                +'GROUP_CONCAT(tags.Name) As Tags, '
                +'GROUP_CONCAT(tags.Type) As TagTypes '
                +'FROM songs '
                +'LEFT OUTER JOIN users ON users.Id = songs.AuthorId '
                +'LEFT OUTER JOIN songtags ON songtags.SongId = songs.Id '
                +'LEFT OUTER JOIN tags ON tags.Id = songtags.TagId '
                +'WHERE songs.Id = ? '
                +'GROUP BY songs.Id, songs.Name, Artist, Album, Rating, AuthorName '
                +'ORDER BY Popularity';
    db.queryDbWithValues(query, id, response);
}

function verifySongExists(id, response){
    let query = 'SELECT COUNT(*) As NumSongs FROM songs '
                +' WHERE Id = ?';
    db.queryDbWithValues(query, id, (err, result) =>{
        if (err || result[0].NumSongs === 0) response(false);
        else response(true);
    });
}

function createSong(name, artist, album, author, tab, tags, response){
    
    let query = 'INSERT INTO songs (Name, Artist, Album, AuthorId, Rating, Popularity, Tab) '
                +'VALUES (?,?,?,?,?,?,?); ';
    let values = [name, artist, album, author, 0, 0, tab];
    db.queryDbWithValuesGetInsertId(query, values, (err, result) =>{
        if (err) response(err, result);
        else Ptc.createSongTags(result, tags, (err, st_result) =>{
            response(err, result)
        });
    })
}

function removeSong(id, response){
    var query = 'DELETE FROM songs WHERE Id = ?';
    db.queryDbWithValues(query, id, (err, result) =>{
        if (err) response(err, result);
        else Ptc.removeSongTags(id, (err, result) =>{
            if (err) response(err, result);
            else Rc.removeSongRatings(id, response);
        });
    });
}

function removeMultipleSongs(ids, response){
    var query = 'DELETE FROM songs '
                +'WHERE Id IN ('+'?,'.repeat(ids.length).slice(0, -1)+')';
    db.queryDbWithValues(query, ids, (err, result) =>{
        if (err) response(err, result);
        else Ptc.removeMultipleSongTags(ids, (err, result) =>{
            if (err) response(err, result);
            else Rc.removeMultipleSongRatings(ids, response);
        });
    });
}

function updateSong(id, artist, album, tab, tags, response){
    let query = 'UPDATE songs '
                +'SET Artist = ?, Album = ?, Tab = ? '
                +'WHERE Id = ?';
    var values = [artist, album, tab, id];
    db.queryDbWithValues(query, values, (err, result) =>{
        if (err) response(err, result);
        else Ptc.updateSongTags(id, tags, response);
    });
}

function updateSongWithoutTab(id, artist, album, tags, response){
    let query = 'UPDATE songs '
                +'SET Artist = ?, Album = ? '
                +'WHERE Id = ?';
    var values = [artist, album, id];
    db.queryDbWithValues(query, values, (err, result) =>{
        if (err) response(err, result);
        else Ptc.updateSongTags(id, tags, response);
    });
}

function updateMultipleSongs(ids, artist, album, tags, response){
    if (artist != null || album != null){
        let query = 'UPDATE songs ';

        if (artist != null && album != null){
            query += 'SET Artist = ?, Album = ? ';
            var values = [artist, album];
        }
        else if (artist != null){
            query += 'SET Artist = ? ';
            var values = [artist];
        }
        else{
            query += 'SET Album = ? ';
            var values = [album];
        }
    
        query += 'WHERE Id IN ('+'?,'.repeat(ids.length).slice(0, -1)+')';
        var comp_values = values.concat(ids);
        db.queryDbWithValues(query, comp_values, (err, result) =>{
            if (err || tags == null) response(err, result);
            else Ptc.updateMultipleSongTags(ids, tags, response);
        });
    }
    else Ptc.updateMultipleSongTags(ids, tags, response);
}

function searchForSong(name, artist, album, author, rating, tags, page, response){
    let search = new SongSearch(name, artist, album, author, rating, tags, page);
    var query = search.createQuery();
    var values = search.getValues();
    db.queryDbWithValues(query, values, response);
}

function userIsAuthor(song_id, user_id, next){
    var query = 'SELECT AuthorId FROM songs WHERE Id = ?';
    db.queryDbWithValues(query, song_id, (err, result) =>{
        var is_author = (!err && result && result.length > 0 && result[0].AuthorId == user_id);
        next(is_author);
    });
}


class SongSearch{
    constructor(name, artist, album, author, rating, tags, page){
        this.name = name;
        this.artist = artist;
        this.album = album;
        this.author = author;
        this.rating = rating;
        this.tags = tags;
        this.page = page;

        this.values = [];
    }

    getValues(){
        return this.values;
    }

    createQuery(){
        var query = 'SELECT songs.Id, songs.Name, Artist, Album, AuthorId, Rating,'
                    +'users.Name As AuthorName, ' 
                    +'GROUP_CONCAT(tags.Name) As Tags, '
                    +'GROUP_CONCAT(tags.Type) As TagTypes '
                    +'FROM songs '
                    +'LEFT OUTER JOIN users ON users.Id = songs.AuthorId '
                    +'LEFT OUTER JOIN songtags ON songtags.SongId = songs.Id '
                    +'LEFT OUTER JOIN tags ON tags.Id = songtags.TagId ';
        if (this.anyParams()){
            query += ' WHERE ';
            var first = true;
            if (Array.isArray(this.tags) && this.tags.length > 0){
                query = this.addTags(query, first);
                first = false;
            }
            if (this.name){
                query = this.addName(query, first);
                first = false;
            }
            if (this.artist){
                query = this.addArtist(query, first);
                first = false;
            }
            if (this.album){
                query = this.addAlbum(query, first);
                first = false;
            }
            if (this.author){
                query = this.addAuthor(query, first);
                first = false;
            }
            if (this.rating){
                query = this.addRating(query, first);
                first = false;
            }
        }
        if (this.page){ this.addPage(query);}
        return query +' GROUP BY songs.Id, songs.Name, Artist, Album, AuthorId, Rating, AuthorName '
                     +' ORDER BY Popularity';
    }

    anyParams(){
        return (this.name || this.artist || this.album || this.author || this.rating || (this.tags && this.tags.length > 0));
    }

    addName(query, first_condition){
        if (!first_condition){ query += ' AND '; }
        this.values.push('%'+this.name+'%');
        return query + 'songs.Name LIKE ?';
    }

    addArtist(query, first_condition){
        if (!first_condition){ query += ' AND '; }
        this.values.push('%'+this.artist+'%');
        return query + 'Artist LIKE ?';
    }

    addAlbum(query, first_condition){
        if (!first_condition){ query += ' AND '; }
        this.values.push('%'+this.album+'%');
        return query + 'Album LIKE ?';
    }

    addAuthor(query, first_condition){
        if (!first_condition){query += ' AND '; }
        this.values.push(this.author);
        return query + 'users.Name LIKE ?';
    }

    addRating(query, first_condition){
        if (!first_condition){ query += ' AND '; }
        this.values.push(this.rating);
        return query + 'Rating >= ?';
    }

    addPage(query){
        this.values.push(this.page * 10);
        return query + ' LIMIT 10 OFFSET ?';
    }

    addTags(query, first_condition){
        if (!first_condition){ query += ' AND '; }
        return query + 'songs.Id IN ('+this.getTagSubquery()+')';
    }

    getTagSubquery(){
        this.tags.forEach(element => {
            this.values.push(element);
        });
        this.values.push(this.tags.length);
        return 'SELECT songtags.SongId '
               +'FROM songtags '
               +'JOIN tags ON tags.Id = songtags.TagId '
               +'WHERE tags.Name IN ('+'?,'.repeat(this.tags.length).slice(0, -1)+') '
               +'GROUP BY songtags.SongId '
               +'HAVING COUNT(DISTINCT tags.Name) = ?';
    }
}

module.exports = {
    getAllSongs : getAllSongs,
    getSongPage : getSongPage,
    getSongById : getSongById,
    createSong : createSong,
    removeSong : removeSong,
    removeMultipleSongs : removeMultipleSongs,
    updateSong : updateSong,
    updateSongWithoutTab : updateSongWithoutTab,
    updateMultipleSongs : updateMultipleSongs,
    searchForSong : searchForSong,
    userIsAuthor : userIsAuthor,
    verifySongExists : verifySongExists
}