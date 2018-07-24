
actorApp.controller("moviesCtrl", function ($scope, $location, movieService) {

   // $scope.moviesArr = [];
    $scope.listItems = {};

    movieService.loadMovies();
    
    $scope.moviesArr = movieService.getMoviesArr();

    $scope.updateSearch = function (searchStr) {

        $scope.listItems = {};

        if (searchStr) {
            movieService.serachMovie(searchStr, $scope.listItems).then(function (success) {
                //do_nothing                    
            }, function (error) {
                console.log(error);
            })
        }
    }

    $scope.addMovie = function (id) {

        if (id != 0) {
            $scope.listItems = {};

            movieService.addMovie(id, true).then(function (success) {
                $scope.moviesArr = success;
                $scope.aFilter = "";
            }, function (error) {
                console.log(error);
            })
        }
    }

    $scope.showMovieDetails = function (tmdbID) {
        $location.path("/movies/" + tmdbID);
    }
});