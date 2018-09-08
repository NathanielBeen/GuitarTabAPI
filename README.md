# GuitarTabAPI
a REST API that extends the functionality of the GuitarTab application

## Routes
### Songs
### Tags
### Ratings
#### GET /ratings
Gets a list of all song ratings.
In: no input
Out: A list of results, each with properties {Id (int), SongId (int), UserId (int), Rating (double), Text (string), Name (string)}
#### POST /ratings
Adds a rating to a song
In: valid user token (in header), {song_id (int), user_id (int), rating (double), text (string)} in body
Out: a success message in "result" and the id of the created rating under "id"
#### GET /ratings/id/:id
Gets a rating from the rating id
In: the id of the rating (sent in the url)
Out: a list of results. If the id was valid, the first item in the list will be the desired rating, with properties {Id (int), SongId (int), UserId(int), Rating (double), Text (string), Name (string)}
#### PATCH /ratings/id/:id
Updates a given rating with a new rating value and text
In: the id of the rating (sent in the url), a valid token (in the header), and {rating (double), text (string)} sent in the body. The token must be from the user that initially created the rating.
Out: a confirmation message send in "result".
#### DELETE /ratings/id/:id
deletes a given rating
In: the id of the rating (sent in the url) and a valid token (in the header). The token must be from the user that initally created the rating.
Out: a confirmation message send in the "result".
#### DELETE /ratings/admin/:id
allows an admin to delete a rating
In: the id of the rating (sent in the url) and a valid token (in the header). The token must be from an admin account.
Out: a confrimation message send in the "result"
#### DELETE /ratings/admin-multi
allows for an admin to delete multiple ratings at the same time
In: a valid admin token (sent in the header), {rating_ids (array of ints)} send in the body.
Out: a confirmation message sent in "result"
#### GET /song_ratings/:id
Gets a list of all ratings associated with a certain song
In: the id of the song to get ratings of (sent in the url)
Out: a list of results in "result", each element having properties {Id (int), SongId (int), UserId (int), Text (string), Name (string)}
#### GET /user-ratings/:id
Gets a list of all ratings associated with a certain user
In: the id of the user to get ratings (sent in the url)
Out: a list of results in "result", each element having properties {Id (int), SongId (int), UserId (Int), Text (string), Name (string)}
### Users
