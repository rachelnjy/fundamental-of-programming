// Name : Rachel Ng Jia Ying
// Class: DIT/1A/05
// Adm  : 2323530

// This project is about Company Silver Vintage who wants to increase their ticket sales and have created a movie 
// review application which displays different movies and their information.

var input = require("readline-sync");
var fs = require("fs");

var { Movie, MovieList } = require("./2323530_RachelNgJiaYing_Stage2moviegrp");
console.log('Welcome to Silver Vintage Movie Review Program');

// creating an instance for movie list class
var Moviegroup = new MovieList();

//checks for username validity
do {
    var userInput = input.question('Please enter your name: ');
    if (userInput == null || !Moviegroup.onlyLetters(userInput)) {
        console.log("Please enter a valid name.\n")
    }
} while (userInput == null || !Moviegroup.onlyLetters(userInput));


do {
    var choice = input.question(`\nHi ${userInput}, please select your choice:
    \t1. Display All Movies
    \t2. Add Movie
    \t3. Add Rating
    \t4. Lastest 3 Release Dates
    \t5. Filter by Genre
    \t6. Extract data to CSV file
    \t7. Search movie name
    \t8. Exit
    \t>> `);
    switch (choice) {
        case "1":
            Moviegroup.displayAllMovies();
            break;
        case "2":
            Moviegroup.promptAddMovie();
            break;
        case "3":
            Moviegroup.addRating();
            break;
        case "4":
            Moviegroup.lastest3movie();
            break;
        case "5":
            Moviegroup.filterByGenre();
            break;
        case "6":
            Moviegroup.extractTOCSV();
            break;
        case "7":
            Moviegroup.searchMovieByName();
            break;
        case "8":
            // breaks the do while loop
            console.log('Thank you & goodbye!\n');
            break;
        default:
            console.log('Please enter a valid input.\n');
            break;
    }
} while (choice != "8");

