
actorApp.controller('movieDetailsCtrl', function ($log, $scope, $routeParams, movieService) {

    var movieDetails = {};
    $scope.name = "";
        $scope.image = "";
        $scope.rDate = "";
        $scope.length = 0;
        $scope.actors = [];
        $scope.imdbUrl = "";
        $scope.dirctor = "";
        $scope.description = "";
        $scope.genre = "";
        $scope.popularity = 0;

    movieService.getMovieDetails($routeParams.movieID, movieDetails).then(function(response) {

        $scope.name = movieDetails["name"];
        $scope.image = movieDetails["imageUrl"];
        $scope.rDate = movieDetails["release_date"];
        $scope.length = movieDetails["length"];
        $scope.actors =  movieDetails["actors"];
        $scope.imdbUrl = movieDetails["imdbURL"];
        $scope.director = movieDetails["director"];
        $scope.description = movieDetails["overview"];
        $scope.genre =  movieDetails["genre"];
        $scope.popularity = movieDetails["popularity"];

    }, function(error){
        $log.log(error);
    })
});