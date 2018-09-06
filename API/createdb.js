var db = require('./db');

function createDatabase(){
    var query = 'SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";' +
    'SET AUTOCOMMIT = 0;' +
    'START TRANSACTION;' + 
    'SET time_zone = "+00:00";' +

    'CREATE TABLE IF NOT EXISTS `ratings` (' +
      '`Id` int(32) NOT NULL,' +
      '`SongId` int(32) NOT NULL,' +
      '`UserId` int(32) NOT NULL,' +
      '`Rating` int(8) NOT NULL,' +
      '`Text` text NOT NULL' +
    ');' +
    'CREATE TABLE IF NOT EXISTS `songs` (' +
      '`Id` int(32) NOT NULL,' +
      '`Name` varchar(64) NOT NULL,' +
      '`Artist` varchar(64) DEFAULT NULL,' +
      '`Album` varchar(64) DEFAULT NULL,' +
      '`AuthorId` int(32) NOT NULL,' +
      '`Rating` decimal(10,6) DEFAULT NULL,' +
      '`Popularity` int(11) NOT NULL,' +
      '`Tab` longtext NOT NULL' +
    ');' +
    'CREATE TABLE IF NOT EXISTS `songtags` (' +
      '`Id` int(32) NOT NULL,' +
      '`SongId` int(32) NOT NULL,' +
      '`TagId` int(32) NOT NULL' +
    ');' +
    'CREATE TABLE IF NOT EXISTS `tags` (' +
      '`Id` int(16) NOT NULL,' +
      '`Name` varchar(64) NOT NULL,' +
      '`Type` varchar(64) NOT NULL' +
    ');' +
    'CREATE TABLE IF NOT EXISTS `users` (' +
      '`Id` int(11) NOT NULL,' +
      '`Name` varchar(64) NOT NULL,' +
      '`Password` varchar(64) NOT NULL,' +
      '`Type` int(2) NOT NULL' +
    ');'

    'ALTER TABLE `ratings`' +
      'ADD PRIMARY KEY (`Id`),' +
      'ADD UNIQUE KEY `SongId` (`SongId`,`UserId`);'+
    'ALTER TABLE `songs`' +
      'ADD PRIMARY KEY (`Id`);' +
    'ALTER TABLE `songtags`' +
      'ADD PRIMARY KEY (`Id`),' +
      'ADD UNIQUE KEY `SongId` (`SongId`,`TagId`);' +
    'ALTER TABLE `tags`' +
      'ADD PRIMARY KEY (`Id`),' +
      'ADD UNIQUE KEY `Name` (`Name`);' +
    'ALTER TABLE `users`' +
      'ADD PRIMARY KEY (`Id`),' +
      'ADD UNIQUE KEY `Name` (`Name`);' +

    'ALTER TABLE `ratings`' +
      'MODIFY `Id` int(32) NOT NULL AUTO_INCREMENT;' +
    'ALTER TABLE `songs`' +
      'MODIFY `Id` int(32) NOT NULL AUTO_INCREMENT;' +
    'ALTER TABLE `songtags`' +
      'MODIFY `Id` int(32) NOT NULL AUTO_INCREMENT;' +
    'ALTER TABLE `tags`' +
      'MODIFY `Id` int(16) NOT NULL AUTO_INCREMENT;' +
    'ALTER TABLE `users`' +
      'MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;' +
    'COMMIT;';

    db.queryDb(query, (err, result) =>{
      if (err) console.log(err);
      else{
        console.log('database created');
        checkDb();
      }
    });
}

function checkDb(){
  var query = 'DESCRIBE ratings; DESCRIBE songs; DESCRIBE songtags; DESCRIBE tags; DESCRIBE ratings;'
  db.queryDb(query, (err, result) =>{
    if (err) console.log(err);
    else console.log(result);
  });
}

module.exports = {
  createDatabase : createDatabase,
  checkDb : checkDb
}