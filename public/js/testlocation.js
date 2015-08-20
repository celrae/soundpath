var fakeTrip = [
	{ coords: { latitude: 42.376224, longitude: -71.110033 }},
	{ coords: { latitude: 41.944150, longitude: -71.281096 }},
	{ coords: { latitude: 41.824529, longitude: -71.418425 }},
	{ coords: { latitude: 41.330400, longitude: -71.912810 }},
	{ coords: { latitude: 41.266433, longitude: -72.975737 }}, 
	{ coords: { latitude: 41.110379, longitude: -73.391845 }}, 
	{ coords: { latitude: 41.000609, longitude: -73.670623 }},  
	{ coords: { latitude: 40.910379, longitude: -73.790099 }},
	{ coords: { latitude: 40.753999, longitude: -73.907515 }},
	{ coords: { latitude: 40.745676, longitude: -73.974120 }}
];

function getLocation(){
	getLocality(fakeTrip.shift());
}

