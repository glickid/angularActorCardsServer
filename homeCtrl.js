actorApp.controller("homeCtrl", function ($scope, $location) {

    $scope.gotoActresses = function ()
    {
        $location.path('/actresses')
    }

    $scope.gotoMovies = function ()
    {
        $location.path('/moviesgallery')
    }
});