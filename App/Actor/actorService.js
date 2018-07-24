
actorApp.factory("actorService", function ($http, $log, $q, $timeout) {

    var actorArr = [];

    var API_KEY = "bce8cf411be52423d49e88adaa634d4a";

    function Actor(fname, lname, bday, imageUrl, imdbUrl, text) {
        this.fname = fname;
        this.lname = lname
        this.bday = new Date(bday);
        this.imgUrl = (imageUrl) ? ((imageUrl[0] === 'h') ? imageUrl : "https://image.tmdb.org/t/p/w200" + imageUrl) : "";
        this.imdbUrl = (imdbUrl) ? ((imdbUrl[0] === 'h') ? imdbUrl : "https://www.imdb.com/title/" + imdbUrl) : "";
        this.text = text;
        this.addedAt = new Date().getTime() / 1000;
    }

    function loadActors() {
        var async = $q.defer();
        
        actorArr.splice(0, actorArr.length);

        $http.get("https://json-server-heroku-sosqnwwrnt.now.sh/actors").then(function (response) {
            //console.log(JSON.stringify(response));
            var dataArr = response["data"];
            for (var i = 0; i < dataArr.length; i++) {

                var actor_t = new Actor(dataArr[i].fname,
                    dataArr[i].lname,
                    dataArr[i].bday,
                    dataArr[i].imageUrl,
                    dataArr[i].imdbUrl,
                    dataArr[i].text);

                actorArr.unshift(actor_t);
                async.resolve(actorArr);
                // console.log(dataArr[i]);
            }
        }, function (error) {
            $log.error(JSON.stringify(error));
            async.reject("failed to load actor.json");
        });

        return async.promise;
    }

    function getActorArr () {
        return actorArr;
    }

    function addActress(id) {

        var detailsUrl = " https://api.themoviedb.org/3/person/" + id + "?api_key=" + API_KEY + "&language=en-US";
        var async = $q.defer();

        $http.get(detailsUrl).then(function (response1) {
            var nameSplit = response1.data.name.split(" ");
            var bioSplit = response1.data.biography.split(".");

            var actress = new Actor((nameSplit.length > 2) ? nameSplit[0] + " " + nameSplit[1] : nameSplit[0],
                (nameSplit.length > 2) ? nameSplit[2] : nameSplit[1],
                response1.data.birthday,
                response1.data.profile_path,
                response1.data.imdb_id,
                (bioSplit.length > 2) ? bioSplit[0] + ". " + bioSplit[1] : response1.data.biography);

            actorArr.unshift(actress);

            var json = {fname: actress.fname, lname:actress.lname, bday:actress.bday,
                        imageUrl:actress.imgUrl, imdbUrl:actress.imdbUrl, text:actress.text};

            $http.post("https://json-server-heroku-sosqnwwrnt.now.sh/actors",
                        json)
                .then (function(success) {
                    console.log(success)
                }, function(err){
                    console.log(err);
                })
                
            async.resolve(actorArr);

        }, function (error) {
            $log.error(error);
            async.reject("failed to actor info");
        });

        return async.promise;
    }


    function searchActress(searchStr, actressList) {

        var namesUrl = "https://api.themoviedb.org/3/search/person?api_key=" + API_KEY +
            "&language=en-US&query=" + searchStr + "&page=1&include_adult=false"
        var async = $q.defer();

        $http.get(namesUrl).then(function (response) {
            for (i = 0; i < response.data.results.length; i++) {
                var actorId = response.data.results[i].id;

                $timeout(function (actorId) {
                    var detailsUrl = " https://api.themoviedb.org/3/person/" + actorId + "?api_key=" + API_KEY + "&language=en-US";
                    $http.get(detailsUrl).then(function (response1) {
                        if (response1.data.gender === 1) {
                            actressList[response1.data.name] = response1.data.id;
                            async.resolve(actressList);
                        }
                    }, function (error) {
                        $log.log(error);
                    })
                }, (50 * i + 20), [], actorId);
            }
        }, function (error) {
            $log.log(error);
            actressList = {};
            async.reject("failed to get actress info");
        })

        return async.promise;
    }

    return {
        loadActors: loadActors,
        getActorArr : getActorArr,
        addActress: addActress,
        searchActress: searchActress
    };
});