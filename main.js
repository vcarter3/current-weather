window.addEventListener('load', ()=> {

    
    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let locationPlace = document.querySelector(".location-place");

    let temperatureSection = document.querySelector(".temperature");
    const temperatureSpan = document.querySelector(".temperature span");



    
    const apiKey = config.API_KEY;

    let long;
    let lat;

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const api = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search.json?q=${lat},${long}&apikey=${apiKey}`
            
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const {LocalizedName, Key} = data;
                
                    locationPlace.textContent = LocalizedName;

                    return fetch(`http://dataservice.accuweather.com/currentconditions/v1/${Key}.json?apikey=${apiKey}`)

                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    const {Temperature, WeatherText, LocalObservationDateTime, WeatherIcon} = data[0];
                    temperatureDescription.textContent = WeatherText;

                    temperatureUnit(Temperature, temperatureSpan, temperatureDegree);
                    setIcons(WeatherIcon, document.querySelector(".icon"));

                })

        });
    } else{
        console.log("no location shared");
    }

    function temperatureUnit(Temperature, temperatureSpan, temperatureDegree){
        // change unit from F to C and back ... metric by default

        temperatureDegree.textContent = Temperature.Metric.Value;

        temperatureSection.addEventListener('click', () => {
            if(temperatureSpan.textContent == "F"){
                temperatureDegree.textContent = Temperature.Metric.Value;
                temperatureSpan.textContent = "C";
            } else {
                temperatureDegree.textContent = Temperature.Imperial.Value;
                temperatureSpan.textContent = "F";
            }
        }
        )
        }

    function setIcons(WeatherIcon, iconID){
        // match WeatherIcon number to skycon function

        const skycons = new Skycons({color: "white"});
        let currentIcon = "PARTLY_CLOUDY_DAY";

        const CLEAR_DAY = [1,2,3,30];
        const CLEAR_NIGHT = [33,34]
        //const PARTLY_CLOUDY_DAY = [4,5]
        const CLOUDY = [6,7,8,35,36,37, 38];
        const RAIN = [12,13,14,15,16,17,18,26,29,39,40,41,42,43,44];
        const SLEET = [19,20,21,25];
        const SNOW = [22,23,24,31];
        const WIND = [32];
        const FOG = [11];

        if(CLEAR_DAY.includes(WeatherIcon)){
            currentIcon = "CLEAR_DAY";
        } else if (CLEAR_NIGHT.includes(WeatherIcon)){
            currentIcon = "CLEAR_NIGHT";
        } else if (CLOUDY.includes(WeatherIcon)){
            currentIcon = "CLOUDY";
        } else if (RAIN.includes(WeatherIcon)){
            currentIcon = "RAIN";
        } else if (SLEET.includes(WeatherIcon)){
            currentIcon = "SLEET";
        } else if (SNOW.includes(WeatherIcon)){
            currentIcon = "SNOW";
        } else if (WIND.includes(WeatherIcon)){
            currentIcon = "WIND";
        } else if (FOG.includes(WeatherIcon)){
            currentIcon = "FOG";
        }

        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);

    }


    
});

