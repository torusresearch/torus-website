// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
	// Basic options for a simple Google Map
	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	var mapOptions = {
		// How zoomed in you want the map to start at (always required)
		zoom: 14,

		// The latitude and longitude to center the map (always required)
		center: new google.maps.LatLng(33.7454005, -117.896165), // New York

		// How you would like to style the map. 
		// This is where you would paste any style found on Snazzy Maps.
		styles: []
	};

	// Get the HTML DOM element that will contain your map 
	// We are using a div with id="gMap" seen below in the <body>
	var mapElement = document.getElementById('gMap');

	var map = new google.maps.Map(mapElement, mapOptions);
	
	// Let's also add a marker while we're at it
	marker = new google.maps.Marker({
		map:map,
		draggable:true,
		animation: google.maps.Animation.DROP,
		position: new google.maps.LatLng(33.7454005, -117.896165), 
		// Change those co-ordinates to yours, to change your location with given location.
		icon: '' // null = default icon
	});
}