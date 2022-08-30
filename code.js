
console.log('hi')

city = 'Perth';

api_key = '08765f190fba76c5d960c12c6b7f349e'

async function callWeather(city) {
    city = searchCity.value;
    console.log(city);
    link = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + api_key;
    const response = await fetch(link, {mode: 'cors'});
    response.json().then(function(response) {
        console.log(response);
        temp = response.main.temp;
        feelsLike = response.main.feels_like;
        humidity = response.main.humidity;
        weather = response.main.weather;
        timezone = response.sys.timezone;
        sunrise = response.sys.sunrise;
        sunset = response.sys.sunrise;

        // Update the DOM with new weather
        updateDOM(city,temp,feelsLike,weather,humidity,sunrise,sunset);
    });
}

function updateDOM(city,temp,feelsLike,weather,humidity,sunrise,sunset) {
    document.getElementById('city').innerHTML = city;
    document.getElementById('temperature').innerHTML = temp;
    document.getElementById('detail-container').innerHTML = 'Feels like '+feelsLike+' | '+weather+' | Humidity: '+humidity+'% | Sunrise: '+sunrise+' | Sunset: '+sunset;
}

// Listens to changes in the search bar, to fire the async function and update the DOM
searchCity = document.getElementById('search-bar');
searchCity.addEventListener('input', callWeather.bind(searchCity.value));