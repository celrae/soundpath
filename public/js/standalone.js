var standaloneCities = [
    ["Atlanta, GA", "Atlanta, Ga.", "Atlanta"],	
    ["Phoenix, AZ", "Phoenix, Ariz.", "Phoenix"],
	["Baltimore, MD", "Baltimore, Md.", "Baltimore"],
	["Pittsburgh, PA", "Pittsburgh, Pa.", "Pittsburgh"],
	["Boston, MA", "Boston, Mass.", "Boston"],
	["St. Louis, MO", "St. Louis, Mo.", "St. Louis"],
	["Chicago, IL", "Chicago, Ill.", "Chicago"],
	["Salt Lake City, UT", "Salt Lake City, Utah", "Salt Lake City"],
	["Cincinnati, OH", "Cincinnati, Ohio", "Cincinnati"],	
	["San Antonio, TX", "San Antonio, Texas", "San Antonio"],
	["Cleveland, OH", "Cleveland, Ohio", "Cleveland"],
	["San Diego, CA", "San Diego, Calif.", "San Diego"],
	["Dallas, TX", "Dallas, Texas", "Dallas"],	
	["San Francisco, CA", "San Francisco, Calif.", "San Francisco"],
	["Denver, CO", "Denver, Colo.", "Denver"],	
	["Seattle, WA", "Seattle, Wash.", "Seattle"],
	["Detroit, MI", "Detroit, Mich.", "Detroit"],	
	["Washington, DC", "Washington, D.C.", "Washington"],
	["Honolulu, HI", "Honolulu, Hawaii", "Honolulu"],	
	["Houston, TX", "Houston, Texas", "Houston"],	
	["Indianapolis, IN", "Indianapolis, Ind.", "Indianapolis"],	
	["Las Vegas, NV", "Las Vegas, Nev.", "Las Vegas"],	
	["Los Angeles, CA", "Los Angeles, Calif.", "Los Angeles"],
	["Miami, FL", "Miami, Fla.", "Miami"],	
	["Milwaukee, MI", "Milwaukee, Mich.", "Milwaukee"],	
	["Minneapolis, MN", "Minneapolis, Minn.", "Minneapolis"],	
	["New Orleans, LA", "New Orleans, La.", "New Orleans"],	
	["New York, NY", "New York, N.Y.", "New York City"],
	["Oklahoma City, OK", "Oklahoma City, Okla.", "Oklahoma City"],	
	["Philadelphia, PA", "Philadelphia, Pa.", "Philadelphia"]
];

  var placeToAP = function(place) {
  
  for (var i = 0; i < standaloneCities.length; i++) {
    if (standaloneCities[i][1].indexOf(place) > -1) {
      return standaloneCities[i][2]
    }
  };
};