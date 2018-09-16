require('dotenv').config();

var fs = require('fs');
var lowerCase = require('lower-case');
var request = require("request");
var Spotify = require('node-spotify-api');

var command = lowerCase(process.argv[2]);
var search = lowerCase(process.argv.slice(3).join(' '));

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
}

function concertThis(artist) {
    request(`https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            let JS = JSON.parse(body);
            for (i = 0; i < JS.length; i++) {
                let dTime = JS[i].datetime;
                let month = dTime.substring(5,7);
                let year = dTime.substring(0,4);
                let day = dTime.substring(8,10);
                let dateForm = month + '/' + day + '/' + year

                console.log('\n--------------- CONCERT INFO ---------------');
                console.log('Date: ' + dateForm);
                console.log('Name: ' + JS[i].venue.name);
                console.log('City: ' + JS[i].venue.city);
                console.log('Country: ' + JS[i].venue.country + '\n');
            }
        } else {
            console.log('Error occurred.');
        }
    });
}

function spotifyThis(search) {
    // var spotify = new Spotify(keys.spotifyKeys);

    // spotify.request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
    // .then(function(data) {
    //     console.log(data); 
    // })
    // .catch(function(err) {
    //     console.error('Error occurred: ' + err); 
    // });

    // spotify.search({ type: 'track', query: song}, function(error, data){
    //     if(!error){
    //         console.log(data.tracks.items[0]);
    //         console.log('Artist: ' + data.tracks.items[0].artists[0].name);
    //         console.log('Song: ' + data.tracks.items[0].name);
    //         console.log('Preview of album: ' + data.tracks.items[0].preview_url);
	//         console.log('Album: ' + data.tracks.items[0].album.name);
    //     } else {
    //       console.log('Error occurred.');
    //     }
    // });
    console.log(`Cannot load the song, "${search}", at the moment.`);
}

function movieThis(search) {
    request(`http://www.omdbapi.com/?t=${search}&y=&plot=short&apikey=trilogy`, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            console.log('\n' + 'Title: ' + data.Title);
            console.log('  Release year: ' + data.Year);
            console.log('  IMBD rating: ' + data.imdbRating);
            console.log('  Rotten Tomatoes rating: ' + data.Ratings[1].Value);
            console.log('  Country where the movie was produced: ' + data.Country);
            console.log('  Language: ' + data.Language);
            console.log('  Synopsis: ' + data.Plot);
            console.log('  Actors: ' + data.Actors + '\n');
        } else {
            console.log('Error occurred.');
        }
    });
}

function doThis() {

}

switch (command) {
    case 'concert-this':
        concertThis(search);
        addToLog('concert-this', search);
        break;
    case 'spotify-this-song':
        spotifyThis(search);
        addToLog('spotify-this-song', search);
        break;
    case 'movie-this':
        movieThis(search);
        addToLog('movie-this', search);
        break;
    case 'do-what-it-says':
        doThis();
        addToLog('do-what-it-says', search);
        break;
    default:
        console.log('\nSorry, command was not found.');
        console.log('Enter "node liri.js" then one of the following below:')
        console.log('  concert-this "artist/band name here"');
        console.log('  movie-this "movie name here"');
        console.log('  do-what-it-says\n');
        addToLog(command, search);
}
