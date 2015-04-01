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

app.controller('ClubData', ['$scope', '$http', 'dataService', function ($scope, $http, dataService) {

    $scope.data = null;
    $scope.searchCriteria = null;
    $scope.results = {};

    $http({
        method: 'GET',
        url: "assets/data/Marzahn-Hellersdorf/Marzahn-Hellersdorf.json"
    }).success(function (data) {
        $scope.data = data;
        dataService.set($scope.data);
    }).error(function (error) {
        console.log(error);
    });


    $scope.search = function () {
        $scope.results = {};

        var s = $scope.searchCriteria.toLowerCase();

        $scope.data.index.forEach(function (entry) {
            if (entry.angebote.toLowerCase().indexOf(s) > -1 || entry.plz.indexOf(s) > -1) {

                var keys = Object.keys($scope.results);

                if (keys.indexOf(entry.angebote) > -1 || keys.indexOf(entry.plz) > -1) {
                    $scope.results[entry.angebote].push(entry);
                } else {
                    $scope.results[entry.angebote] = [entry];
                }
                // push values of the jason without sorting
                //$scope.results.push(entry);
            }
        });
        //display the $result array in the console
        //console.log($scope.results);
    }
}]);


app.controller('MapCtrl', ['$scope', 'dataService', function ($scope, dataService) {

    var berlinLatLng = new google.maps.LatLng(52.50, 13.34);
    var mapCanvas = document.getElementById('mapCanvas');

    $scope.geoCodes = [];
    $scope.marks = [];

    $scope.$on('onData', function () {
        var cloneData = dataService.get();

        cloneData.index.forEach(function (entry) {
            $scope.marks.push(entry.anschrift + ', ' + entry.plz);
        });

        initMarks();
    });

    var mapOptions = {
        disableDefaultUI: true,
        center: berlinLatLng,
        zoom: 10
    };

    var map = new google.maps.Map(mapCanvas, mapOptions);


    function initMarks() {

        var geocoder = new google.maps.Geocoder();

        for (var i = 1; i < $scope.marks.length; i++) {

            geocoder.geocode({'address': $scope.marks[i]}, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {

                    //add marker to the map
                    for (var i = 0; i < results.length; i++) {
                        console.log(results[i].geometry.location);

                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[i].geometry.location
                        });
                    }
                } else {
                    console.log("Geocode for " + address + " was not successful for the following reason: " + status);
                }
            });
            //console.log('Addresse: ' + $scope.marks[i]);
        }
    }
}]);

