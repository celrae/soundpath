# Soundpath
Soundpath is a web application that provides road trip directions and creates a playlist of public media stories about the people and places along the route.    

The idea was first presented as part of a ["Hack the Future of Journalism"](http://www.rjionline.org/hackathon2014/soundpath-final-presentation) hackathon at KQED in San Francisco.


## This is a work in progress

**Here's a basic overview of what we're working on:**

1. Getting the route information. (DONE) 
2. Identifying places and points of interest along the path. (IN PROCESS)
    * First, we tried using city halls near the route to identify towns of interest.
    * Second, we added searches for establishments near the route; the challenge with this is that the names on the map don't always make a good search term for the PMP. For example, Google Maps includes "The Metropolitan Museum of Art," while public media stories (at least those from the region) almost all use "The Met" to describe the same institution. 
3. Searching the Public Media Platform for stories about those points of interest. (IN PROCESS)
4.  * Currently, I'm researching various methods of identify place names in text. Thankfully, geographers have been nerding out about this lately, so there's some good stuff out there. Whether it's useful for our purposes or not remains to be seen.
4. Building a playlist from PMP content. (TBD)

**In the future we'd like to:**

1. Allow users to save and edit playlists
2. Improve matching between place and audio piece.
    * Better geographic information about stories in the PMP would let us expand use from road trip–scale distances to daily commuters and urban tourists. 
    * Better matching of stories so that results are actually about a place, rather than stories that mention a place in passing (e.g., the location of the station, a tour stop mentioned by an artist in an interview, etc.)

