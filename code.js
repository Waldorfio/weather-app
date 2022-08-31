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
    link = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID='+api_key+'&units=metric';
    const response = await fetch(link, {mode: 'cors'});
        response.json().then(function(response) {
            try {
                processObject(response);
                console.log('City located: '+city);
                console.log(response);
            } catch (e) {
                console.log('Error: City not found.')
            }
        });
}

function processObject(response) {
    city = response.name;
    country = response.sys.country;
    temp = response.main.temp;
    feelsLike = response.main.feels_like;
    humidity = response.main.humidity;
    weather = response.weather[0].description.toUpperCase();
    timezone_shift = (response.timezone) - client_timezone;     // Calculating the timezone shift in seconds, relative to the clients own timezone
    sunrise = new Date((response.sys.sunrise + timezone_shift) * 1000).toLocaleTimeString();
    sunset = new Date((response.sys.sunset + timezone_shift) * 1000).toLocaleTimeString();

    // Update the DOM with the new processed info
    updateDOM(city,country,temp,feelsLike,weather,humidity,sunrise,sunset);
}

function updateDOM(city,country,temp,feelsLike,weather,humidity,sunrise,sunset) {
    document.getElementById('city').innerHTML = city + ', ' + country;
    document.getElementById('temperature').innerHTML = Math.round(temp* 10)/10 + '<sup>o</sup>C';
    feelsLike = Math.round(feelsLike) + '<sup>o</sup>C';
    document.getElementById('detail1').innerHTML = 
    'Feels like '+feelsLike+' | <i>'+weather+'</i> | Humidity: '+humidity+'%';
    document.getElementById('detail2').innerHTML = 
    'Sunrise: '+sunrise+' | Sunset: '+sunset;

    document.getElementById('city-flag').src = getCountryCode(country);
}

// Listens to changes in the search bar, to fire the async function and update the DOM
searchCity = document.getElementById('search-bar');
searchCity.addEventListener('input', callWeather.bind(searchCity));


// Automatically fetching flags based on country
function getCountryCode(country) {
    link = 'https://flagicons.lipis.dev/flags/4x3/'+country.toLowerCase()+'.svg';
    return link
}

// Converting units via the button
unitSwitch = document.getElementById('units-switch');
unitSwitch.addEventListener('click', () => convUnits());

let units = 'celsius';
function convUnits() {
    if (units=='celsius') {
        // Converting the main temp
        temp1 = document.getElementById('temperature').innerHTML.split('<s')[0];
        convValue = Math.round(((parseFloat(temp1)*(9/5))+32)* 10)/10;
        document.getElementById('temperature').innerHTML = convValue + '<sup>o</sup>F';
        units = 'farenheit';
        return
    }
    if (units=='farenheit') {
        // Converting the main temp
        temp1 = document.getElementById('temperature').innerHTML.split('<s')[0];
        convValue = Math.round(((parseFloat(temp1)-32)*(5/9))* 10)/10;
        document.getElementById('temperature').innerHTML = convValue + '<sup>o</sup>C';
        units = 'celsius';
        return
    }
}


// callWeather('Brisbane');        // Call and display Brisbanes weather by default