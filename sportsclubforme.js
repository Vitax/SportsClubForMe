var app = angular.module('app', []);

app.controller('ClubData', ['$scope', '$http', function ($scope, $http) {

    $scope.data = null;
    $scope.searchCriteria = null;
    $scope.results = {};

    $http({
        method: 'GET',
        url: "assets/data/Marzahn-Hellersdorf/Marzahn-Hellersdorf.json"
    }).success(function (data) {
        console.log(data);
        $scope.data = data;
    }).error(function (error) {
        console.log(error);
    });

    $scope.search = function () {
        $scope.results = {};

        var s = $scope.searchCriteria.toLowerCase();

        $scope.data.index.forEach(function (entry) {
            if (entry.angebote.toLowerCase().indexOf(s) > -1 || entry.plz.indexOf(s) >- 1) {

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
        console.log($scope.results);
    }
}]);


