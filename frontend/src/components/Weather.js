import React, { useState } from "react";
import "../styles/Weather.css"; // Import the custom CSS file

function Weather() {
  const [zip, setZip] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const getWeatherByZip = async () => {
    try {
      const response = await fetch(
        `https://weather-app-d50z.onrender.com/weather?zip=${zip}`
      );

      if (!response.ok) {
        throw new Error("Invalid zip code. Please try again.");
      }

      const data = await response.json();
      setWeatherData(data);
      setError(null); // Clear any previous error message
    } catch (err) {
      setWeatherData(null); // Clear any previous weather data
      setError(err.message);
    }
  };

  const getWeatherByLocation = () => {
    setZip("");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          `https://weather-app-d50z.onrender.com/weather?lat=${latitude}&lon=${longitude}`
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve weather data for your location.");
        }

        const data = await response.json();
        setWeatherData(data);
        setError(null); // Clear any previous error message
      } catch (err) {
        setWeatherData(null);
        setError(err.message);
      }
    });
  };

  return (
    <div className="container weather-app-container card shadow-lg p-4">
      <h1 className="weather-app-header">Weather App</h1>
      <div className="input-group weather-input-group">
        <input
          type="text"
          className="form-control"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          placeholder="Enter Zip Code"
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            onClick={getWeatherByZip}
            disabled={!zip} // Enable only if zip code is entered
          >
            Get Weather
          </button>
        </div>
      </div>
      <button
        className="btn btn-secondary weather-button"
        onClick={getWeatherByLocation}
      >
        Get Weather by Location
      </button>
      {error && <p className="error-message">{error}</p>}
      {weatherData && weatherData.main && weatherData.weather && (
        <div className="weather-data">
          <h2>{weatherData.name}</h2>
          <p className="temperature">Temperature: {weatherData.main.temp}°F</p>
          <p>Condition: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
