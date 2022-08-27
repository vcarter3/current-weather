const temperatureDescription = document.querySelector(".temperature-description");
const temperatureDegree = document.querySelector(".temperature-degree");
const locationName = document.querySelector(".location-name");
const locationRegion = document.querySelector(".location-region");
const temperatureSection = document.querySelector(".temperature");
const temperatureSpan = document.querySelector(".temperature span");
const searchBar = document.querySelector(".search-container");
const locationError = document.querySelector(".location-error");
const apiKey = config.API_KEY;

const events = () => {
    const auto = document.querySelector(".user-auto");
    const search = document.querySelector(".user-search");
    const inputText = document.querySelector(".button");

    // auto find location
    auto.addEventListener("click", () => {
        autoWeather();
    });

    // manual find location
    search.addEventListener("click", () => {
        manualWeather();
    });
    inputText.addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
            manualWeather();
        }
    })
};

events();



async function weatherLatLong(lat, long) {
    const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search.json?q=${lat},${long}&apikey=${apiKey}`, { mode: 'cors' });

    const weatherData = await response.json();


    const { LocalizedName, Country, Key } = weatherData;
    locationName.textContent = LocalizedName;
    locationRegion.textContent = Country.ID;

    return findCurrentWeather(Key, apiKey)
}

function autoWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {

                let long = position.coords.longitude;
                let lat = position.coords.latitude;
                weatherLatLong(lat, long);
            }
            ,
            console.log("asking for geo-location")
        );
    } else {
        console.log("no geo-location")
    }
}

function manualWeather() {
    // use input
    const userLocation = document.querySelector(".user-location").value;
    if (userLocation == "") { return }
    weatherUserLocation(userLocation)
}

async function findCurrentWeather(Key, apiKey) {
    const response = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${Key}.json?apikey=${apiKey}`, { mode: "cors" })
    console.log(response)
    const weatherData = await response.json();

    const {
        Temperature,
        WeatherText,
        WeatherIcon,
    } = weatherData[0];
    temperatureDescription.textContent = WeatherText;

    temperatureUnit(
        Temperature,
        temperatureSpan,
        temperatureDegree
    );
    setIcons(
        WeatherIcon,
        document.querySelector(".icon")
    );

}

async function weatherUserLocation(userLocation) {
    const response = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${userLocation}&language=en-uk`, { mode: 'cors' });
    const weatherData = await response.json();

    if (weatherData.length > 0) {
        const suggestions = document.querySelector(".suggestions");
        let suggestionsMax = (weatherData.length < 3 ? weatherData.length : 3)

        for (let i = 0; i < suggestionsMax; i++) {
            const newSuggestion = document.createElement("div");
            newSuggestion.className = "suggestions" + String(i);
            suggestions.appendChild(newSuggestion);

            let { AdministrativeArea, LocalizedName, Country, Key } = weatherData[i];
            const suggestion = document.querySelector(".suggestions" + String(i));
            suggestion.textContent = LocalizedName + ", " + AdministrativeArea.LocalizedName + ", " + Country.ID;

            suggestion.addEventListener("click", () => {
                locationName.textContent = LocalizedName;
                locationRegion.textContent = Country.ID;
                // remove all

                [...suggestions.children].forEach(suggestion => {
                    suggestion.remove()
                })

                const clearInput = document.querySelector(".user-location");
                clearInput.value = "";
                clearInput.placeholder = "Change town or city";
                // search new api
                return findCurrentWeather(Key, apiKey);
            });
        }
    } else {

    }
}


function temperatureUnit(Temperature, temperatureSpan, temperatureDegree) {
    // change unit from F to C and back ... metric by default

    temperatureDegree.textContent = Temperature.Metric.Value;
    temperatureSpan.textContent = "C";

    temperatureSection.addEventListener("click", () => {
        if (temperatureSpan.textContent == "F") {
            temperatureDegree.textContent = Temperature.Metric.Value;
            temperatureSpan.textContent = "C";
        } else {
            temperatureDegree.textContent = Temperature.Imperial.Value;
            temperatureSpan.textContent = "F";
        }
    });
}



function colorMode() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if(prefersDarkScheme.matches){
        return "gray"
    }else{
    return "white"}
}
function setIcons(WeatherIcon, iconID) {
    const iconColor = colorMode();
    // match WeatherIcon number to skycon function
    const skycons = new Skycons({ color: iconColor });
    let currentIcon = "PARTLY_CLOUDY_DAY";

    const CLEAR_DAY = [1, 2, 3, 30];
    const CLEAR_NIGHT = [33, 34];
    //const PARTLY_CLOUDY_DAY = [4,5]
    const CLOUDY = [6, 7, 8, 35, 36, 37, 38];
    const RAIN = [12, 13, 14, 15, 16, 17, 18, 26, 29, 39, 40, 41, 42, 43, 44];
    const SLEET = [19, 20, 21, 25];
    const SNOW = [22, 23, 24, 31];
    const WIND = [32];
    const FOG = [11];

    if (CLEAR_DAY.includes(WeatherIcon)) {
        currentIcon = "CLEAR_DAY";
    } else if (CLEAR_NIGHT.includes(WeatherIcon)) {
        currentIcon = "CLEAR_NIGHT";
    } else if (CLOUDY.includes(WeatherIcon)) {
        currentIcon = "CLOUDY";
    } else if (RAIN.includes(WeatherIcon)) {
        currentIcon = "RAIN";
    } else if (SLEET.includes(WeatherIcon)) {
        currentIcon = "SLEET";
    } else if (SNOW.includes(WeatherIcon)) {
        currentIcon = "SNOW";
    } else if (WIND.includes(WeatherIcon)) {
        currentIcon = "WIND";
    } else if (FOG.includes(WeatherIcon)) {
        currentIcon = "FOG";
    }

    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}

