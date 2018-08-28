
actorApp.factory("movieService", function ($http, $log, $q, $timeout, min2HourStr) {

    var API_KEY = "bce8cf411be52423d49e88adaa634d4a";

    function Movie(id, name, tmdbID, length, actors, director, poster, imdbUrl, description) {
        this.id = id;
        this.name = name;
        this.tmdbID = tmdbID;
        this.length = min2HourStr.convMin2HourStr(length); //toString();
        this.actors = actors
        this.director = director;
        this.imgUrl = "https://image.tmdb.org/t/p/w200/" + poster;
        this.imdbUrl = "https://www.imdb.com/title/" + imdbUrl;
        this.text = description;
    }

    var moviesArr = [];

    function addMovie(id, needToPost) {

        var theUrl = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" +
            API_KEY + "&append_to_response=credits";
        var async = $q.defer();

        $http.get(theUrl).then(function (response) {
            var actors = [];
            var director = "";
            var actorNum = (response.data.credits.cast.length > 5) ? 5 : response.data.credits.cast.length;

            for (var i = 0; i < actorNum; i++) {
                actors.push(response.data.credits.cast[i].name);
            }

            for (var i = 0; i < response.data.credits.crew.length; i++) {
                if (response.data.credits.crew[i].job === "Director")
                    director = response.data.credits.crew[i].name;
            }

            var index = getMovieByTmdbID(response.data.id);
            if (index)
            {
                moviesArr[index].name = response.data.title;
                moviesArr[index].tmdbID = response.data.id;
                moviesArr[index].length = min2HourStr.convMin2HourStr(response.data.runtime); //toString();
                moviesArr[index].actors = actors
                moviesArr[index].director = director;
                moviesArr[index].imgUrl = "https://image.tmdb.org/t/p/w200/" + response.data.poster_path;
                moviesArr[index].imdbUrl = "https://www.imdb.com/title/" + response.data.imdb_id;
                moviesArr[index].text = response.data.overview;
            }
            else
            {
                var aMovie = new Movie(0, response.data.title,
                    response.data.id,
                    response.data.runtime,
                    actors,
                    director,
                    response.data.poster_path,
                    response.data.imdb_id,
                    response.data.overview);

                moviesArr.unshift(aMovie);
                index = 0;
            }     

            if ((needToPost) && (moviesArr[index].id === 0)) {
                var json = { name: response.data.title, 
                             tmdbID: response.data.id,
                             runtime: response.data.runtime,
                             actors: actors,
                             director: director,
                             poster_path: response.data.poster_path,
                             imdbID: response.data.imdb_id,
                             text: response.data.overview};

                $http.post("https://json-server-heroku-duiintdxyn.now.sh/movies",
                    json)
                    .then(function (success) {
                        // console.log(success);
                        var index = getMovieByTmdbID(success.data.tmdbID);
                        if (index >= 0)
                        {
                            moviesArr[index].id = success.data.id;
                        }
                        else
                        {
                            //unexpected!
                            console.log("failed to add  " + response.data.title);
                        }
                    },
                        function (err) {
                            console.log("failed to post " + response.data.title);
                        })
            }
            async.resolve(moviesArr);

        }, function (error) {
            $log.log(error);
            async.reject("failed to get movie info");
        })
        return async.promise;
    }


    function loadMovies() {
        var async = $q.defer();

        moviesArr.length = 0;

        $http.get("https://json-server-heroku-duiintdxyn.now.sh/movies").then(function (response) {
            //console.log(JSON.stringify(response));
            var dataArr = response["data"];

            for (var i = 0; i < dataArr.length; i++) {
                $timeout(
                    addMovie(dataArr[i].tmdbID, false),
                    (300 + i * 100));

                // var aMovie = new Movie(dataArr[i].id, 
                //     dataArr[i].name,
                //     dataArr[i].tmdbID,
                //     dataArr[i].runtime,
                //     dataArr[i].actors,
                //     dataArr[i].director,
                //     dataArr[i].poster_path,
                //     dataArr[i].imdb_id,
                //     dataArr[i].text);

                // moviesArr.unshift(aMovie);
            }
            async.resolve(moviesArr);
        }, function (error) {
            $log.error(JSON.stringify(error));
            async.reject("failed to load movies.json");
        });

        return async.promise;
    }


    function serachMovie(searchStr, listItems) {
        var theUrl = "https://api.themoviedb.org/3/search/movie?api_key=" +
            API_KEY + "&language=en-US&query=" + searchStr + "&page=1&include_adult=false";
        var async = $q.defer();

        if (searchStr) {
            $http.get(theUrl).then(function (response) {
                for (var i = 0; i < response.data.results.length; i++) {
                    listItems[response.data.results[i].title] = response.data.results[i].id;
                }
                async.resolve(listItems);
            }, function (error) {
                $log.log(error);
                async.reject("failed to get movie info");
            })
        }
        else {
            listItems = {};
        }

        return async.promise;
    }

    function getMovieByTmdbID(tmdbID) {
        for (var i = 0; i < moviesArr.length; i++) {
            if (tmdbID === moviesArr[i].tmdbID)
                return i;
        }

        return undefined;
    }

    function getMovieDetails(id, movieDetails) {
        var detailsUrl = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" +
            API_KEY + "&language=en-US";
        var creditsUrl = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" +
            API_KEY + "&append_to_response=credits";
        var async = $q.defer();
        // var moviesArr[];

        //var savedDetails = getMovieByID(id);

        var premises = [];
        premises.push($http.get(detailsUrl));
        premises.push($http.get(creditsUrl));

        Promise.all(premises).then(function (response) {
            var actors = [];
            var director = "";
            var actorNum = (response[1].data.credits.cast.length > 5) ? 5 : response[1].data.credits.cast.length;

            for (var i = 0; i < actorNum; i++) {
                actors.push(response[1].data.credits.cast[i].name);
            }

            for (var i = 0; i < response[1].data.credits.crew.length; i++) {
                if (response[1].data.credits.crew[i].job === "Director")
                    director = response[1].data.credits.crew[i].name;
            }

            movieDetails["name"] = response[0].data.title;
            movieDetails["release_date"] = response[0].data.release_date;
            movieDetails["imageUrl"] = "https://image.tmdb.org/t/p/w400" + response[0].data.poster_path;
            movieDetails["actors"] = actors;
            movieDetails["director"] = director;
            movieDetails["length"] = min2HourStr.convMin2HourStr(response[1].data.runtime); //toString();
            movieDetails["imdbURL"] = "https://www.imdb.com/title/" + response[0].data.imdb_id;
            movieDetails["genre"] = response[0].data.genres[0].name;
            movieDetails["popularity"] = response[0].data.popularity;
            movieDetails["overview"] = response[0].data.overview;

            async.resolve(movieDetails);
        }, function (error) {
            $log.log(error);
            async.reject("failed to get movie info");
        });
        return async.promise;
    }

    function getMoviesArr() {
        return moviesArr;
    }

    function deleteMovie(movie) {
        var async = $q.defer();

        if (movie.id != undefined) {
            var theUrl = "https://json-server-heroku-duiintdxyn.now.sh/movies/" + movie.id;

            $http.delete(theUrl).then(function (response) {
                //console.log(JSON.stringify(response));
                var index = moviesArr.indexOf(movie);
                if (index > -1) {
                    moviesArr.splice(index, 1);
                }
                async.resolve(moviesArr);
            }, function (error) {
                $log.error(JSON.stringify(error));
                async.reject("failed to delete " + movie.name);
            });
        }
        else {
            $log.error("Movie " + movie.name + " id is undefined");
            async.reject("failed to delete " + movie.name);
        }

        return async.promise;
    }

    return {
        addMovie: addMovie,
        serachMovie: serachMovie,
        getMovieDetails: getMovieDetails,
        getMoviesArr: getMoviesArr,
        loadMovies: loadMovies,
        deleteMovie: deleteMovie
    };
});