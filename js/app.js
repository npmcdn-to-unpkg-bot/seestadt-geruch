var css = require('../styles/main.scss');
var moment = require('moment');

var southWest = L.latLng(40.712, -74.227),
    northEast = L.latLng(40.774, -74.125),
    bounds = L.latLngBounds(southWest, northEast);

var maxBounds = {'_southWest':{'lat':48.22404007661269,'lng':16.494458913803104},'_northEast':{'lat':48.225855575745435,'lng':16.503369212150577}};
var center = [48.226016394414145, 16.50457620620728];
map = L.map('map', {minZoom: 15, maxBounds : maxBounds }).setView(center, 16);

if (__DEV__) {
  API_URL = 'http://localhost:8000/api/v1/report/';
} else {
  API_URL = '/api/v1/report/';
}

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
maxZoom: 20,
id: 'mapbox.streets',
accessToken: 'pk.eyJ1Ijoic3R5dHMiLCJhIjoiY2lzMGkzbHpmMDA1ajJzbzcxYXNvM2VidiJ9.ozNnfh0l7gHgBxrbovRcAw'
}).addTo(map);

var sidebar = L.control.sidebar('sidebar').addTo(map);
sidebar.open('home');

var lc = L.control.locate({
  locateOptions: {
       maxZoom: 18
}
}).addTo(map);
lc.start();

$('#btn-report').click(function (event) {
  var target = $(event.target);
  target.addClass('is-loading');
  $('.notification').hide();
  var form = $('#reportform');
  $.ajax({
    url: API_URL,
    data: form.serialize(),
    type: 'POST',
    success: function(data) { $('#notify-success').show(); },
    error: function() { $('#notify-failiure').show(); },
    complete: function () { target.removeClass('is-loading'); }
  });
});

$('#reportform').submit(function (ev) {
  $('#btn-report').click();
  ev.preventDefault();
});

// update time
function timeout() {
    setTimeout(function () {
        $('#time').html(moment().locale('de').format('MMMM Do YYYY, h:mm:ss a'));
        $('#time_user').val(moment().format('X'));
        if (lc._marker) {
            $.each(map._layers, function (ml) {
              var o =map._layers[ml];
              if (o._radius && o._radius == 5) {
                set_latlng(o._latlng);
              }
          });
        }

        timeout();
    }, 1000);
}
timeout();

function set_latlng(latlng) {
  $('#coordinates').html('(' + latlng.lat +  ', ' + latlng.lng + ')');
  $('#latitude').val(latlng.lat);
  $('#longitude').val(latlng.lng);
  $('#btn-report').removeClass('is-disabled');
}

module.exports = {
  map: map,
  L: L
};
