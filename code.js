console.clear();


// setInterval(function(){
//     current_time = new Date().toLocaleTimeString();
//     document.getElementById('current-time').innerHTML = current_time;
//   }, 1000);


const client_timezone = -(new Date().getTimezoneOffset() / 60) * 3600;

city = 'Perth';

api_key = '08765f190fba76c5d960c12c6b7f349e'

async function callWeather(city) {
    city = searchCity.value;
    console.log(city);
    link = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID='+api_key+'&units=metric';
    const response = await fetch(link, {mode: 'cors'});
    response.json().then(function(response) {
        processObject(response);
    });
}

function processObject(response) {
    console.log(response);
    city = response.name;
    country = response.sys.country;
    temp = response.main.temp;
    feelsLike = response.main.feels_like;
    humidity = response.main.humidity;
    weather = response.main.weather;
    timezone_shift = (response.timezone) - client_timezone;     // Calculating the timezone shift in seconds, relative to the clients own timezone
    sunrise = new Date((response.sys.sunrise + timezone_shift) * 1000).toLocaleTimeString();
    sunset = new Date((response.sys.sunset + timezone_shift) * 1000).toLocaleTimeString();

    // Update the DOM with the new processed info
    updateDOM(city,country,temp,feelsLike,weather,humidity,sunrise,sunset);
}

function updateDOM(city,country,temp,feelsLike,weather,humidity,sunrise,sunset) {
    document.getElementById('city').innerHTML = city + ' ' + country;
    document.getElementById('temperature').innerHTML = Math.round(temp* 10)/10 + '<sup>o</sup>C';
    feelsLike = Math.round(feelsLike) + '<sup>o</sup>C';
    document.getElementById('detail-container').innerHTML = 
    'Feels like '+feelsLike+' | '+weather+' | Humidity: '+humidity+'% | Sunrise: '+sunrise+' | Sunset: '+sunset;
}

// Listens to changes in the search bar, to fire the async function and update the DOM
searchCity = document.getElementById('search-bar');
searchCity.addEventListener('input', callWeather.bind(searchCity.value));