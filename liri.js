require('dotenv').config();

var fs = require('fs');

var command = process.argv[2];
var search = process.argv[3];

switch (command) {
    case 'concert-this':
        console.log('concert-this');

        concertThis();
        addToLog('concert-this');
        break;
    case 'spotify-this-song':
        console.log('spotify-this-song');

        spotifyThis();
        addToLog('spotify-this-song');
        break;
    case 'movie-this':
        console.log('movie-this');

        movieThis();
        addToLog('movie-this');
        break;
    case 'do-what-it-says':
        console.log('do-what-it-says');

        doThis();
        addToLog('do-what-it-says');
        break;
    default:
        console.log('Sorry, command was not found.');
        console.log('Enter "node liri.js" then one of the following below:')
        console.log('  concert-this <artist/band name here>');
        console.log('  movie-this <movie name here>');
        console.log('  do-what-it-says');
        addToLog(command);
}

// Writing to the log file on every command
function addToLog(command) {
    var today = new Date();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    var date = today.getFullYear() + '-'+ today.getMonth() + '-' + today.getDate();
    fs.appendFile('log.txt', `${date} ${time} | Command: ${command} \r\n`, function(err) {
        if (err) {
            return console.log(err);
        }
    });
    console.log('log success');
}

function concertThis() {

}

function spotifyThis() {

}

function movieThis() {

}

function doThis() {

}