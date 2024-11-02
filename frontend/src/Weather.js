import React, { useState } from "react";

function Weather() {
  const [zip, setZip] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const getWeatherByZip = async () => {
    const response = await fetch(
      `https://weather-app-d50z.onrender.com/weather?zip=${zip}`
    );
    const data = await response.json();
    setWeatherData(data);
  };

  const getWeatherByLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `https://weather-app-d50z.onrender.com/weather?lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      setWeatherData(data);
    });
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        placeholder="Enter Zip Code"
      />
      <button onClick={getWeatherByZip}>Get Weather by Zip</button>
      <button onClick={getWeatherByLocation}>Get Weather by Location</button>
      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°F</p>
          <p>Condition: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
