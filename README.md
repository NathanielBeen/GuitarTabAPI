# GuitarTabAPI
a REST API that extends the functionality of the GuitarTab application

## Routes
### Songs
#### Song Models
When a Song is returned, it will come as the following object:
```
{
  "Id" : the id of the song (int)
  "Name" : the name of the song (string)
  "Artist" : the song's artist (string)
  "Album" : the album the song is on (string)
  "AuthorId" : the id of the user that wrote the song (int)
  "AuthorName" : the name of the user that wrote the song (string)
  "Rating" : the combination of all the ratings for the song (double)
  "Tags" : the tag names associated with the songs (string, an array of names can be gotten by splitting on the ",")
  "TagTypes" : the tag types associated with the songs (string, an array of types can be gotten by splitting on the ",")
}
```
When a "Song with Tab" is return, it will come as the following object:
```
{
  "Id" : the id of the song (int)
  "Name" : the name of the song (string)
  "Artist" : the song's artist (string)
  "Album" : the album the song is on (string)
  "AuthorId" : the id of the user that wrote the song (int)
  "AuthorName" : the name of the user that wrote the song (string)
  "Rating" : the combination of all the ratings for the song (double)
  "Tags" : the tag names associated with the songs (string, an array of names can be gotten by splitting on the ",")
  "TagTypes" : the tag types associated with the songs (string, an array of types can be gotten by splitting on the ",")
  "Tab" : a JSON string representing the "song" object and composite parts, measures, chords, and notes (string)
}
```
#### GET /songs
Gets a list of all songs
**In:** no input\
**Out:**
```
{
  "result" : [a list of Songs]
}
```
#### POST /songs
Creates a song
**In:** a valid token (in the header) and the following in the body
```
{
   "name" : the name of the new song (string)
   "artist" : the new song's artist (string)
   "album" : the new song's album (string)
   "author" : the id of the current user (int)
   "tab" : the JSON string representing the part, measures, chords, and notes of the song (string0
   "tags" : [a list of tag names for the song to have (string)]
}
```
**Out:**
```
{
  "result" : confirmation message (string)
  "id" : id of the newly created song (int)
}
```
#### GET /songs/id/:id
Get a song by its id
**In:** the id of the song to be retrieved (in the url)\
**Out:**
```
{
  "result" : [a list of Songs with Tab. the first will be the requested song, or the list will be empty if the id was invalid]
}
```
#### PATCH /songs/id/:id
update a specific song
**In:** the id of the song to be retrieved (in the url), a valid token from the user that created the song (in the header), and the following body
```
{
  "artist" : the new artist (string)
  "album: : the new song album(string)
  "tab" : the new tab for the song (string)
  "tags" : [a list of tag names for the song to have (string)]
}
```
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### DELETE /songs/id/:id
remove a specific song
**In:** the id of the song to be deleted (in the url) and a valid token from the user that created the song (in the header)\
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### PATCH /songs/admin/:id
allows an admin to update a specific song
**In:** the id of the song to be deleted (in the url), a valid token from an admin (in the header), and the following in the body
```
{
  "artist" : the new artist (string)
  "album: : the new song album(string)
  "tags" : [a list of tag names for the song to have (string)]
}
```
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### PATCH /songs/admin_multi
allows an admin to update multiple songs
**In:** a valid token from an admin (in the header)
```
{
  "song_ids" : [a list of song ids to update (int)]
  "artist" : the new artist (string)
  "album: : the new song album(string)
  "tags" : [a list of tag names for the song to have (string)]
}
```
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### DELETE /songs/admin/:id
allows an admin to delete a specific song
**In:** the id of the song to be deleted (in the url) and a valid token from an admin (in the header)\
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### DELETE /songs/admin-multi
allows an admin to delete multiple songs at once
**In:** a valid token from an admin (in the header) and the following in the body
```
{
  "song_ids" : [a lsit of song ids to delete (int)]
}
```
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### POST /songs/search
allows a user to search for songs using a number of parameters
**In**: one of (name, artist, album, rating, and tags) must be defined, but as long as one is defined others can be left out
```
{
  "name" : the name or partial name of a song to find (string)
  "artist" : the name or partial name of the song's artist (string)
  "album" : the name or partial name of the song's album (string)
  "rating" : the minimum rating of songs to find (double, between 1 and 5)
  "tags" : [a list of tags the searched songs need to have (string)]
  "page" : a currently unused parameter (int)
}
```
**Out**:
```
{
  "result" : [a list of Songs that match the specified terms]
}
```
### Tags
#### The Tag Object
Whenever a tag is returned, it will come as the following object:
```
{
  "Id" : the id of the tag (int)
  "Name" : the name of the tag (string)
  "Type" : the type of the tag (string)
}
```
#### GET /tags
Gets a list of all the tags.\
**In:** no input\
**Out:** 
```
{
  "result" : [list of Tags]
}
```
#### POST /tags
Adds a tag\
**In:** A valid token from an admin (in the header and the following body
```
{
  "name" : the name of the new tag (string)
  "type" : the type of the new tag (string)
}
```
**Out:**
```
{
  "result" : confirmation message (string)
  "id" : the id of the newly created tag (int)
}
```
#### GET /tags/id/:id
Gets a tag with a specified id
**In:** the id of the tag to get (in the url)
**Out:**
```
{
  "result" : [list of Tags/ the first tag is the requested tag, or the result is empty if the id did not exist]
}
```
#### PATCH /tags/id/:id
Udpates a specific tag
**In:** the id of the tag to update (in the url), a valid token from an admin (in the header), and the following body
```
{
  "name" : the new name of the tag (string)
  "type" : the new type of the string (string)
}
```
#### DELETE /tags/id/:id
Removes a specific tag
**In:** the id of the tag to delete (in the url), a valid token from an admin (in the header)
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### DELETE /tags/multi-id
Removes multiple tags
**In:** a valid token from an admin (in the header)
```
{
  "tag_ids" : [a list of ids of tags to delete (int)]
{
```
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### PATCH /tags/multi-id
Updates the type of multiple tags
**In:** a valid token from an admin (in the header)
```
{
  "tag_ids" : [a list of ids of tags to update (int)]
  "type" : the new type (string)
{
```
**Out:**
```
{
  "result" : confirmation message (string)
}
```
### Ratings
#### The Rating Object
Whenever a rating is returned, it will come as the following object:
```
{
  "Id" : the id of the rating object (int)
  "SongId" : the id of the song the rating is for (int)
  "UserId" : the id of the user who wrote the rating (int)
  "Rating" : the value of the rating (double from 1 to 5)
  "Text" : the text of the rating (string)
  "Name" : the name of the user who wrote the rating (string)
 }
```
#### GET /ratings
Gets a list of all song ratings.\
**In:** no input\
**Out:**
```
{
  "result" : [list of Ratings]
}
```
#### POST /ratings
Adds a rating to a song\
**In:** valid user token (in header) and the following body\
```
{
  "song_id" : the id of the song the rating is for (int)
  "user_id" : the id of the user creating the rating (int)
  "rating" : the value of this rating (double between 1 and 5)
  "text" : the text for the rating (string)
}
```
**Out:**
```
{
  "result" : confirmation message (string)
  "id" : id of the newly created rating (int)
}
```
#### GET /ratings/id/:id
Gets a rating from the rating id\
**In:** the id of the rating (sent in the url)\
**Out:**
```
{
  "result" : [A list of Ratings (will contain only the desired rating as the first object, or nothing if the id was invalid]
}
```
#### PATCH /ratings/id/:id
Updates a given rating with a new rating value and text\
**In:** the id of the rating (sent in the url) and a valid token (in the header). The token must be from the user that initially created the rating. The following should be sent in the body\
```
{
  "rating" : the value of this rating (double between 1 and 5)
  "text" : the text for the rating (string)
}
```
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### DELETE /ratings/id/:id
deletes a given rating\
**In:** the id of the rating (sent in the url) and a valid token (in the header). The token must be from the user that initally created the rating.\
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### DELETE /ratings/admin/:id
allows an admin to delete a rating\
**In:** the id of the rating (sent in the url) and a valid token (in the header). The token must be from an admin account.\
**Out:**
```
{
  "result" : confirmation message (string)
}
```
#### DELETE /ratings/admin-multi
allows for an admin to delete multiple ratings at the same time\
**In:** a valid admin token (sent in the header), with the following sent in the body\
```
{
  "rating_ids" : [a list of ids to delete (int)]
}
```
**Out:**
```
{
  "result" : confirmation message (string)
}
```

#### GET /song_ratings/:id
Gets a list of all ratings associated with a certain song\
**In:** the id of the song to get ratings of (sent in the url)\
**Out:**
```
{
  "result" : [a list of Ratings]
}
```

#### GET /user-ratings/:id
Gets a list of all ratings associated with a certain user\
**In:** the id of the user to get ratings (sent in the url)\
**Out:**
```
{
  "result" : [a list of Ratings]
}
```

### Users
#### The User Object
Whenever a user is returned, it will come as the following object (Note: passwords are never returned):
```
{
  "Id" : the id of the user (int)
  "Name" : the username of the user (string)
  "Type" : whether the user is an adin (1) or not (0) (int)
}
```
#### GET /users
Gets a list of all users
**In:** a valid token from an admin (in the header)
**Out:**
```
{
  "result" : [a list of Users]
}
```
#### GET /users/id/:id
allows an admin to get a user by id
**In:** the id of the user to get (in the url) and a valid token from an admin (in the header)
**Out:**
```
{
  "result" : [a list of Users. The first user will be the requested one, and the list will be empty if the id was invalid]
}
```
#### DELETE /users
allows a user to delete their own account
**In:**
```
{
  "name" : the username of the account to delete (string)
  "password" : the password of the account to delete (string)
}
```
**Out:**
```
{
  "result" : a confirmation message (string)
}
```
#### DELETE /users/admin/:id
allows an admin to delete an account
**In:** the id of the user to delete (in the url)
```
{
  "name" : the username of the current admin (string)
  "password" : the password of the current admin (string)
}
```
**Out:**
```
{
  "result" : confirmation message (string)
  "id" : id of the newly created user (int)
  "token" : a token to use in future calls (string)
}
```
#### POST /users/signup
Creates a new non-admin user
**In:**
```
{
  "name" : a username (string, must only contains letters and numbers, must be 4 or more characters)
  "password" : a password (string, must only contain letters and numbers, must be 8 or more characters)
}
```
**Out:**
```
{
  "result" : confirmation message (string)
  "id" : id of the newly created user (int)
}
```
#### POST /users/signup-admin
Creates a new admin user
**In:** a valid token from an admin (in the header)
```
{
  "name" : a username (string, must only contain letters and numbers, must be 4 or more characters)
  "password" : a password (string, must only contain letters and numbers, must be 8 or more characters)
}
```
**Out:**
```
{
  "result" : confirmation message (string)
  "id" : id of the newly created user (int)
}
```
#### POST /users/login
Allows a user to log in
**In:**
```
{
  "name" : the username for the user
  "password" : the password for the user
}
```
**Out:**
```
{
  "result" : confirmation message (string)
  "id" : id of the newly created user (int)
  "token" : a token to use in future calls (string)
}
```
#### PATCH /users/change-password
Allows a user to change their password
**In:**
```
{
  "name" : the username of the user (string)
  "password" : the old password of the user (string)
  "new_password" : the new password of the user (string)
}
```
**Out:**
```
{
  "result" : confirmation message (string)
  "id" : id of the newly created user (int)
  "token" : a token to use in future calls (string)
}
```
#### PATCH /users/change-user-type
allows an admin to "promote" a user to an admin or "demote" an admin to a standard user
**In:** a valid token from an admin (in the header)
```
{
  "user_id" : the id of the user to change (string)
  "type" : the new type for the user (string)
}
```
**Out:**
```
{
  "result" : a confirmation message (string)
}
```
