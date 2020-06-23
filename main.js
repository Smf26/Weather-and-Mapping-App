'use strict';

// ==============Time Function====================
const datetime = () => {
	const timewrap = document.getElementById('time');
	const time = (timewrap.innerHTML = new Date());
	return time;
};
datetime();
setInterval(datetime, 1000);

// ==============Weather Api======================
const button = document.getElementById('btn1');
button.addEventListener('click', (e) => {
	e.preventDefault();
	const viewContainer = document.getElementById('data-view');
	const mapContainer = document.getElementById('map');
	const contentWrap = document.getElementById('content-wrap');
	const apiKey = 'OPENWEATHER_API_KEY';
	const string = document.getElementById('city-input1').value;

	fetch(
		'https://api.openweathermap.org/data/2.5/weather?q=' +
			string +
			'&units=metric&appid=' +
			apiKey +
			''
	)
		.then((resp) => resp.json())
		.then((data) => {
			const unixSunrise = new Date(data.sys.sunrise * 1000).toUTCString();
			const convertedSunriseTime = unixSunrise.slice(-11, -4);
			const unixSunset = new Date(data.sys.sunset * 1000).toUTCString();
			const convertedSunsetTime = unixSunset.slice(-11, -4);
			contentWrap.classList.add('container');
			viewContainer.classList.add('border-style');
			mapContainer.classList.add('border-style');

			viewContainer.innerHTML = `<h2>${data.name} </h2>
        <img src="http://openweathermap.org/img/wn/${data.weather[0]
					.icon}@2x.png" alt="Weather icon">
        <h4>Weather : ${data.weather[0].description} <i class="${data.weather[0]
				.icon}"></i></h4>
        <h4>Visibility : ${data.visibility} </h4>
        <h4>Sunrise Time : ${convertedSunriseTime} - Sunset Time : ${convertedSunsetTime} </h4>
        <h4>Wind speed : ${data.wind.speed} km/h Wind Temperature: ${data.wind
				.deg}</h4>
        <h4>Current Temperature : ${data.main.temp}&deg; </h4>
        <h4>Day Temperature : Min: ${data.main.temp_min}&deg; Max: ${data.main
				.temp_max}&deg; </h4>
        <h4>Pressure : ${data.main.pressure} Hpa </h4>
        <h4>Humidity : ${data.main.humidity} % </h4>
        `;
			// ===============Google Maps=============
			const options = {
				center: {
					lat: data.coord.lat,
					lng: data.coord.lon
				},
				zoom: 13,
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
					mapTypeIds: [ 'roadmap', 'satellite', 'terrain', 'hybrid' ]
				},
				styles: [
					{
						"featureType": "administrative.locality",
						"elementType": "labels",
						"stylers": [
							{
								"color": "#42423d"
							},
							{
								"lightness": -55
							},
							{
								"weight": 1
							}
						]
					},
					{
						"featureType": "administrative.locality",
						"elementType": "labels.text",
						"stylers": [
							{
								"color": "#1d1d1b"
							}
						]
					},
					{
						"featureType": "administrative.neighborhood",
						"elementType": "labels",
						"stylers": [
							{
								"color": "#4e4e46"
							},
							{
								"weight": 1
							}
						]
					},
					{
						"featureType": "landscape.natural",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"color": "#b1ad81"
							},
							{
								"lightness": -45
							},
							{
								"weight": 2.5
							}
						]
					},
					{
						"featureType": "landscape.natural.landcover",
						"elementType": "geometry.fill",
						"stylers": [
							{
								"lightness": 30
							}
						]
					},
					{
						"featureType": "landscape.natural.terrain",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#4e4e46"
							}
						]
					},
					{
						"featureType": "landscape.natural.terrain",
						"elementType": "labels",
						"stylers": [
							{
								"color": "#4e4e46"
							}
						]
					},
					{
						"featureType": "road",
						"elementType": "geometry",
						"stylers": [
							{
								"color": "#989886"
							}
						]
					}
				]
			};
			const map = new google.maps.Map(document.getElementById('map'), options);

			const trafficLayer = new google.maps.TrafficLayer();
			trafficLayer.setMap(map);
			const transitLayer = new google.maps.TransitLayer();
			transitLayer.setMap(map);
			const bikeLayer = new google.maps.BicyclingLayer();
			bikeLayer.setMap(map);
			// Add Marker
			const marker = new google.maps.Marker({
				position: { lat: data.coord.lat, lng: data.coord.lon },
				draggable: true,
				animation: google.maps.Animation.DROP,
				map: map,
				title: `${data.name}`,
				icon: './images/markerr.png'
				//icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
			});
			const infoWindow = new google.maps.InfoWindow({
				content: `<h4>${data.name}</h4>`
			});
			marker.addListener('click', function () {
				infoWindow.open(map, marker);
			});
			// Animation
			marker.addListener('click', toggleBounce);
			function toggleBounce () {
				if (marker.getAnimation() !== null) {
					marker.setAnimation(null);
				} else {
					marker.setAnimation(google.maps.Animation.BOUNCE);
				}
			}
		})
		.catch((err) => console.log(err));
});
