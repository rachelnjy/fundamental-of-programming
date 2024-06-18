var input = require("readline-sync");
var fs = require("fs");

class Movie {
    constructor(_name, _genre, _runningtime, _releasedate, _rating) {
        this.name = _name;
        this.genre = _genre;
        this.runningtime = _runningtime;
        this.releasedate = _releasedate;
        this.rating = _rating;
    }

    displayMovieDetails() {
        var voters = 0;

        if (!this.rating || !Array.isArray(this.rating) || this.rating.length < 2) {
            var avgRating = 0; // set avgRating to 0
        } else {
            avgRating = Math.round((this.rating[1] / this.rating[0]) * 10) / 10;
            voters = this.rating[0]
        }

        //calculate running time in hours and mins
        var hours = Math.floor(this.runningtime / 60);
        var mins = this.runningtime % 60;

        var RunningTimeList = "";
        if (hours == 0) {
            RunningTimeList = mins + 'm';
        } else if (mins == 0) {
            RunningTimeList = hours + 'h';
        } else {
            RunningTimeList = hours + 'h ' + mins + 'm';
        }

        return (
            '\nName\t\t: ' + this.name +
            '\nGenre\t\t: ' + this.genre +
            '\nRunning time\t: ' + RunningTimeList +
            '\nRelease Date\t: ' + this.releasedate +
            '\nRating\t\t: ' + avgRating + ' (' + voters + ' voters)' +
            '\n'
        );
    }
}

class MovieList {
    constructor() {
        this.movies = []; // Create an array to store movies object
        this.newMovie("Black Panther: Wakanda Forever 2022", ["Adventure", "Action", "Drama", "Fantasy", "Sci-Fi", "Thriller"], 161, "11 Nov 2022", [9, 42]);
        this.newMovie("Avatar: The Way of Water", ["Adventure", "Sci-Fi"], 192, "16 Dec 2022", [4, 15]);
        this.newMovie("Fast X", ["Crime", "Action", "Mystery", "Thriller"], 43, "19 May 2023", [28, 60]);
        this.newMovie("Ant-Man and the Wasp: Quantumania", ["Adventure", "Action"], 120, "16 Feb 2023", [18, 80]);
        this.newMovie("M3GAN", ["Horror", "Mystery", "Thriller"], 102, "6 Jan 2023", [20, 70]);
    }

    // add new movie to this.movies array
    newMovie(_name, _genre, _runningtime, _releasedate, _rating) {
        var newmovie = new Movie(_name, _genre, _runningtime, _releasedate, _rating);
        this.movies.push(newmovie); // Add the new movie to the movies array
    }

