var app = angular.module('app', []);

app.service('dataService', function () {
    var data = null;

    return {
        setData: function (value) {
            data = value;
        }, getData: function () {
            return data;
        }
    }
});

app.controller('ClubData', ['$scope', '$http', 'dataService', function ($scope, $http, dataService) {

    $scope.data = undefined;
    $scope.searchCriteria = undefined;
    $scope.results = {};

    $http({
        method: 'GET',
        url: "assets/data/Marzahn-Hellersdorf/Marzahn-Hellersdorf.json"
    }).success(function (data) {
        $scope.data = data;
        dataService.setData($scope.data);
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
    var cloneData = dataService.getData();
    var marks = [];

    cloneData.index.forEach(function (entry) {
        marks.push(entry.anschrift);
    });

    var mapOptions = {
        disableDefaultUI: true,
        center: berlinLatLng,
        zoom: 10
    };

    $scope.map = new google.maps.Map(mapCanvas, mapOptions);
}]);

