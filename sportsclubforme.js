var app = angular.module('app', []);

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

app.controller('ClubData', ['$scope', '$http', 'geoDataService', function ($scope, $http, geoDataService) {

    $scope.searchCriteria = null;
    $scope.data = null;
    $scope.keys = {};

    $http({
        method: 'GET',
        url: "assets/data/SportClubForMe_Working.json"
    }).success(function (data) {
        $scope.data = data;
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
        var s = $scope.searchCriteria.toLowerCase();
        if (s == '') {
            geoDataService.set([]);
            return;
        }

        $scope.keys = {};
        $scope.data.clubdata.forEach(function (entry) {
            if (entry.clubname.toLowerCase().indexOf(s) > -1 || entry.postcode.indexOf(s) > -1) {
                $scope.keys[entry.clubname] = entry;
            }
        });
        geoDataService.set($scope.keys);
    }

}]);


app.controller('MapCtrl', ['$scope', '$http', 'geoDataService', function ($scope, $http, geoDataService) {

    $scope.$on('onUpdate', function () {
        $scope.clubResults = geoDataService.get();

        initMarks();
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

    var markers = [];
    var setAllMap = function (map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
        markers = [];
    }

    //add marker to the map
    var initMarks = function () {
        setAllMap(null);
        var deltaLat = 0;
        var deltaLng = 0;

        angular.forEach($scope.clubResults, function (value, key) {
            deltaLat += value.position.lat;
            deltaLng += value.position.lng;
        });

        angular.forEach($scope.clubResults, function (value, key) {
            var clubLatLng = new google.maps.LatLng(value.position.lat,
                value.position.lng);

            var marker = new google.maps.Marker({
                position: clubLatLng,
                map: map
            });

            markers.push(marker);
        });
    }
}]);