    // use regex to check if string contains only letters and white space
    onlyLetters(str) {
        return /^[a-zA-Z\s]+$/.test(str);
    }
    // use regex to check if string is following the format of (date month year)
    onlyDate(str) {
        return /^\d{1,2} \w{3} \d{4}$/.test(str);
    }
    //use regex to check if string only contains positive integers
    onlyMins(str) {
        return /^[1-9]\d*$/.test(str);
    }
    //use regex to check if string contains symbols
    onlySymbols(str) {
        return /[$&+,:;=?@#|'<>.^*()%!-]/.test(str);
    }

    //fliter our genre list
    getGenres() {
        var unfilteredMovieGenre = [];
        for (var i = 0; i < this.movies.length; i++) {
            var movieGenres = this.movies[i].genre;
            for (var j = 0; j < movieGenres.length; j++) {
                unfilteredMovieGenre.push(movieGenres[j]);
            }
        }

        //remove duplicate genres
        var movieGenre = [];
        for (var j = 0; j < unfilteredMovieGenre.length; j++) {
            var genre = unfilteredMovieGenre[j];
            var isDuplicate = false;
            for (var h = 0; h < movieGenre.length; h++) {
                if (movieGenre[h] == genre) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                movieGenre.push(genre);
            }
        }
        // sort movie in alphabetical order
        movieGenre.sort();

        return movieGenre;
    }

    //display all movies in the list
    displayAllMovies() {
        for (var i = 0; i < this.movies.length; i++) {
            console.log(this.movies[i].displayMovieDetails());
        }
    }

    // prompt for new movie, running time and genre
    promptAddMovie() {
        do {
            // prompt user to add new movie
            var isNewMovie = true;
            var newMovieName = input.question("\n\tPlease enter Movie's name: ");

            if (!newMovieName || !this.onlyLetters(newMovieName)) {
                console.log("\tPlease enter a unique movie name!\n");
                continue;
            }

            for (var i = 0; i < this.movies.length; i++) {
                if (newMovieName.toLowerCase() === this.movies[i].name.toLowerCase()) {
                    isNewMovie = false;
                    console.log("\tPlease enter a unique movie name!\n");
                    break;
                }
            }

            if (!isNewMovie) {
                continue;
            }

            //prompt user to add new genre
            var movieGenre = this.getGenres();
            var selectedGenres = []; // array to store selected genres

            while (selectedGenres.length == 0) {
                console.log("\n\tPlease enter Movie's genre(s): ");
                // prints out genre list 
                for (var i = 0; i < movieGenre.length; i++) {
                    console.log("\t" + [i + 1] + ") " + movieGenre[i]);
                }
                var genreChoice = input.question("\t>> ");

                // check validation for genreChoice
                if (genreChoice.toLowerCase() == "done") {
                    if (selectedGenres.length == 0) {
                        console.log("\tPlease enter valid genre option(s)!");
                        continue; // Reprompt for genre input
                    } else {
                        validGenreChoice = true;
                    }
                } else {
                    var genreNumbers = genreChoice.split(",");
                    var invalidGenre = false;
                    for (var i = 0; i < genreNumbers.length; i++) {
                        var choice = parseFloat(genreNumbers[i]);
                        if (isNaN(choice) || choice <= 0 || choice > movieGenre.length || genreNumbers[i].includes(".")) {
                            console.log("\tPlease enter valid genre option(s)!");
                            invalidGenre = true;
                            break;
                        }
                        //checks for dupliacted genre choice
                        var index = choice - 1;
                        var genre = movieGenre[index];
                        if (!selectedGenres.includes(genre)) {
                            selectedGenres.push(genre);
                        } else {
                            console.log("\tPlease enter valid genre option(s)!");
                            invalidGenre = true;
                            break;
                        }
                    }
                    if (invalidGenre) {
                        selectedGenres = []; // Clear selectedGenres array and reprompt for genre input
                        continue;
                    }
                }
            }

            //prompt user to add date
            var validReleaseDate = false;

            do {
                var releaseDate = input.question("\n\tPlease enter the movie's release date: ");
                // check for data validity using regex
                if (!this.onlyDate(releaseDate)) {
                    console.log("\tPlease enter a valid date!");
                } else {
                    validReleaseDate = true;
                }
            } while (!validReleaseDate);

            //prompt user to add running time
            var validRunningTime = false;

            while (!validRunningTime) {
                var runningTime = input.question("\n\tPlease enter the movie's running time (mins): ");
                // checks if running time is valid
                if (isNaN(runningTime) || !this.onlyMins(runningTime)) {
                    console.log("\tPlease enter valid running time!");
                } else {
                    validRunningTime = true;
                    //create a new movie object
                    var newMovie = {
                        name: newMovieName,
                        genre: selectedGenres,
                        releasedate: releaseDate,
                        runningtime: runningTime
                    };
                    this.newMovie(newMovie.name, newMovie.genre, newMovie.runningtime, newMovie.releasedate, newMovie.rating);
                    return newMovie;
                }
            }
            break;
        } while (true);
    }

    //  prompt user to add rating for selected movie
    addRating() {
        do {
            console.log("\n\tSelect the movie to add a rating:");
            for (var i = 0; i < this.movies.length; i++) {
                console.log("\t" + [i + 1] + ") " + this.movies[i].name);
            }
            console.log("\t" + [this.movies.length + 1] + ") Back to Main Menu");

            var selectedMovieInput = input.question("\t>> ");
            var selectedMovieIndex = parseInt(selectedMovieInput);

            if (selectedMovieInput.includes(".") || selectedMovieIndex < 1 || selectedMovieIndex > this.movies.length + 1) {
                console.log("\n\tKindly enter a valid input!\n");
            } else {
                if (selectedMovieIndex === this.movies.length + 1) {
                    // User selected "Go Back to Main Menu"
                    break;
                }

                var selectedMovie = this.movies[selectedMovieIndex - 1]; // access the selected movie

                // Initialize the rating if it's not present
                if (!selectedMovie.rating || !Array.isArray(selectedMovie.rating) || selectedMovie.rating.length !== 2) {
                    selectedMovie.rating = [0, 0]; // total rating, total voters
                }

                do {
                    var enterRating = input.question(`\n\tEnter your rating for "${selectedMovie.name}" (1 to 5 inclusive): `);
                    var rating = parseInt(enterRating);
                    // checks userinput validity
                    if (isNaN(rating) || rating < 1 || rating > 5 || this.onlySymbols(enterRating)) {
                        console.log("\n\tEnter a valid rating!");
                    } else {
                        selectedMovie.rating[1] += rating; // Add rating to the total rating
                        selectedMovie.rating[0] += 1; // Increment the number of voters
                        break;
                    }
                } while (true);
                break;
            }
        } while (true);
    }


    // display the lastest 3 movie
    lastest3movie() {
        // sort movie base on descending order of their release date
        var sortedMovies = this.movies.sort(function (a, b) {
            return new Date(b.releasedate) - new Date(a.releasedate);
        });

        var latestMovies = sortedMovies.slice(0, 3);

        console.log("\n\tThe lastest 3 movies are: ");
        for (var i = 0; i < latestMovies.length; i++) {
            console.log("\t" + [i + 1] + ") " + latestMovies[i].releasedate + " - " + latestMovies[i].name);
        }
    }


    //prints movie base on the genre selected
    filterByGenre() {
        var movieGenre = this.getGenres();
        do {
            console.log("\n\tPlease select a genre:");
            for (var i = 0; i < movieGenre.length; i++) {
                console.log("\t" + [i + 1] + ") " + movieGenre[i]);
            }

            var addGenre = input.question("\t>> ");
            var genreChoice = addGenre.trim();

            //checks genreChoice validity
            if (isNaN(genreChoice) || genreChoice.length !== 1) {
                console.log("\tPlease enter a valid genre input!");
            } else {
                var genreNumber = parseInt(genreChoice);

                if (genreNumber < 1 || genreNumber > movieGenre.length) {
                    console.log("\tPlease enter a valid genre input!");
                } else {
                    var selectedGenre = movieGenre[genreNumber - 1];
                    console.log(`\n\tYou have selected "${selectedGenre}" genre:`);

                    // Filter out movies with the selected genre
                    var filteredMovies = this.movies.filter(movie => {
                        return movie.genre.includes(selectedGenre);
                    });

                    // Print out the filtered movies
                    for (var i = 0; i < filteredMovies.length; i++) {
                        console.log("\t" + [i + 1] + ") " + filteredMovies[i].name);
                    }
                    break;
                }
            }
        } while (true);
    }

    // advanced feature
    // extract this.movie data to a csv file
    extractTOCSV() {
        //user to input file name
        var fileName = input.question("\n\tPlease enter a filename (default: moviedata.csv): ");
        //check validation for file name
        if (fileName == "") {
            fileName = "moviesdata";
        } else {
            fileName = fileName.toLowerCase();
        }

        // convert movies to csv format
        var csvData = [];
        const headers = Object.keys(this.movies[0]);
        csvData.push(headers.join(','));
        for (const row of this.movies) {
            const values = headers.map(header => {
                const val = row[header]
                return `"${val}`;
            });

            csvData.push(values.join(','));
        }
        csvData = csvData.join('\n');

        // create file
        try {
            fs.writeFileSync(`${fileName}.csv`, csvData);
            console.log(`\n\tMovie data has been extracted to ./${fileName}.csv!`);
        } catch (err) {
            // catches any errors found using the error object and handles it
            console.error("\n\tFailed to extract data:", err);
        };
    }

    // advanced feature
    // search movie by name
    searchMovieByName() {
        // user to input movie name
        var searchTerm = input.question("\nEnter movie name to search: ");
        // find movies that matches the search term
        var matchedMovies = this.movies.filter((movie) =>
            movie.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (matchedMovies.length == 0) {
            console.log("No matching movies found.");
        } else {
            // display movie details
            console.log(`Matching Movies for "${searchTerm}"`);
            matchedMovies.forEach((movie) => {
                console.log(movie.displayMovieDetails());
            });
        }
    }
}

module.exports = { Movie, MovieList };

