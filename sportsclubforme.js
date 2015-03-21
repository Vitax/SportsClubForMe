var app = angular.module('app', []);

app.controller('ClubData', ['$scope', '$http', function ($scope, $http) {

    $scope.data = null;

    $http({
        method: 'GET',
        url: "assets/data/Marzahn-Hellersdorf/Marzahn-Hellersdorf.json"
    }).success(function (data) {
        console.log(data);
        $scope.data = data;
    }).error(function (error){
        console.log(error);
    });


/*    upper.upper_categories = [
        {
            name: 'Ballsport',
            image: 'assets/images/ballsport.jpg'
        },
        {
            name: 'Kampfsport',
            image: 'assets/images/kampfsport.jpg'
        },
        {
            name: 'Laufsport',
            image: 'assets/images/laufsport.jpg'
        },
        {
            name: 'Radsport',
            image: 'assets/images/radsport.jpg'
        },
        {
            name: 'Wassersport',
            image: 'assets/images/wassersport.jpg'
        },
        {
            name: 'Eissport',
            image: 'assets/images/eissport.jpg'
        }
    ];*/


}]);


