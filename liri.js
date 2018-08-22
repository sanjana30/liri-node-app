require("dotenv").config();
var fs = require("fs");
var request = require("request");
var chalk = require("chalk");
var keys = require("./key.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var nodeArgs = process.argv;
var movieName = "";
var artistName = "";

// Condition 1: movie-this

if (nodeArgs[2] == "movie-this") {
    if (nodeArgs[3] != undefined) {
        for (var i = 3; i < nodeArgs.length; i++) {
            if (i > 3 && i < nodeArgs.length) {
                movieName = movieName + "+" + nodeArgs[i];
            }
            else {
                movieName += nodeArgs[i];
            }
        }
    }
    else if (nodeArgs[3] == undefined) {
        movieName = "Mr. Nobody";
    }
    getMovieInfo(movieName);
}

//Condition 2: concert-this

if (nodeArgs[2] == "concert-this") {
    var artistName = nodeArgs.slice(3).join(" ");
    if(!artistName){
        artistName = "imagine dragons";
    }
    getConcertInfo(artistName);
}

//Condition 3:spotify-this-song

if (nodeArgs[2] == "spotify-this-song") {
    var song = nodeArgs.slice(3).join(" ");
    if(!song){
        song = "The Sign by Ace of Base"
    }
    getSongInfo(song); 
}

//Condition 3:do-what-it-says

if (nodeArgs[2] == "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var output = data.split(",");
        if(output[0] == "spotify-this-song"){
            getSongInfo(output[1]);
        }
        if(output[0] == "concert-this"){
            getConcertInfo(output[1]);
        }
        if(output[0] == "movie-this"){
            getMovieInfo(output[1]);
        }
        
    });
}

//function movie info

function getMovieInfo(movieName){
    var movieURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(movieURL, function (error, response, body) {
        if (error) {
            console.log(error);
        }
        if (!error && response.statusCode === 200) {
            var movieDetails = JSON.parse(body);
            console.log(chalk.green("----------------------------------------------------------------------------------------"));
            console.log(chalk.red("Movie: ") + movieDetails.Title + chalk.red("\nYear of Release: ") + movieDetails.Year + chalk.red("\nIMDB Rating: ") + movieDetails.Ratings[0].Value +chalk.red("\nRotten Tomatoes Rating: ")+movieDetails.Ratings[1].Value+chalk.red("\nCountry of Production: ")+ movieDetails.Country +chalk.red("\nLanguage: ")+ movieDetails.Language + chalk.red("\nPlot: ")+ movieDetails.Plot +chalk.red("\nActors: ") + movieDetails.Actors, null, 2);
            console.log(chalk.green("----------------------------------------------------------------------------------------"));
        }
    });
}

function getSongInfo(song){
    spotify.search({ type: 'track', query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(chalk.green("----------------------------------------------------------------------------------------"));
        console.log(chalk.red("Song: ")+data.tracks.items[0].name);
        console.log(chalk.red("Artists: ")+data.tracks.items[0].album.artists[0].name);
        console.log(chalk.red("Album: ")+data.tracks.items[0].album.name);
        console.log(chalk.red("Preview URL: ")+data.tracks.items[0].preview_url);
        console.log(chalk.green("----------------------------------------------------------------------------------------"));
        
    });
}

function getConcertInfo(artistName){
    var concertURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    request(concertURL, function (error, response, body) {
        if (error) {
            console.log(error);
        }
        if (!error && response.statusCode === 200) {
            // console.log(JSON.parse(body));
            artistInfo = JSON.parse(body)
            console.log(chalk.green("----------------------------------------------------------------------------------------"));
            for(var i=0; i <artistInfo.length; i++){
                console.log(chalk.red("Artist/Band Name: ")+artistName+chalk.red("\nName of Venue: ")+artistInfo[i].venue.name+chalk.red("\nVenue Location: ")+artistInfo[i].venue.city+" "+artistInfo[i].venue.region+","+artistInfo[i].venue.country+chalk.red("\nDate: ")+artistInfo[i].datetime+"\n\n");
            }
            console.log(chalk.green("----------------------------------------------------------------------------------------"));
        }
    });
}