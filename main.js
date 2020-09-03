window.addEventListener('load', ()=> {


    const apiKey = config.API_KEY;


    let long;
    let lat;

    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let locationPlace = document.querySelector(".location-place");

    let temperatureSection = document.querySelector(".temperature");
    const temperatureSpan = document.querySelector(".temperature span");

    
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
                    console.log(apiKey);

                    return fetch(`http://dataservice.accuweather.com/currentconditions/v1/${Key}.json?apikey=${apiKey}`)

                })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const {Temperature, WeatherText, LocalObservationDateTime, WeatherIcon} = data[0];

                    temperatureDegree.textContent = Temperature.Metric.Value;
                    temperatureDescription.textContent = WeatherText;
                    
                    setIcons(WeatherIcon, document.querySelector(".icon"));


                    //
                    temperatureSection.addEventListener('click', () => {
                        if(temperatureSpan.textContent == "F"){
                            temperatureSpan.textContent = "C";
                            temperatureDegree.textContent = Temperature.Metric.Value
                        } else {
                            temperatureSpan.textContent = "F";
                            temperatureDegree.textContent = Temperature.Imperial.Value
                        }
                    })


                })

        });
    }

    function setIcons(WeatherIcon, iconID){
        //match WeatherIcon number to skycon text

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