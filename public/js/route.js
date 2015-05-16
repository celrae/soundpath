<script type="text/javascript" src="http://google-maps-utility-library-v3.googlecode.com/svn/trunk/routeboxer/src/RouteBoxer.js"></script>

var directionService = new google.maps.DirectionsService();
var rboxer = new RouteBoxer();
var distance = 20; // km

directionService.route(request, function(result, status) {
  if (status == google.maps.DirectionsStatus.OK) {
  
    // Box the overview path of the first route
    var path = result.routes[0].overview_path;
    var boxes = routeBoxer.box(path, distance);
    
    for (var i = 0; i < boxes.length; i++) {
      var bounds = box[i];
      // Perform search over this bounds 
    }
  }
});