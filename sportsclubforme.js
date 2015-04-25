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
    var contains = false;
    $http({
        method: 'GET',
        url: "assets/data/SportClubForMe_Districts.json"
    }).success(function (data) {
        $scope.data = data;
    }).error(function (error) {
        console.log(error);
    });

    // function to check not useful data
    /*var checkData = function () {
     $scope.data.clubdata.forEach(function (entry) {
     if (entry.postcode == undefined || entry.address == undefined || entry.phonenumber == undefined
     || entry.mailaddress == undefined || entry.webpage == undefined || entry.latlng == undefined
     || entry.district == undefined) {
     console.log('Clubname: ' + entry.clubname);
     console.log('Clublink: ' + entry.clublink);
     }
     });
     }*/

    $scope.clickedObject = function (clickedObject) {
        geoDataService.setObject(clickedObject);
    }

    $scope.searchClub = function () {
        var s = $scope.searchCriteria.toLowerCase();

        if (s == '') {
            geoDataService.setClubData(null);
            return;
        }

        $scope.keys = {};
        contains = false;
        $scope.data.clubdata.forEach(function (entry) {
                if (entry.clubname.toLowerCase().indexOf(s) > -1 || entry.district.toLowerCase().indexOf(s) > -1 || entry.postcode.toLowerCase().indexOf(s) > -1) {
                    $scope.keys[entry.clubname] = entry;
                    contains = true;
                }
            }
        );
        if (contains == true) {
            geoDataService.setClubData($scope.keys);
        } else {
            geoDataService.setClubData(null);
        }
    }
}]);


app.controller('MapCtrl', ['$scope', '$http', 'geoDataService', function ($scope, $http, geoDataService) {

    $scope.$on('onUpdate', function () {
        $scope.clubResults = geoDataService.getClubData();

        if ($scope.clubResults == null) {
            clearMap(null);
            resetMap();
        } else {
            initMarks();
        }
    });

    $scope.$on('objectClicked', function () {
        $scope.clubObject = geoDataService.getObject();

        $scope.openMarkerForObject(valueMarker);
    });

    // variables
    var berlinLatLng = new google.maps.LatLng(52.50, 13.34);
    var mapCanvas = document.getElementById('mapCanvas');
    var marker = new google.maps.Marker();
    var markers = [];

    // variable with the initial map options
    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: berlinLatLng,
        zoom: 10
    };

    var map = new google.maps.Map(mapCanvas, mapOptions);
    var clearMap = function (markerOnMap) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(markerOnMap);
        }
        markers = [];
    }

    // change the position of the map when finding for objects
    var changeBounds = function (results) {
        var latLngBounds = new google.maps.LatLngBounds();

        for (var i = 0; i < results.length; i++) {
            latLngBounds.extend(results[i].getPosition());
        }

        map.fitBounds(latLngBounds);
    }

    var valueMarker = {};

    var resetMap = function () {
        map.panTo(berlinLatLng);
        map.setZoom(10);
    }

    //add marker to the map
    var initMarks = function () {
        // boolean to check if a infoWindow is open
        var openInfoWindow = false;

        clearMap(null);

        angular.forEach($scope.clubResults, function (value) {
            var clubLatLng = new google.maps.LatLng(value.position.lat, value.position.lng);

            // content of each infoWindow
            var content =
                ' <p style=" font-size: 1.2em"> <strong>' + value.clubname + '</p> </strong>' +
                '<em>' + 'Anschrift : ' + value.address + ', ' + '</em>' + '<em> ' + value.postcode + '</em> <br>' +
                '<em>' + 'Telefon : ' + value.phonenumber + '</em> </br> ' +
                '<em>' + 'EMail-Addresse : ' + value.mailaddress + '</em> <br> ' +
                '<em>' + 'Webseite : ' + value.webpage + '</em>';

            // single marker with its content
            marker = new google.maps.Marker({
                position: clubLatLng,
                map: map,
                title: value.clubname
            });

            // create the infoWindow for the marker with its content
            marker['infoWindow'] = new google.maps.InfoWindow({
                content: content
            });

            // push all the marker into the markers array to handle them
            markers.push(marker);

            // create a key value array containing the club name as a key and the marker as a value
            valueMarker[value.clubname] = marker;

            // open the marker with its info
            google.maps.event.addListener(marker, 'click', function () {
                if (openInfoWindow) {
                    openInfoWindow.close();

                }

                this['infoWindow'].open(map, this);
                // variable to see if a window is already open
                openInfoWindow = this['infoWindow'];
            });
        });

        changeBounds(markers);
    }

    $scope.openMarkerForObject = function (valueMarkerArray) {
        angular.forEach(valueMarkerArray, function (value, key) {
            if (key == $scope.clubObject.clubname) {
                // trigger the marker corresponding to the html object
                google.maps.event.trigger(value, 'click');
            }
        });
    }
}]);

