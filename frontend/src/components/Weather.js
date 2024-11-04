import React, { useState } from "react";
import "../styles/Weather.css";

function Weather() {
  // Existing state
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

  const getWeatherByLocation = () => {
    setZip("");
    setLoading(true);
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
        setError(null);
      } catch (err) {
        setWeatherData(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
  };

  const convertTemperature = (temp) => {
    return isCelsius ? ((temp - 32) * 5) / 9 : temp;
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  // Determine background class based on weather condition
  const getBackgroundClass = () => {
    if (!weatherData || !weatherData.weather) return "";
    const mainCondition = weatherData.weather[0].main.toLowerCase();
    if (mainCondition.includes("rain")) return "rainy-bg";
    if (mainCondition.includes("cloud")) return "cloudy-bg";
    if (mainCondition.includes("thunderstorm")) return "thunderstorm-bg";
    if (mainCondition.includes("snow")) return "snowy-bg";
    return "clear-bg"; // Default background
  };

  return (
    <div className="container weather-app-container">
      <h1 className="weather-app-header">Weather App</h1>

      {/* Input Section */}
      <div className="card input-card shadow-sm p-4">
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
              disabled={!zip || loading}
            >
              {loading ? "Loading..." : "Get Weather"}
            </button>
          </div>
        </div>
        <button
          className="btn btn-secondary weather-button"
          onClick={getWeatherByLocation}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Weather by Location"}
        </button>
        {loading && <div className="loading">Loading data...</div>}
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Result Section */}
      {weatherData && weatherData.main && weatherData.weather && !loading ? (
        <div
          className={`card result-card shadow-sm p-4 ${getBackgroundClass()}`}
        >
          <div className="weather-data">
            <h2>{weatherData.name}</h2>
            <p className="temperature">
              Temperature:{" "}
              {convertTemperature(weatherData.main.temp).toFixed(1)}°
              {isCelsius ? "C" : "F"}
            </p>
            <p>
              Feels Like:{" "}
              {convertTemperature(weatherData.main.feels_like).toFixed(1)}°
              {isCelsius ? "C" : "F"}
            </p>
            <p>
              Highest:{" "}
              {convertTemperature(weatherData.main.temp_max).toFixed(1)}°
              {isCelsius ? "C" : "F"}
            </p>
            <p>
              Lowest: {convertTemperature(weatherData.main.temp_min).toFixed(1)}
              °{isCelsius ? "C" : "F"}
            </p>
            <p>Condition: {weatherData.weather[0].description}</p>
            <p>Humidity: {weatherData.main.humidity}%</p>
            <p>
              Sunrise:{" "}
              {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}
            </p>
            <p>
              Sunset:{" "}
              {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}
            </p>
            <button className="toggle-button" onClick={toggleTemperatureUnit}>
              °{isCelsius ? "F" : "C"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Weather;
