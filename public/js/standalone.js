var standaloneCities = [
  ["Atlanta, GA", "Atlanta, Ga.", "Atlanta, Georgia", "Atlanta"],	
  ["Phoenix, AZ", "Phoenix, Ariz.", "Phoenix, Arizona", "Phoenix"],
	["Baltimore, MD", "Baltimore, Md.", "Baltimore, Maryland", "Baltimore"],
	["Pittsburgh, PA", "Pittsburgh, Pa.", "Pittsburgh, Pennsylvania", "Pittsburg"],
	["Boston, MA", "Boston, Mass.", "Boston, Massachusetts", "Boston"],
	["St. Louis, MO", "St. Louis, Mo.", "St. Louis, Missouri", "St. Louis"],
	["Chicago, IL", "Chicago, Ill.", "Chicago, Illinois", "Chicago"],
	["Salt Lake City, UT", "Salt Lake City, Utah", "Salt Lake City, Utah", "Salt Lake City"],
	["Cincinnati, OH", "Cincinnati, Ohio", "Cincinnati, Ohio", "Cincinnati"],	
	["San Antonio, TX", "San Antonio, Texas", "San Antonio, Texas", "San Antonio"],
	["Cleveland, OH", "Cleveland, Ohio", "Cleveland, Ohio", "Cleveland"],
	["San Diego, CA", "San Diego, Calif.", "San Diego, California", "San Diego"],
	["Dallas, TX", "Dallas, Texas", "Dallas, Texas", "Dallas"],	
	["San Francisco, CA", "San Francisco, Calif.", "San Francisco, California", "San Francisco"],
	["Denver, CO", "Denver, Colo.", "Denver, Colorado", "Denver"],	
	["Seattle, WA", "Seattle, Wash.", "Seattle, Washington", "Seattle"],
	["Detroit, MI", "Detroit, Mich.", "Detroit, Michigan", "Detroit"],	
	["Washington, DC", "Washington, D.C.", "Washington, District of Columbia", "Washington"],
	["Honolulu, HI", "Honolulu, Hawaii", "Honolulu, Hawaii", "Honolulu"],	
	["Houston, TX", "Houston, Texas", "Houston, Texas", "Houston"],	
	["Indianapolis, IN", "Indianapolis, Ind.", "Indianapolis, Indiana", "Indianapolis"],	
	["Las Vegas, NV", "Las Vegas, Nev.", "Las Vegas, Nevada", "Las Vegas"],	
	["Los Angeles, CA", "Los Angeles, Calif.", "Los Angeles, California", "Los Angeles"],
	["Miami, FL", "Miami, Fla.", "Miami, Florida", "Miami"],	
	["Milwaukee, WI", "Milwaukee, Wisc.", "Milwaukee, Wisconsin", "Milwaukee"],	
	["Minneapolis, MN", "Minneapolis, Minn.", "Minneapolis, Minnesota", "Minneapolis"],	
	["New Orleans, LA", "New Orleans, La.", "New Orleans, Louisiana", "New Orleans"],	
	["New York, NY", "New York, N.Y.", "New York, New York", "New York City"],
	["Oklahoma City, OK", "Oklahoma City, Okla.", "Oklahoma City, Oklahoma", "Oklahoma City"],	
	["Philadelphia, PA", "Philadelphia, Pa.", "Philadelphia, Pennsylvania", "Philadelphia"]
];

  var placeToAP = function(place) {
  
  for (var i = 0; i < standaloneCities.length; i++) {
    if (standaloneCities[i][1].indexOf(place) > -1) {
      return standaloneCities[i][3]
    }
    else {
      return place
    };
  };
};