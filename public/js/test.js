
var map = null;
var boxpolys = null;
var directions = null;
var routeBoxer = null;
var distance = null; // km
var service = null;
var gmarkers = [];
var boxes = null;
var towns = [];
var terms = [];
var infowindow = new google.maps.InfoWindow();

mapResults = [];
query = { profile: 'audio', text: '' };

function initialize() {
    $("#loading_img").hide();
    $("#status_span").html();
    
    $("#search_button").click(function (event) {
        event.preventDefault();
        route();
    });
    
    $("#query_button").click(function (event) {
        event.preventDefault();
        searchPMP();
    });
    
    // Default the map view to the continental U.S.
    var mapOptions = {
        center: new google.maps.LatLng(40, -80.5),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 8
    };
    
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    service = new google.maps.places.PlacesService(map);
    
    routeBoxer = new RouteBoxer();
    
    directionService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map: map });
		    
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
    directionService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            
            // Box around the overview path of the first route
            var path = result.routes[0].overview_path;
            boxes = routeBoxer.box(path, distance);         

            // alert(boxes.length);
            drawBoxes();
            terms = [];
            $("#loading_img").show();
            
            async.each(boxes, function (box, callback) {
                async.retry(3, findPlaces.bind(box), function (err) {
                    if (err && err === 'OVER_QUERY_LIMIT') {
                        setTimeout(callback(err), 1000);
                    } else {
                        return callback(err);
                    }
                });
            }, function (err) {
                $('#mapTree').jsonViewer(boxes);
                populatePMPQuery();
              
                //populateMapList(boxes);

                $("#submit_button").removeAttr('disabled');
                $("#loading_img").hide();
                $("#status_span").html('Search Complete');
            });
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
        boxes[i].id = i;
        boxes[i].text = i.toString();
    }
}


function findPlaces(callback) {
    var box = this;

    var request = {
        bounds: box
    };
    
    if (document.getElementById("filter").value) {
        request.types = document.getElementById("filter").value.split(',');
    }
    
   
    box.places = {};
    
    service.nearbySearch(request, function (results, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            return callback(status, box);
        }

        async.each(results, function (result, cb) {

            result.parent = box.id;
            result.text = result.name;
            
            // result.name.split(' ').forEach(function (part) { 
            //     part = part.toLowerCase();
            //     if (!terms[part]) {
            //         terms[part] = part;
            //     }
            // });
            
            getAddress(result, function (err, place) {
                if (!err) {
                    box.places[result.text] = place;
                    createMarker(place);

                } else {
                    box.places[result.text] = result;
                }
                
                return cb();
            });
                
        }, function (err) {
            return callback(null);
        });
    });
}

function getAddress(place, callback) {
    
    var request = {
        reference: place.reference
    };

    service.getDetails(request, function (place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < place.address_components.length; i++) {
                    for (var j = 0; j < place.address_components[i].types.length; j++) {
                        if (place.address_components[i].types[j] == "locality") {
                            place.town = place.address_components[i].long_name;
                            if (!terms[place.address_components[i].long_name.toLowerCase()]) {
                                terms[place.town.toLowerCase()] = place.town.toLowerCase();
                            }
                        }
                    }
                }
            }
            return callback(null, place);
        } else {
            return callback(status, place);
        }
        
    });
}

function populatePMPQuery() {
    var filters = $("#pmpfilters").val().replace(' ', '').split(',');

    var keys = Object.keys(terms);
    query.text = '';
    keys.forEach(function (term, index) {
        if (filters.indexOf(term) > -1) {
            return;
        }

        if (index > 0) {
            query.text += ' OR ';
        }
        query.text += "'" + term.toLowerCase() + "'";
    });

    $("#pmpquery").val(query.text);
}


// Clear boxes currently on the map
function clearBoxes() {

    $('#mapTree').html("");
    $('#pmpTree').html("");

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
    
    var placeLoc = place.geometry.location;
    
    
    var image = {
        url: "https://maps.gstatic.com/intl/en_us/mapfiles/markers2/measle.png",
        size: new google.maps.Size(7, 7),
        anchor: new google.maps.Point(4, 4)
    }
    

    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function () {
        var contentStr = '<h5>' + place.name + '</h5><p>' + place.formatted_address;
        
        infowindow.setContent(contentStr);
        infowindow.open(map, marker);
    });
    gmarkers.push(marker);
}

function searchPMP() {
    query.profile = $("#pmpprofile").val();
    query.text = $("#pmpquery").val();
    query.limit = $("#pmplimit").val();
    query.has = "audio";
    //query.searchsort = 'relevance ';
    $("#pmpTree").html("");
    $("#download_button").hide();
    
    update_download();

    jQuery.post('/testsearch', query, function success(data) {
        $("#pmpTree").html(data + "</br>");
        $("#download_button").show();
        //$("#pmpTree").jsonViewer(data);
    },'html').fail(function (e) {
        alert('e');
    });
}

function update_download() {
    $("#download_button").attr("href",'/download/' +moment().format('MM_DD_YYYY_HHmmA') + '.csv?profile=' + $("#pmpprofile").val() + '&text=' + $("#pmpquery").val() + '&limit=' + $("#pmplimit").val() + '&has=audio');
};