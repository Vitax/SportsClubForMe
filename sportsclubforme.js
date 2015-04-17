var app = angular.module('app', []);

app.service('geoDataService', ['$rootScope', function ($rootScope) {
    var searchValues = null;
    var clubObject = null;

    this.getClubData = function () {
        return searchValues;
    }

    this.setClubData = function (sportClubs) {
        searchValues = sportClubs;
        $rootScope.$broadcast('onUpdate');
    }

    this.getObject = function () {
        return clubObject;
    }

    this.setObject = function (clickedObject) {
        clubObject = clickedObject;
        $rootScope.$broadcast('objectClicked');
    }
}]);

app.controller('DataCtrl', ['$scope', '$http', 'geoDataService', function ($scope, $http, geoDataService) {

    $scope.searchCriteria = null;
    $scope.data = null;
    $scope.keys = {};
    $scope.optionValue =
    {
        option: 'Vereinssuche'
    },
    {
        option: 'Umgebungssuche'
    };

    $http({
        method: 'GET',
        url: "assets/data/SportClubForMe_Districts.json"
    }).success(function (data) {
        $scope.data = data;
    }).error(function (error) {
        console.log(error);
    });

    // function to check not useful data
    var checkData = function () {
        $scope.data.clubdata.forEach(function (entry) {
            if (entry.postcode == undefined || entry.address == undefined || entry.phonenumber == undefined
                || entry.mailaddress == undefined || entry.webpage == undefined || entry.latlng == undefined
                || entry.district == undefined) {
                console.log('Clubname: ' + entry.clubname);
                console.log('Clublink: ' + entry.clublink);
            }
        });
    }

    $scope.clickedObject = function (clickedObject) {
        geoDataService.setObject(clickedObject);
    }

    // String comparison tryouts
    //var stringComparison = function (a, b) {
    //    var cost = 0;
    //    if (a == b) return;
    //    var vectorA = [a.length];
    //    var vectorB = [b.length];
    //
    //    for (var i = 0; i < vectorA.length; i++) {
    //        for (var j = 0; j < vectorB.length;) {
    //            if (vectorA[i] != vectorB[j] && vectorA[i + 1] != vectorB[j]) {
    //                cost += 1;
    //            } else if (vectorA[i] == vectorB[j]) {
    //                j++;
    //            }
    //        }
    //    }
    //
    //    return cost;
    //}

    $scope.searchClub = function () {
        var s = $scope.searchCriteria.toLowerCase();

        if (s == '') {
            geoDataService.setClubData([]);
            return;
        }

        $scope.keys = {};
        $scope.data.clubdata.forEach(function (entry) {
                if (entry.clubname.toLowerCase().indexOf(s) > -1 || entry.district.toLowerCase().indexOf(s) > -1 || entry.postcode.toLowerCase().indexOf(s) > -1) {
                    $scope.keys[entry.clubname] = entry;
                }
            }
        );
        geoDataService.setClubData($scope.keys);
    }
}]);


app.controller('MapCtrl', ['$scope', '$http', 'geoDataService', function ($scope, $http, geoDataService) {

    $scope.$on('onUpdate', function () {
        $scope.clubResults = geoDataService.getClubData();

        initMarks();
    });

    $scope.$on('objectClicked', function () {
        $scope.clubObject = geoDataService.getObject();

        $scope.openMarkerForObject();
    });

    // variables
    var berlinLatLng = new google.maps.LatLng(52.50, 13.34);
    var currentLatLng = null;
    var mapCanvas = document.getElementById('mapCanvas');
    var marker = new google.maps.Marker();
    var markers = [];
    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: berlinLatLng,
        zoom: 10
    };

    var map = new google.maps.Map(mapCanvas, mapOptions);
    var clearMap = function (map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
        markers = [];
    }

    // change the position of the map when finding for objects
    var setMapCenter = function (results) {
        var numberOfValues = 0;

        var deltaLat = 0;
        var deltaLng = 0;
        var deltaLatLng = 0;

        angular.forEach(results, function (value) {
            numberOfValues++;
            deltaLat += value.position.lat;
            deltaLng += value.position.lng;
        });

        if (results != [] && deltaLat != 0 && deltaLng != 0) {
            deltaLatLng = new google.maps.LatLng((deltaLat / numberOfValues), (deltaLng / numberOfValues));
        } else {
            deltaLatLng = berlinLatLng;
        }

        map.panTo(deltaLatLng);
    }

    $scope.openMarkerForObject = function () {
        var objectLatLng = new google.maps.LatLng($scope.clubObject.position.lat, $scope.clubObject.position.lng);

        // content of each infoWindow
        var content =
            '<h1>' + $scope.clubObject.clubname + '</h1> <br>' +
            '<em>' + 'Anschrift : ' + $scope.clubObject.address + ', ' + '</em>' + '<em> ' + $scope.clubObject.postcode + '</em> <br>' +
            '<em>' + 'Telefon : ' + $scope.clubObject.phonenumber + '</em> </br> ' +
            '<em>' + 'EMail-Addresse : ' + $scope.clubObject.mailaddress + '</em> <br> ' +
            '<em>' + 'Webseite : ' + $scope.clubObject.webpage + '</em>';


        // create the infoWindow for the marker with its content
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });

        var marker = new google.maps.Marker({
            position: objectLatLng,
            map: map
        });

        // open the marker with its info
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(map, marker);
        });

        google.maps.event.trigger(marker, 'click');
    }

    //add marker to the map
    var initMarks = function () {

        clearMap(null);
        angular.forEach($scope.clubResults, function (value) {
            var clubLatLng = new google.maps.LatLng(value.position.lat, value.position.lng);

            // content of each infoWindow
            var content =
                '<h1>' + value.clubname + '</h1> <br>' +
                '<em>' + 'Anschrift : ' + value.address + ', ' + '</em>' + '<em> ' + value.postcode + '</em> <br>' +
                '<em>' + 'Telefon : ' + value.phonenumber + '</em> </br> ' +
                '<em>' + 'EMail-Addresse : ' + value.mailaddress + '</em> <br> ' +
                '<em>' + 'Webseite : ' + value.webpage + '</em>';

            marker = new google.maps.Marker({
                position: clubLatLng,
                map: map,
                title: value.clubname
            });

            markers.push(marker);

            // create the infoWindow for the marker with its content
            marker['infoWindow'] = new google.maps.InfoWindow({
                content: content
            });

            // open the marker with its info
            google.maps.event.addListener(marker, 'click', function () {
                this['infoWindow'].open(map, this);
            });
        });

        setMapCenter($scope.clubResults);
    }
}]);

