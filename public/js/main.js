
var map = null;
var boxpolys = null;
var directions = null;
var routeBoxer = null;
var distance = null; // km
var service = null;
var gmarkers = [];
var boxes = null;
var towns = [];
var infowindow = new google.maps.InfoWindow();
function initialize() {
    $("#loading_img").hide();
    $("#status_span").html();


  // Default the map view to the continental U.S.
  var mapOptions = {
    center: new google.maps.LatLng(40,-80.5),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 8
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  service = new google.maps.places.PlacesService(map);

  routeBoxer = new RouteBoxer();

  directionService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map: map });      

    // If there are any parameters at eh end of the URL, they will be in  location.search
    // looking something like  "?marker=3"
 
    // skip the first character, we are not interested in the "?"
    var query = location.search.substring(1);
 
    // split the rest at each "&" character to give a list of  "argname=value"  pairs
    var pairs = query.split("&");
    for (var i=0; i<pairs.length; i++) {
        // break each pair at the first "=" to obtain the argname and value
	    var pos = pairs[i].indexOf("=");
	    var argname = pairs[i].substring(0,pos).toLowerCase();
	    var value = pairs[i].substring(pos+1).toLowerCase();
 
        // process each possible argname  -  use unescape() if theres any chance of spaces
        if (argname == "to") {document.getElementById('to').value = unescape(value);}
        if (argname == "from") {document.getElementById('from').value = unescape(value);}
        if (argname == "dist") {document.getElementById('distance').value = parseFloat(value);}
        if (argname == "type") {document.getElementById('type').value= unescape(value);}
        if (argname == "keyword") {document.getElementById('keyword').value= unescape(value);}
        if (argname == "name") {document.getElementById('name').value= unescape(value);}
        if (argname == "submit") {route();}				    
    }
				    
}

function search(event) {
        event.preventDefault();
    route();
}

function route() {
    $("#submit_button").attr('disabled', 'true');
    $("#loading_img").show();
    $("#status_span").html('Loading...');
  // Clear any previous route boxes from the map
  clearBoxes();

  // Convert the distance to box around the route from miles to km
  distance = parseFloat(document.getElementById("distance").value) * 1.609344;

  var request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  }

  // Make the directions request
  directionService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);

      // Box around the overview path of the first route
      var path = result.routes[0].overview_path;
      boxes = routeBoxer.box(path, distance);
      // alert(boxes.length);
      drawBoxes();
      towns = [];
      $("#loading_img").show();
      findPlaces(0);
    } else {
      alert("Directions query failed: " + status);
    }
  });
}

// Draw the array of boxes as polylines on the map
function drawBoxes() {
  boxpolys = new Array(boxes.length);
  for (var i = 0; i < boxes.length; i++) {
    boxpolys[i] = new google.maps.Rectangle({
      bounds: boxes[i],
      fillOpacity: 0,
      strokeOpacity: 1.0,
      strokeColor: '#000000',
      strokeWeight: 1,
      map: map
    });
  }
}


function findPlaces(searchIndex) {

   var request = {
       bounds: boxes[searchIndex],
       types: ['city_hall']
   };

   service.nearbySearch(request, function (results, status) {
     if (status == google.maps.places.PlacesServiceStatus.OK) {
       for (var i = 0, result; result = results[i]; i++) {
         var marker = createMarker(result);
       }
     } 
     if (status != google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
        searchIndex++;
        if (searchIndex < boxes.length) {
          findPlaces(searchIndex);
        } else {
            $("#submit_button").removeAttr('disabled');
            $("#loading_img").hide();
            $("#status_span").html('Search Complete');
        }
     } else { // delay 1 second and try again
        setTimeout("findPlaces("+searchIndex+")",1000);
     }

  });
}


// Clear boxes currently on the map
function clearBoxes() {
    document.getElementById('side_bar').innerHTML = "";

  if (boxpolys != null) {
    for (var i = 0; i < boxpolys.length; i++) {
      boxpolys[i].setMap(null);
    }
  }
  boxpolys = null;
}

function createMarker(place) {

    if (!place.name) {
        return;
    }

    var placeLoc=place.geometry.location;
    var image = {
        url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png",
		size: new google.maps.Size(7,7),
        anchor: new google.maps.Point(4,4)
    }

    var request = {
        reference: place.reference
    };

    service.getDetails(request, function (place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < place.address_components.length; i++) {
                for (var j = 0; j < place.address_components[i].types.length; j++) {
                    if (place.address_components[i].types[j] == "locality") {
                        if (!towns[place.address_components[i].long_name]) {
                            var townStr = place.address_components[i].long_name;
                            findStories(place.address_components[i].long_name, function (data) {
                                if (!data) {
                                    return;
                                }
                                towns[townStr] = townStr;
 
                                var marker = new google.maps.Marker({
                                    map: map,
                                    icon: image,
                                    position: place.geometry.location
                                });
                                google.maps.event.addListener(marker, 'click', function () {
                                    var contentStr = '<h5>' + place.name + '</h5><p>' + place.formatted_address;

                                    infowindow.setContent(contentStr);
                                    infowindow.open(map, marker);
                                });
                                gmarkers.push(marker);
                                document.getElementById('side_bar').innerHTML += townStr + "<br>"

                                document.getElementById('side_bar').innerHTML += data + "<br>";


                            });

                        }
                    }
                }
            }
        }
    });
}

function findStories(search, callback) {
    jQuery.get('/search', { search: search }, function success(data) {
        return callback(data);
    }).fail(function () {
        return callback();
    });
}