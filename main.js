async function update_weather_backup(city, data) {
     try {
          let url = 'https://abdurashid.weather-app.uz';
          data = {
               country: city,
               weather: data.weather[0].description,
               icon: data.weather[0].icon,
               wind_speed: data.wind.speed,
               wind_direction: data.wind.deg,
               temperature: data.main.temp,
               feelsLike: data.main.feels_like,
               humidity: data.main.humidity,
               pressure: data.main.pressure,
               lat: data.coord.lat,
               lon: data.coord.lon,
          };
          const response = await axios.post(url, data, {headers: {'Content-Type': 'application/json'}});
          console.log(response);
     } catch (error) {
          console.error(error);
     }
}

const apiKey = "70987fd5cc8bb64b62ad8fffb22192e1";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function load_weather() {
     try {
          let country = "Leeds";
          const response = await axios.get(`https://abdurashid.weather-app.uz?country=${country}`);
          console.log(response);
          let result = response.data;
          if (result.length == 0) {
          if (localStorage.when != null && parseInt(localStorage.when) + 10000 > Date.now()) {
          let freshness = Math.round((Date.now() - localStorage.when)/1000) + " second(s)";
                    document.querySelector(".city").innerHTML = localStorage.city;
                    document.querySelector(".temp").innerHTML = localStorage.temperature;
                    document.querySelector(".humidity").innerHTML = localStorage.humidity;
                    document.querySelector(".wind").innerHTML = localStorage.wind;
                    document.querySelector(".weather-icon").src = localStorage.icon;
                    document.querySelector(".weather").style.display = "block";
                    document.getElementById("myLastUpdated").innerHTML = freshness;
               } else {
                    const response = await fetch(apiUrl + country + `&appid=${apiKey}`);
                    if (response.status == 404) {
                         document.querySelector(".error").style.display = "block";
                         document.querySelector(".weather").style.display = "none";
                    } else {
                         var data = await response.json();
                         document.querySelector(".city").innerHTML = data.name;
                         document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "ºC";
                         document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
                         document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";
                         switch (data.weather[0].main) {
                         case "Clouds":
                              weatherIcon.src = "images/clouds.png";
                              break;
                         case "Clear":
                              weatherIcon.src = "images/clear.png";
                              break;
                         case "Rain":
                              weatherIcon.src = "images/rain.png";
                              break;
                         case "Drizzle":
                              weatherIcon.src = "images/drizzle.png";
                              break;
                         case "Mist":
                              weatherIcon.src = "images/mist.png";
                              break;
                         }
                         document.querySelector(".weather").style.display = "block";
                         localStorage.city = data.name;
                         localStorage.temperature = Math.round(data.main.temp) + "ºC";
                         localStorage.humidity = data.main.humidity + "%";
                         localStorage.wind = data.wind.speed + "km/h";
                         localStorage.icon = "images/" + data.weather[0].main.toLowerCase() + ".png";
                         localStorage.when = Date.now();
                         let freshness = Math.round((Date.now() - localStorage.when)/1000) + " second(s)";
                         document.getElementById("myLastUpdated").innerHTML = freshness;
                         update_weather_backup(country, data);
                         alert("Weather is from api");
                    }
               }
          } else {
               let weather = result[0];
               document.querySelector(".city").innerHTML = weather.country;
               document.querySelector(".temp").innerHTML = Math.round(weather.temperature) + "ºC";
               document.querySelector(".humidity").innerHTML = weather.humidity + "%";
               document.querySelector(".wind").innerHTML = weather.wind_speed + "km/h";
               if (weather.weather == "Clouds") {
                    weatherIcon.src = "images/clouds.png";
               } else if (weather.weather == "Clear") {
                    weatherIcon.src = "images/clear.png";
               } else if (weather.weather == "Rain") {
                    weatherIcon.src = "images/rain.png";
               } else if (weather.weather == "Drizzle") {
                    weatherIcon.src = "images/drizzle.png";
               } else if (weather.weather == "Mist") {
                    weatherIcon.src = "images/mist.png";
               }
               document.querySelector(".weather").style.display = "block";
               alert("Weather is from database");
          }
     } catch (error) {
          console.error(error);
     }
}

load_weather();
