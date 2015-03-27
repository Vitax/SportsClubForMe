var map = angular.module('map', []);

map.controller('MapCtrl', ['$scope', function ($scope) {

    var berlinLatLng = new google.maps.LatLng(52.50, 13.34);
    var mapCanvas = document.getElementById('mapCanvas');

    var mapOptions = {
        disableDefaultUI: true,
        center: berlinLatLng,
        zoom: 10
    };

    $scope.map = new google.maps.Map(mapCanvas, mapOptions);
}]);
