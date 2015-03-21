var app = angular.module('app', []);

app.controller('ClubData', ['$scope', '$http', function ($scope, $http) {

    $scope.data = null;
    $scope.searchCriteria = null;
    $scope.results = [];

    $http({
        method: 'GET',
        url: "assets/data/Marzahn-Hellersdorf/Marzahn-Hellersdorf.json"
    }).success(function (data) {
        console.log(data);
        $scope.data = data;
    }).error(function (error){
        console.log(error);
    });

    $scope.search = function() {
        $scope.data.index.forEach(function(entry) {
           if(entry.angebote == $scope.searchCriteria) {
               $scope.results.push(entry.sportverein);
           }
        });
    }

}]);


