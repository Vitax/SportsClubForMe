var app = angular.module('app', []);

app.service('geoDataService', ['$rootScope', function ($rootScope) {
    var searchValues = null;
    var zoomValue = 10;

    this.get = function () {
        return searchValues;
    }

    this.set = function (sportClubs) {
        searchValues = sportClubs;
        $rootScope.$broadcast('onUpdate');
    }

    this.getZoom = function () {
        return zoomValue;
    }

    this.setZoom = function (value) {
        zoomValue = value;
        $rootScope.$broadcast('zoomChanged');
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
        url: "assets/data/SportClubForMe_Working.json"
    }).success(function (data) {
        $scope.data = data;
    }).error(function (error) {
        console.log(error);
    });

    // function to check not useful data
    var checkData = function () {
        $scope.data.clubdata.forEach(function (entry) {
            if (entry.postcode == undefined || entry.address == undefined || entry.phonenumber == undefined
                || entry.mailaddress == undefined || entry.webpage == undefined || entry.latlng == undefined) {
                console.log('Clubname: ' + entry.clubname);
                console.log('Clublink: ' + entry.clublink);
            }
        });
    }

    var levenshteinDistance = function (a, b) {
        if (a == b) return 0;
        if (a.length == 0) return b;
        if (b.length == 0) return a;

        var vector1 = [b.length + 1];
        var vector2 = [b.length + 1];
    }

    $scope.searchClub = function () {
        var s = $scope.searchCriteria.toLowerCase();

        // variables for the districts with their corresponding postcodes
        var charlottenburg_wilmersdorf = [10585, 10587, 10589, 10623, 10625, 10627, 10629, 10707, 10709, 10711, 10713, 10715,
            10717, 10719, 10777, 13627, 14050, 14052, 14053, 14055, 14057, 14059, 14193, 14197, 14199];
        var friedrichshain_kreuzberg = [10178, 10179, 10243, 10245, 10247, 10249, 10317, 10961, 10963, 10965, 10967, 10969, 10997,
            10999];
        var lichtenberg = [10315, 10317, 10318, 10319, 10365, 10367, 10369, 13051, 13053, 13055, 13057, 13059];
        var mitte = [10115, 10117, 10119, 10178, 10179, 10551, 10553, 10555, 10557, 10559, 10785, 10787, 13347, 13349, 13351,
            13353, 13355, 13357, 13359, 13407, 13409];
        var marzahn_hellersdorf = [12619, 12621, 12623, 12627, 12629, 12679, 12681, 12683, 12685, 12687, 12689];
        var neukoelln = [12043, 12045, 12047, 12049, 12051, 12053, 12055, 12057, 12059, 12347, 12349, 12351, 12353, 12355, 12357, 12359];
        var pankow = [10119, 10247, 10249, 10369, 10405, 10407, 10409, 10435, 10437, 10439, 13051, 13086, 13088, 13089, 13125,
            13127, 13129, 13156, 13158, 13159, 13187, 13189];
        var reinickendorf = [13403, 13405, 13407, 13409, 13435, 13437, 13439, 13465, 13467, 13469, 13503, 13505, 13507, 13509];
        var spandau = [13581, 13583, 13585, 13587, 13589, 13591, 13593, 13595, 13597, 13599, 13629, 14052, 14089];
        var steglitz_zehlendorf = [12157, 12161, 12163, 12165, 12167, 12169, 12203, 12205, 12207, 12209, 12247, 12249, 14109,
            14129, 14163, 14165, 14167, 14169, 14193, 14195];
        var tempelhof_schoeneberg = [10777, 10779, 10781, 10783, 10787, 10789, 10823, 10825, 10827, 10829, 12099, 12101, 12103,
            12105, 12107, 12109, 12157, 12159, 12161, 12169, 12249, 12277, 12279, 12305, 12307, 12309, 14197];
        var treptow_koepenick = [12435, 12437, 12439, 12459, 12487, 12489, 12524, 12526, 12527, 12555, 12557, 12559, 12587, 12589];


        if (s == '') {
            geoDataService.set([]);
            return;
        }

        var plz = 0;

        if (s == 'neukoelln') {
            for (var i = 0; i < neukoelln.length; i++) {
                plz = neukoelln[i];
            }
        }

        $scope.keys = {};
        $scope.data.clubdata.forEach(function (entry) {
            //switch (entry) {
            //    case s == 'charlottenburg' || s == 'wilmersdorf' && entry.postcode.indexOf(charlottenburg_wilmersdorf[i]) > -1:
            //        for (var i = 0; i < charlottenburg_wilmersdorf.length; i++) {
            //            $scope.keys[entry.postcode] = entry;
            //        }
            //    case s == 'kreuzberg' || s == 'friedrichshain' && entry.postcode.indexOf(friedrichshain_kreuzberg[i]) > -1:
            //        for (var i = 0; i < friedrichshain_kreuzberg.length; i++) {
            //            $scope.keys[entry.postcode] = entry;
            //        }
            //}

            if (s == 'charlottenburg' || s == 'wilmersdorf') {
                for (var i = 0; i < charlottenburg_wilmersdorf.length; i++) {
                    if (entry.postcode.indexOf(charlottenburg_wilmersdorf[i]) > -1) {
                        $scope.keys[entry.postcode] = entry;
                    }
                }
            } else if (s == 'kreuzberg' || s == 'friedrichshain') {
                for (var i = 0; i < friedrichshain_kreuzberg.length; i++) {
                    if (entry.postcode.indexOf(friedrichshain_kreuzberg[i]) > -1) {
                        $scope.keys[entry.postcode] = entry;
                    }
                }
            } else if (s == 'lichtenberg') {
                for (var i = 0; i < lichtenberg.length; i++) {
                    if (entry.postcode.indexOf(lichtenberg[i]) > -1) {
                        $scope.keys[entry.postcode] = entry;
                    }
                }
            } else if (s == 'mitte') {
                for (var i = 0; i < mitte.length; i++) {
                    if (entry.postcode.indexOf(mitte[i]) > -1) {
                        $scope.keys[entry.postcode] = entry;
                    }
                }
            } else if (s == 'marzahn' || s == 'hellersdorf') {
                for (var i = 0; i < marzahn_hellersdorf.length; i++) {
                    if (entry.postcode.indexOf(marzahn_hellersdorf[i]) > -1) {
                        $scope.keys[entry.postcode] = entry;
                    }
                }
            } else if (s == 'neukoelln' || s == 'neuk\u00f6lln') {
                for (var i = 0; i < neukoelln.length; i++) {
                    if (entry.postcode.indexOf(neukoelln[i]) > -1) {
                        $scope.keys[entry.postcode] = entry;
                    }
                }
            } else if (entry.clubname.toLowerCase().indexOf(s) > -1 || entry.postcode.indexOf(s) > -1) {
                $scope.keys[entry.postcode] = entry;
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
    var zoomValue = geoDataService.getZoom();

    var mapOptions = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: berlinLatLng,
        zoom: zoomValue
    };

    var map = new google.maps.Map(mapCanvas, mapOptions);

    var markers = [];
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


    //add marker to the map
    var initMarks = function () {
        var marker = new google.maps.Marker();

        clearMap(null);
        angular.forEach($scope.clubResults, function (value) {
            var clubLatLng = new google.maps.LatLng(value.position.lat, value.position.lng);

            // content of each infoWindow
            var content =
                '<h1>' + value.clubname + '</h1> <br>' +
                '<em>' + 'Anschrift : ' + value.address + ', ' + '</em>' + '<em> ' + value.postcode + '</em> <br>' +
                '<em> ' + 'Telefon : ' + value.phonenumber + '</em> </br> ' +
                '<em> ' + 'EMail-Addresse : ' + value.mailaddress + '</em> <br> ' +
                '<em> ' + 'Webseite : ' + value.webpage + '</em> ';

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

