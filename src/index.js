import './style.css'

console.clear()

// setInterval(function(){
//     current_time = new Date().toLocaleTimeString();
//     document.getElementById('current-time').innerHTML = current_time;
//   }, 1000);

const clientTimezone = -(new Date().getTimezoneOffset() / 60) * 3600

const city = 'Perth'
const apiKey = '08765f190fba76c5d960c12c6b7f349e'

async function callWeather (city) {
  city = searchCity.value
  const link = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&APPID=' + apiKey + '&units=metric'
  const response = await fetch(link, { mode: 'cors' })
  response.json().then(function (response) {
    try {
      processObject(response)
      console.log('City located: ' + city)
      console.log(response)
    } catch (e) {
      console.log('Error: City not found.')
    }
  })
}

function processObject (response) {
  const city = response.name
  const country = response.sys.country
  const temp = response.main.temp
  const feelsLike = response.main.feels_like
  const humidity = response.main.humidity
  const weather = response.weather[0].description.toUpperCase()
  const timezoneShift = (response.timezone) - clientTimezone // Calculating the timezone shift in seconds, relative to the clients own timezone
  const sunrise = new Date((response.sys.sunrise + timezoneShift) * 1000).toLocaleTimeString()
  const sunset = new Date((response.sys.sunset + timezoneShift) * 1000).toLocaleTimeString()

  // Update the DOM with the new processed info
  updateDOM(city, country, temp, feelsLike, weather, humidity, sunrise, sunset)
}

function updateDOM (city, country, temp, feelsLike, weather, humidity, sunrise, sunset) {
  document.getElementById('city').innerHTML = city + ', ' + country
  document.getElementById('temperature').innerHTML = Math.round(temp * 10) / 10 + '<sup>o</sup>C'
  feelsLike = Math.round(feelsLike) + '<sup>o</sup>C'
  document.getElementById('detail1').innerHTML =
    'Feels like ' + feelsLike + ' | <i>' + weather + '</i> | Humidity: ' + humidity + '%'
  document.getElementById('detail2').innerHTML =
    'Sunrise: ' + sunrise + ' | Sunset: ' + sunset

  document.getElementById('city-flag').src = getCountryCode(country)
}

// Listens to changes in the search bar, to fire the async function and update the DOM
const searchCity = document.getElementById('search-bar')
searchCity.addEventListener('input', callWeather.bind(searchCity))

// Automatically fetching flags based on country
function getCountryCode (country) {
  const link = 'https://flagicons.lipis.dev/flags/4x3/' + country.toLowerCase() + '.svg'
  return link
}

// Converting units via the button
const unitSwitch = document.getElementById('units-switch')
unitSwitch.addEventListener('click', () => convUnits())

let units = 'celsius'
function convUnits () {
  if (units === 'celsius') {
    // Converting the main temp
    const temp1 = document.getElementById('temperature').innerHTML.split('<s')[0]
    const convValue = Math.round(((parseFloat(temp1) * (9 / 5)) + 32) * 10) / 10
    document.getElementById('temperature').innerHTML = convValue + '<sup>o</sup>F'
    units = 'farenheit'
    return
  }
  if (units === 'farenheit') {
    // Converting the main temp
    const temp1 = document.getElementById('temperature').innerHTML.split('<s')[0]
    const convValue = Math.round(((parseFloat(temp1) - 32) * (5 / 9)) * 10) / 10
    document.getElementById('temperature').innerHTML = convValue + '<sup>o</sup>C'
    units = 'celsius'
  }
}

// callWeather('Brisbane');        // Call and display Brisbanes weather by default
