import React, { useState, useEffect, useCallback } from "react";
import "../styles/Weather.css";
import { FaLocationCrosshairs } from "react-icons/fa6";

function Weather() {
  const [zip, setZip] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(false);
  const [loading, setLoading] = useState(false);

  const getWeatherByZip = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://weather-app-d50z.onrender.com/weather?zip=${zip}`
      );
      if (!response.ok) {
        throw new Error("Invalid zip code. Please try again.");
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getZipCodeByLocation = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // Reverse geolocation API to get the zip code from latitude and longitude
        const locationResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const locationData = await locationResponse.json();
        const locationZip = locationData.postcode;

        if (!locationZip) {
          throw new Error("Unable to retrieve zip code for your location.");
        }

        setZip(locationZip); // Set zip code field with the detected zip
      } catch (err) {
        setWeatherData(null);
        setError(err.message);
      }
    });
  };

  const convertTemperature = (temp) => {
    return isCelsius ? ((temp - 32) * 5) / 9 : temp;
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const getBackgroundClass = useCallback(() => {
    if (!weatherData || !weatherData.weather) return "";
    const mainCondition = weatherData.weather[0].main.toLowerCase();
    if (mainCondition.includes("rain")) return "rainy-bg";
    if (mainCondition.includes("cloud")) return "cloudy-bg";
    if (mainCondition.includes("thunderstorm")) return "thunderstorm-bg";
    if (mainCondition.includes("snow")) return "snowy-bg";
    return "clear-bg"; // Default background
  }, [weatherData]);

  useEffect(() => {
    document.body.className = getBackgroundClass();
  }, [getBackgroundClass]);

  return (
    <div className="weather-app-container">
      <h1 className="weather-app-header">Weather App</h1>
      <div className="input-section card shadow-sm p-4">
        <div className="input-group weather-input-group">
          <input
            type="text"
            className="form-control modern-input"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="Enter Zip Code"
          />
          <button
            className="location-button"
            onClick={getZipCodeByLocation}
            disabled={loading}
            title="Use Current Location"
          >
            <FaLocationCrosshairs />
          </button>
          <div className="button-center">
            <button
              className="btn modern-button primary-button"
              onClick={getWeatherByZip}
              disabled={!zip || loading}
            >
              {loading ? "Loading..." : "Get Weather"}
            </button>
          </div>
        </div>
        {loading && <div className="loading">Loading data...</div>}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="result-section">
        {weatherData && weatherData.main && weatherData.weather && !loading ? (
          <div className="card result-card modern-result-card shadow-sm p-4">
            <div className="weather-data">
              <h2 className="city-name">{weatherData.name}</h2>
              <p className="temperature">
                Temperature:{" "}
                {convertTemperature(weatherData.main.temp).toFixed(1)}°
                {isCelsius ? "C" : "F"}
              </p>
              <p className="feels-like">
                Feels Like:{" "}
                {convertTemperature(weatherData.main.feels_like).toFixed(1)}°
                {isCelsius ? "C" : "F"}
              </p>
              <p className="temp-range">
                High: {convertTemperature(weatherData.main.temp_max).toFixed(1)}
                ° | Low:{" "}
                {convertTemperature(weatherData.main.temp_min).toFixed(1)}°
              </p>
              <p className="condition">
                Condition: {weatherData.weather[0].description}
              </p>
              <p className="humidity">Humidity: {weatherData.main.humidity}%</p>
              <p className="sun-times">
                Sunrise:{" "}
                {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
                <br />
                Sunset:{" "}
                {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
              </p>
              <button
                className="toggle-button modern-toggle"
                onClick={toggleTemperatureUnit}
              >
                °{isCelsius ? "F" : "C"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Weather;
