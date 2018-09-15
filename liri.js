require('dotenv').config();

var fs = require('fs');
// Did this so user input does not fail on uppercase
var lowerCase = require('lower-case');
var request = require("request");

var command = lowerCase(process.argv[2]);
var search = lowerCase(process.argv[3]);

/** https://gist.github.com/hurjas/2660489
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 */

function timeStamp() {
// Create a date object with the current time
    let now = new Date();

// Create an array with the current month, day and time
    let date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];

// Create an array with the current hour, minute and second
    let time = [now.getHours(), now.getMinutes(), now.getSeconds()];

// Determine AM or PM suffix based on the hour
    let suffix = (time[0] < 12) ? "AM" : "PM";

// Convert hour from military time
    time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12
    time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
    for (let i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }

// Return the formatted string
    return date.join("/") + " " + time.join(":") + " " + suffix;
}

// Writing to the log file on every command
function addToLog(command, search) {
    let formatted = timeStamp();
    fs.appendFile('log.txt', `${formatted} | Command: ${command} Search: ${search} \r\n`, function(err) {
        if (err) {
            return console.log(err);
        }
    });
    console.log('log success');
}

function concertThis(artist) {
    // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function(error, response, body) {
        // If the request was successful...
        if (!error && response.statusCode === 200) {
            let JS = JSON.parse(body);
            for (i = 0; i < JS.length; i++) {
                let dTime = JS[i].datetime;
                let month = dTime.substring(5,7);
                let year = dTime.substring(0,4);
                let day = dTime.substring(8,10);
                let dateForm = month + "/" + day + "/" + year

                console.log("\n--------------- CONCERT INFO ---------------\n");
                console.log("Date: " + dateForm);
                console.log("Name: " + JS[i].venue.name);
                console.log("City: " + JS[i].venue.city);
                console.log("Country: " + JS[i].venue.country);
            }
        }
    });
}

function spotifyThis() {

}

function movieThis() {

}

function doThis() {

}

switch (command) {
    case 'concert-this':
        concertThis(search);
        addToLog('concert-this', search);
        break;
    case 'spotify-this-song':
        spotifyThis();
        addToLog('spotify-this-song', search);
        break;
    case 'movie-this':
        movieThis();
        addToLog('movie-this');
        break;
    case 'do-what-it-says':
        doThis();
        addToLog('do-what-it-says', search);
        break;
    default:
        console.log('Sorry, command was not found.');
        console.log('Enter "node liri.js" then one of the following below (artist/movie name in Quotes!):')
        console.log('  concert-this "artist/band name here"');
        console.log('  movie-this "movie name here"');
        console.log('  do-what-it-says');
        addToLog(command, search);
}
