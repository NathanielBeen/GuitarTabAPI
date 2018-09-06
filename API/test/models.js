class DbObject{
    constructor(props){
        this.props = props;
    }

    getValueString(){
        return '('+this.props.join()+')';
    }

    static getMultipleObjectValueString(objects){
        return objects.map(o => o.getValueString()).join();
    }
}

class Rating extends DbObject{
    constructor(song_id, user_id, rating, text){
        super([song_id, user_id, rating, text]);
    }

    static formatValues(values, last_song_id, last_user_id){
        const c_values = values.map(e => new Rating(e[0] + last_song_id, e[1] + last_user_id, e[2], "'"+e[3]+"'"));
        return DbObject.getMultipleObjectValueString(c_values);
    }

    static getColumnString(){
        return ' (SongId, UserId, Rating, Text) ';
    }
}

class Song extends DbObject{
    constructor(name, artist, album, author_id, rating, popularity, tab){
        super([name, artist, album, author_id, rating, popularity, tab]);
    }

    static formatValues(values, last_user_id){
        const c_values = values.map(e => new Song("'"+e[0]+"'", "'"+e[1]+"'", "'"+e[2]+"'", e[3] + last_user_id, e[4], e[5], "'"+e[6]+"'"));
        return DbObject.getMultipleObjectValueString(c_values);
    }

    static getColumnString(){
        return ' (Name, Artist, Album, AuthorId, Rating, Popularity, Tab) ';
    }
}

class SongTag extends DbObject{
    constructor(song_id, tag_id){
        super([song_id, tag_id]);
    }

    static formatValues(values, last_song_id, last_song_tag_id){
        const c_values = values.map(e => new SongTag(e[0] + last_song_id, e[1] + last_song_tag_id));
        return DbObject.getMultipleObjectValueString(c_values);
    }

    static getColumnString(){
        return '(SongId, TagId)';
    }
}

class Tag extends DbObject{
    constructor(name, type){
        super([name, type]);
    }

    static formatValues(values){
        const c_values = values.map(e => new Tag("'"+e[0]+"'", "'"+e[1]+"'"));
        return DbObject.getMultipleObjectValueString(c_values);
    }

    static getColumnString(){
        return ' (Name, Type) ';
    }
}

class User extends DbObject{
    constructor(name, password, type){
        super([name, password, type]);
    }

    static formatValues(values){
        const c_values = values.map(e => new User("'"+e[0]+"'", "'"+e[1]+"'", e[2]));
        return DbObject.getMultipleObjectValueString(c_values);
    }

    static getColumnString(){
        return ' (Name, Password, Type) ';
    }
}

class Inserter{
    constructor(user, tag, song, song_tag, rating){
        this.user = user;
        this.tag = tag;
        this.song = song;
        this.song_tag = song_tag;
        this.rating = rating;

        this.user_id = 0;
        this.tag_id = 0;
        this.song_id = 0;
        this.song_tag_id = 0;
        this.rating_id = 0;
    }

    executeInsert(callback){
        this.insertUsers(callback);
    }

    insertUsers(callback){
        if (this.user.length > 0){
            this.insert('users', User.getColumnString(), User.formatValues(this.user), (insert, err) =>{
                this.user_id = insert;
                if (err) callback(err);
                else this.insertTags(callback);
            });
        }
        else this.insertTags(callback);
    }

    insertTags(callback){
        if (this.tag.length > 0){
            this.insert('tags', Tag.getColumnString(), Tag.formatValues(this.tag), (insert, err) =>{
                this.tag_id = insert;
                if (err) callback(err);
                else this.insertSongs(callback);
            });
        }
        else this.insertSongs(callback);
    }

    insertSongs(callback){
        if (this.song.length > 0){
            this.insert('songs', Song.getColumnString(), Song.formatValues(this.song, this.user_id), (insert, err) =>{                
                this.song_id = insert;
                if (err) callback(err);
                else this.insertSongTags(callback);
            });
        }
        else this.insertSongTags(callback);
    }

    insertSongTags(callback){
        if (this.song_tag.length > 0){
            this.insert('songtags', SongTag.getColumnString(), SongTag.formatValues(this.song_tag, this.song_id, this.tag_id), (insert, err) =>{
                this.song_tag_id = insert;
                if (err) callback(err);
                else this.insertRatings(callback);
            });
        }
        else this.insertRatings(callback);
    }

    insertRatings(callback){
        if (this.rating.length > 0){
            this.insert('ratings', Rating.getColumnString(), Rating.formatValues(this.rating, this.song_id, this.user_id), (insert, err) =>{
                this.rating_id = insert;
                callback(err);
            });
        }
        else callback(null);
    }

    insert(table_name, col_names, values, done){
        var query = 'INSERT INTO '+table_name+col_names+' VALUES '+values;
        db.queryDb(query, (err, result) =>{
            if (err){
                console.log(err);
                done(0,err);
            }
            else done(result.insertId, null);
        });
    }

    getUserId(){
        return this.user_id;
    }

    getTagId(){
        return this.tag_id;
    }

    getSongId(){
        return this.song_id;
    }

    getSongTagId(){
        return this.song_tag_id;
    }

    getRatingId(){
        return this.rating_id;
    }
}

exports.DbObject = DbObject;
exports.User = User;
exports.Song = Song;
exports.Tag = Tag;
exports.SongTag = SongTag;
exports.Rating = Rating;
exports.Inserter = Inserter;