window.addEventListener('load', getLocation);

function getLocation() {
   navigator.geolocation.getCurrentPosition(success, failure);

   function success(data) {
      const latitude = data.coords.latitude;
      const longitude = data.coords.longitude;

      showMap({ latitude, longitude });
   }

   function failure(err) {
      console.err(err);
   }
}

function showMap(current) {
   var map = L.map('map').setView([current.latitude, current.longitude], 14);
   weatherReport(current).then(weatherResponse => {
      const content = `<div id='content'>
                         <div id='content_img'><img src='${weatherResponse.icon}'></img></div>
                         <p id='content_description'>${weatherResponse.desc}</p>
                         <p id='content_info'>Temperature: ${parseInt(weatherResponse.temp)} deg.</p>
                         <p id='content_info'>Location: ${weatherResponse.locationName}, ${weatherResponse.locationCountry}</p>
                       </div>`;

      L.marker([current.latitude, current.longitude]).addTo(map).bindPopup(content).openPopup();
   }).catch(err => console.log(err));

   L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
   }).addTo(map);
}

async function weatherReport(coords) {
   const API_ID = '1650e7ce22607f8588079cf4d8b56320';
   const openWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${API_ID}`;
   const response = await fetch(openWeatherAPI);
   const data = await response.json();

   const icon = `https://openweathermap.org/img/wn/${await data.weather[0].icon}@2x.png`;
   const temp = await data.main.temp;
   const desc = await data.weather[0].description;
   const locationName = await data.name;
   const locationCountry = await data.sys.country;

   return { icon, temp, desc, locationName, locationCountry };
}