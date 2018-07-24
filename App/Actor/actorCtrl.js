
actorApp.controller("actorCtrl", function ($scope, actorService) {
    $scope.aFilter = "";
    $scope.propName = "";
    $scope.reverse = false;
    $scope.fields = { "First Name": "fname", "Last Name": "lname", "Birth Date": "bday" , "Last Added":"-addedAt"};

    function populateActors() {

        actorService.loadActors().then(function (success) {
            //do_nothing
        }, function (error) {
            console.log(error)
        });
    }

    populateActors();
    $scope.actorArr = actorService.getActorArr();

    //filter a spcific actor on the view
    $scope.actorFilter = function (actor) {
        var lowerFname = actor.fname.toLowerCase();
        var lowerLname = actor.lname.toLowerCase();
        if (lowerFname.includes($scope.aFilter) || lowerLname.includes($scope.aFilter) ||
            actor.fname.includes($scope.aFilter) || actor.lname.includes($scope.aFilter)) {
            return true;
        }
        else {
            return false;
        }
    }

    //order gallery 
    $scope.changeOrderBy = function (prop) {
        if ($scope.propName === prop) {
            $scope.reverse = !($scope.reverse);
        } else {
            $scope.reverse = false;
            $scope.propName = prop;
        }
    }

//$scope.changeOrderBy($scope.selectedName);
    $scope.changeOrderBy('-addedAt');
    $scope.chosenActor = "";


    $scope.updateOverClass = function (actor) {
        $scope.chosenActor = actor;
    }
    $scope.updateMouseLeave = function (actor) {
        $scope.chosenActor = actor;
    }

    $scope.actressList = {};

    $scope.searchActress = function (input) {
        //start search only after 3 charachters of input
        if (input.length > 2) {
            $scope.actressList = {};

            actorService.searchActress(input, $scope.actressList).then(function (success) {
                //do_nothing
            }, function (error) {
                $log.error(error);
                $scope.actressList = {};
            });
        }
        else {
            $scope.actressList = {};
        }
    }

    $scope.addActress = function (id) {
        actorService.addActress(id).then(function (actorArr) {
            $scope.actorArr = actorArr;
            $scope.actressList = {};
            $scope.input = "";
            $scope.changeOrderBy('-addedAt');
        }, function (error) {
            console.log("error")
        });
    }
});