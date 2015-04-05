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
        url: "assets/data/SportClubForMe_Data_Copy.json"
    })
        .success(function (data) {
            $scope.data = data;
            dataService.set($scope.data);
        })
        .error(function (error) {
            console.log(error);
        });

    // function to check not useful data
    $scope.checkData = function () {
        $scope.data.clubdata.forEach(function (entry) {
            if (entry.postcode == undefined || entry.address == undefined || entry.phonenumber == undefined
                || entry.mailaddress == undefined || entry.webpage == undefined) {
                console.log('Clubname: ' + entry.clubname);
                console.log('Clublink: ' + entry.clublink);
            }
        });
    }

    $scope.searchClub = function () {
        $scope.results = {};

        var s = $scope.searchCriteria.toLowerCase();

        $scope.data.clubdata.forEach(function (entry) {
            if (entry.clubname.toLowerCase().indexOf(s) > -1 || entry.postcode.indexOf(s) > -1) {
                var keys = Object.keys($scope.results);

                if (keys.indexOf(entry.clubname) > -1 || keys.indexOf(entry.postcode) > -1) {
                    $scope.results[entry.clubname].push(entry);
                } else {
                    $scope.results[entry.clubname] = [entry];
                }
                // push values of the jason without sorting
                //$scope.results.push(entry);
            }
        });
        //display the $result array in the console
        //console.log($scope.results);
    }
}]);


app.controller('MapCtrl', ['$scope', '$http', 'dataService', function ($scope, $http, dataService) {

    var berlinLatLng = new google.maps.LatLng(52.50, 13.34);
    var mapCanvas = document.getElementById('mapCanvas');

    $scope.geoCodes = [];
    $scope.marks = [];


    $scope.$on('onData', function () {
        var cloneData = dataService.get();

        cloneData.clubdata.forEach(function (entry) {
            $scope.marks.push(entry.address + ', ' + entry.postcode);
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

        $scope.geoCode = {};

        var geocoder = new google.maps.Geocoder();

        for (var i = 1; i < $scope.marks.length; i++) {

            geocoder.geocode({'address': $scope.marks[i]}, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {

                    //add marker to the map
                    for (var i = 0; i < results.length; i++) {
                        $scope.geoCode = ",geocode:" + '"' + results[i].geometry.location + '"';

                        //var marker = new google.maps.Marker({
                        //    map: map,
                        //    position: results[i].geometry.location
                        //});
                    }
                }
            });
        }
    }
}]);


