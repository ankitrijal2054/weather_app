import React, { useState, useEffect, useCallback } from "react";
import "../styles/Weather.css";
import { FaLocationCrosshairs } from "react-icons/fa6";
import logo from "../assets/logo.png";
import sunriseIcon from "../assets/sunrise.png";
import sunsetIcon from "../assets/sunset.png";

function Weather() {
  const [zip, setZip] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locLoading, setlocLoading] = useState(false);

  const getWeatherByZip = async () => {
    setLoading(true);
    try {
      // Fetch location data first
      const locationData = await getLocationData(zip);
      if (!locationData) return; // Exit if location data could not be retrieved

      // Fetch weather data
      const response = await fetch(
        `https://weather-app-d50z.onrender.com/weather?zip=${zip}`
      );
      if (!response.ok) {
        throw new Error("Invalid zip code. Please try again.");
      }
      const weatherData = await response.json();

      // Combine location and weather data
      setWeatherData({
        ...weatherData,
        ...locationData,
      });
      setError(null);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getZipCodeByLocation = () => {
    setlocLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(
          "https://weather-app-d50z.onrender.com/get-zipcode",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setWeatherData(null);
          throw new Error(data.error || "Unable to retrieve zip code.");
        }

        setZip(data.zipcode); // Set zip code field with the detected zip
      } catch (err) {
        setWeatherData(null);
        setError(err.message);
      } finally {
        setlocLoading(false);
      }
    });
  };

  const getLocationData = async (zip) => {
    try {
      const response = await fetch(
        `https://weather-app-d50z.onrender.com/get_location_data?zip=${zip}`
      );
      if (!response.ok) throw new Error("Invalid ZIP code or unsupported area");

      const data = await response.json();

      return {
        city: data.city,
        state: data.state,
        country: data.country,
      };
    } catch (err) {
      setWeatherData(null);
      setError("Please enter a valid ZIP code");
      return null;
    }
  };

  const convertTemperature = (temp) => {
    return isCelsius ? ((temp - 32) * 5) / 9 : temp;
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  const getBackgroundClass = useCallback(() => {
    if (!weatherData || !weatherData.weather) return "default-bg";
    const mainCondition = weatherData.weather[0].main.toLowerCase();
    if (mainCondition.includes("rain")) return "rainy-bg";
    if (mainCondition.includes("cloud")) return "cloudy-bg";
    if (mainCondition.includes("thunderstorm")) return "thunderstorm-bg";
    if (mainCondition.includes("snow")) return "snowy-bg";
    return "clear-bg";
  }, [weatherData]);

  useEffect(() => {
    document.body.className = getBackgroundClass();
  }, [getBackgroundClass]);

  return (
    <div className="weather-app-container">
      <img
        src={logo}
        alt="Weather App Logo"
        className="weather-logo"
        onClick={() => {
          setWeatherData(null);
          setZip("");
        }}
        style={{ cursor: "pointer" }}
      />
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
        {locLoading && (
          <div className="loading">Getting current location zipcode...</div>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="result-section">
        {weatherData && weatherData.main && weatherData.weather && !loading ? (
          <div className="card result-card modern-result-card shadow-sm p-4">
            <div className="weather-data">
              <h2 className="city-name">
                {weatherData.city}, {weatherData.state}, {weatherData.country}
              </h2>

              <p className="temperature">
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
              <div className="sun-times">
                <div className="sun-time">
                  <img
                    src={sunriseIcon}
                    alt="Sunrise Icon"
                    className="sun-icon"
                  />
                  <p>
                    {new Date(
                      weatherData.sys.sunrise * 1000
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="sun-time">
                  <img
                    src={sunsetIcon}
                    alt="Sunset Icon"
                    className="sun-icon"
                  />
                  <p>
                    {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>

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
      <footer className="footer">
        <a
          href="https://github.com/ankitrijal2054/weather_app"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Created by Ankit Rijal
        </a>
      </footer>
    </div>
  );
}

export default Weather;
