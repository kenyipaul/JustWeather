import { useState } from "react"
import "./app.css"
import { useRef } from "react"

export default function App() {

    const weatherCoverRef = useRef()
    const [response, setResponse] = useState([])
    const [currentTab, setCurrentTab] = useState(0)

    const search = async () => {

        setCurrentTab(1)

        const searchQuery = document.getElementById('city').value
        const search_url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchQuery}?unitGroup=metric&key=BNPU8J67RVZMAC83RTLU25THJ`
            
        try {
            const response = await fetch(search_url)
            const data = await response.json()

            let currentConditions = data.currentConditions
            currentConditions.location = data.timezone
            
            setResponse(data.currentConditions)
            setCurrentTab(2)

        } catch(err) {
            if (confirm('An error occurred, please try again')) {
                setCurrentTab(0)
            }
        }


    }


    const useLocation = () => {
        // Check if geolocation is available in the browser
if ("geolocation" in navigator) {
    // Get the user's current location
        navigator.geolocation.getCurrentPosition(async function(position) {
                // The user's latitude and longitude are in position.coords.latitude and position.coords.longitude
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const searchQuery = document.getElementById('city').value
                const search_url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${latitude},${longitude}?unitGroup=metric&key=BNPU8J67RVZMAC83RTLU25THJ`
                    
                try {
                    const response = await fetch(search_url)
                    const data = await response.json()
        
                    let currentConditions = data.currentConditions
                    currentConditions.location = data.timezone
                    
                    setResponse(data.currentConditions)
                    setCurrentTab(2)
                } catch (err) {
                    console.log(err)
                }

                // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        }, function(error) {
                // Handle errors, if any
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert("User denied the request for geolocation.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert("Location information is unavailable.");
                        break;
                    case error.TIMEOUT:
                        alert("The request to get user location timed out.");
                        break;
                    case error.UNKNOWN_ERROR:
                        alert("An unknown error occurred.");
                        break;
                }
            });
        } else {
            console.error("Geolocation is not available in this browser.");
        }
    }

    return (
        <div id="app">
            
            {currentTab == 0 ?
            <div className="form">
                <h2>Weather App</h2>
                <div className="content">
                    <input type="text" id="city" placeholder="Enter city name..." />
                    <button className="searchBtn" onClick={search}>SEARCH</button>
                    <h4>OR</h4>
                    <button className="locationBtn" onClick={useLocation}>USE MY LOCATION</button>
                </div>
            </div> : ''}
            
            {currentTab == 1 ? <span className="loader"></span> : '' }

            {currentTab == 2 ?
            <div className="results">
                
                <header>
                    <button onClick={() => setCurrentTab(0) }>EXIT</button>
                    <h2>Weather App</h2>
                </header>

                <main>
                    <img className="weather-cover" src={
                        response.conditions == "Partially cloudy" ? "./src/assets/partly_cloudy.png" :
                        response.conditions == "Clear" || response.conditions == "Clear sky" ? "./src/assets/sun.png" :
                        response.conditions == "Cloudy" ? "./src/assets/clouds.png" :
                        response.conditions == "Rain" ? "./src/assets/heavy-rain.png" :
                        response.conditions == "Snow" ? "./src/assets/snow.png" :
                        response.conditions == "Thunderstorm" ? "./src/assets/storm.png" :
                        response.conditions == "Fog" ? "./src/assets/fog.png" :
                        response.conditions == "Mist" ? "./src/assets/mist.png" :
                        response.conditions == "Overcast" ? "./src/assets/overcast.png" :
                        response.conditions == "Wind" || response.conditions == "Windy" ? "./src/assets/windy.png" : './src/assets/weather-app.png'
                    } />
                    <h1>{response.temp} ℃</h1>
                    <h2>{response.conditions}</h2>
                    <h3><img src="./src/assets/icons/place.png" alt="location" />{response.location}</h3>
                </main>

                <footer>
                    <div className="info">
                        <img src="./src/assets/icons/humidity.png" alt="" />
                        <div>
                            <h3>{response.humidity} %</h3>
                            <h4>Humidity</h4>
                        </div>
                    </div>
                    <div className="info">
                        <img src="./src/assets/icons/wind.png" alt="" />
                        <div>
                            <h3>{response.windspeed} kph</h3>
                            <h4>Wind Speed</h4>
                        </div>
                    </div>
                </footer>

            </div> : ''}

        </div>
    )
}


