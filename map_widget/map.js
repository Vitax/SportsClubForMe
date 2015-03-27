function init() {

    var mapCanvas = document.getElementById('mapCanvas');
    var mapOptions = {
        center: {lat: 52.50, lng: 13.34},
        zoom: 10
    };
    var mapView = new google.maps.Map(mapCanvas, mapOptions);
}

google.maps.event.addDomListener(window, 'load', init);