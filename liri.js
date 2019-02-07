var dotenv = require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');
var inquirer = require("inquirer");
var moment = require ("moment")

var keys = require("./keys.js")


inquirer
  .prompt([
    // {
    //     type: "input",
    //     message: "what is your name?",
    //     name: "username",
    // },

    {
      type: "list",
      message: "Hello, what would you like to do today?",
      choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
      name: "computer",
    }

  ])

  .then(function (inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's username and pokemon from the answers.
    if (inquirerResponse.computer == "concert-this") {

      inquirer
        .prompt([{
          type: "input",
          message: "Who do you want to see?",
          name: "artist",
        }, ]).then(function (inquirerResponse) {
          var queryURL = "https://rest.bandsintown.com/artists/" + inquirerResponse.artist + "/events?app_id=codingbootcamp";
          axios.get(queryURL)
            .then(function (response) {
              console.log("\n The concerts available are:\n");
              for (var i = 0; i < response.data.length; i++) {
                console.log(
                  "The venue is " + response.data[i].venue.name +
                  " in " + response.data[i].venue.city + " , " + response.data[i].venue.region + " on " +
                   moment(response.data[i].datetime).format('MMMM Do YYYY, h:mm:ss a')
                )
              }
            });

        });

    }
    else if (inquirerResponse.computer == "spotify-this-song") {

      inquirer
        .prompt([{
          type: "input",
          message: "What song would ou like to find?",
          name: "song",
        }, ]).then(function (inquirerResponse) {
         
          var spotify = new Spotify(keys.spotify);
          
          
          spotify.search({ type: 'track', query: inquirerResponse.song }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
           
          
          for (var i= 0; i < 5; i++) {
              console.log (
                  data.tracks.items[i].artists[0].name,
                  data.tracks.items[i].name,
                  data.tracks.items[i].preview_url,
                  data.tracks.items[i].album.name,
                  // JSON.stringify(data, null, 2),
              )}
          })
        });



    }
    else if (inquirerResponse.computer == "movie-this") {

      inquirer
        .prompt([{
          type: "input",
          message: "What movie do you want to see?",
          name: "movie",
        }, ]).then(function (inquirerResponse) {

       
          axios.get("http://www.omdbapi.com/?t=" + inquirerResponse.movie  + "&y=&plot=short&apikey=trilogy").then(
            function (response) {
              // console.log(response)
              console.log(response.data.Title + " came out in the year " + response.data.Year + ", with an IMBD rating of " + response.data.imdbRating +
                " & a rating from " + response.data.Ratings[1].Source + " of " + response.data.Ratings[1].Value + "." + " It was produced in the " + response.data.Country +
                " in " + response.data.Language + "." + " The invigarating Plot is: " + response.data.Plot + " Starring " + response.data.Actors + "."
              );
            }
          );
        });



    } else {
      console.log("\nIt doesn't matter " + inquirerResponse.username + ", I have access anyway.\n");
    }
  });

