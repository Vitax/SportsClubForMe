var app = angular.module('app', []);

app.service('dataService', ['$rootScope', function ($rootScope) {
    var data = null;

    this.get = function () {
        return data;
    }

    this.set = function (value) {
        data = value;
        $rootScope.$broadcast('onData');
    }
}]);

app.service('geoDataService', ['$rootScope', function ($rootScope) {
    var searchValues = null;

    this.get = function () {
        return searchValues;
    }

    this.set = function (sportClubs) {
        searchValues = sportClubs;
        $rootScope.$broadcast('onUpdate');
    }
}]);

app.controller('ClubData', ['$scope', '$http', 'dataService', 'geoDataService', function ($scope, $http, dataService, geoDataService) {

    $scope.data = null;
    $scope.searchCriteria = null;
    $scope.results = {};

    $http({
        method: 'GET',
        url: "assets/data/SportClubForMe_Working.json"
    }).success(function (data) {
        $scope.data = data;
        dataService.set($scope.data);
    }).error(function (error) {
        console.log(error);
    });

    // function to check not useful data
    $scope.checkData = function () {
        $scope.data.clubdata.forEach(function (entry) {
            if (entry.postcode == undefined || entry.address == undefined || entry.phonenumber == undefined
                || entry.mailaddress == undefined || entry.webpage == undefined || entry.latlng == undefined) {
                console.log('Clubname: ' + entry.clubname);
                console.log('Clublink: ' + entry.clublink);
            }
        });
    }

    $scope.searchClub = function () {
        //$scope.results = {};

        var s = $scope.searchCriteria.toLowerCase();

        $scope.data.clubdata.forEach(function (entry) {
            if (entry.clubname.toLowerCase().indexOf(s) > -1 || entry.postcode.indexOf(s) > -1) {
                var keys = Object.keys($scope.results);

                if (keys.indexOf(entry.clubname) > -1 || keys.indexOf(entry.postcode) > -1) {
                    $scope.results[entry.clubname].push(entry);
                } else {
                    $scope.results[entry.clubname] = [entry];
                }

                geoDataService.set($scope.results);

                // push values of the jason without sorting
                //$scope.results.push(entry);
            }
        });
        //display the $result array in the console
        //console.log($scope.results);
    }
}]);


app.controller('MapCtrl', ['$scope', '$http', 'dataService', 'geoDataService', function ($scope, $http, dataService, geoDataService) {


    //$scope.$on('onData', function () {
    //    $scope.cloneData = dataService.get();
    //
    //    $scope.initMarks();
    //});

    $scope.$on('onUpdate', function () {
        $scope.clubResults = geoDataService.get();

        $scope.initMarks();
    });

    var berlinLatLng = new google.maps.LatLng(52.50, 13.34);
    var mapCanvas = document.getElementById('mapCanvas');

    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: berlinLatLng,
        zoom: 10
    };

    var map = new google.maps.Map(mapCanvas, mapOptions);

    var contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading">Stuff</h1>'


    $scope.infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    //add marker to the map
    $scope.initMarks = function () {

        angular.forEach($scope.clubResults, function (value, key) {
            for (var i = 0; i < value.length; i++) {
                var clubLatLng = new google.maps.LatLng(value[i].position.lat,
                    value[i].position.lng);

                var marker = new google.maps.Marker({
                    position: clubLatLng,
                    map: map
                });
            }
        });
    }

    var deleteMarker = function (value) {
        var marker = value;

        marker.setMap(null);
    }
}]);

