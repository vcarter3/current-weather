window.addEventListener("load", () => {
    const temperatureDescription = document.querySelector(".temperature-description");
    const temperatureDegree = document.querySelector(".temperature-degree");
    const locationName = document.querySelector(".location-name");
    const locationRegion = document.querySelector(".location-region");
    const temperatureSection = document.querySelector(".temperature");
    const temperatureSpan = document.querySelector(".temperature span");
    const noLocation = document.querySelector(".no-location");
    const locationError = document.querySelector(".location-error");
    const inputText = document.querySelector(".button");
    const apiKey = config.API_KEY;


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {

                noLocation.remove();

                let long = position.coords.longitude;
                let lat = position.coords.latitude;
                const api_geolocation = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search.json?q=${lat},${long}&apikey=${apiKey}`;

                fetch(api_geolocation)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        const {LocalizedName, Country, Key } = data;

                        locationName.textContent = LocalizedName;
                        locationRegion.textContent = Country.ID;

                        return findCurrentWeather(Key, apiKey) })
            }
            ,
            () => {
                findLocationManually(inputText,locationError);
            }
        );
    }

    function findCurrentWeather(Key, apiKey){

        const api_weather = `http://dataservice.accuweather.com/currentconditions/v1/${Key}.json?apikey=${apiKey}`;


        fetch(api_weather)
                                        
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const {
                Temperature,
                WeatherText,
                WeatherIcon,
            } = data[0];
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
        });

    }

    function findLocationManually(inputText,locationError){

    inputText.innerHTML = `<input class="user-location" placeholder= "Enter town or city"></input>`;
    locationError.textContent = "Cannot find location";

    inputText.addEventListener("keydown", (e) => {

        if (e.keyCode === 13) {

            const userLocation = document.querySelector(".user-location").value;
            const api_autocomplete = `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${userLocation}&language=en-uk`;


            fetch(api_autocomplete)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {


                    if (data.length > 0) {

                        console.log(data);

                        document.querySelector(".suggestions").innerHTML = `<div class = "suggestions0"></div><div class = "suggestions1"></div><div class = "suggestions2"></div>`;

                        for (let i = 0; i < 3; i++) {

                            let {AdministrativeArea, LocalizedName, Country, Key } = data[i];
                            const suggestion = document.querySelector(".suggestions" + String(i));
                            suggestion.textContent = LocalizedName + ", " + AdministrativeArea.LocalizedName +", "+ Country.ID;
                            

                            suggestion.addEventListener("click", () => {
                                
                                locationName.textContent = LocalizedName;
                                locationRegion.textContent = Country.ID;

                                // remove all
                                document.querySelector(".no-location").remove();

                                // search new api
                                findCurrentWeather(Key, apiKey);
                                });
                        }
                    }
                });
        }
    });
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

    function setIcons(WeatherIcon, iconID) {
        // match WeatherIcon number to skycon function

        const skycons = new Skycons({ color: "white" });
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
});
