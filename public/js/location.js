/* Get lat/long of the user's current position from the browser. */   
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getLocality);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

