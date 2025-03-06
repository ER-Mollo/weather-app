import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import ForecastCard from "@/components/ForeCastCard";

export default function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
    
    // Fetch weather using geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.warn("Geolocation denied or unavailable:", error);
          setError("Location access denied. Please search for a city.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setError(null);
      setLoading(true);
      
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      if (!apiKey) {
        setError("Missing API Key. Please check your environment variables.");
        setLoading(false);
        return;
      }

      // Fetch current weather using coordinates
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      setWeather(weatherRes.data);
      setCity(weatherRes.data.name); // Update city name

      // Fetch 5-day forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );

      const dailyForecast = forecastRes.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);
    } catch (err) {
      setError("Failed to fetch weather for your location.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a valid city name.");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      if (!apiKey) {
        setError("Missing API Key. Please check your environment variables.");
        setLoading(false);
        return;
      }

      // Fetch weather by city name
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeather(weatherRes.data);

      // Fetch 5-day forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );

      const dailyForecast = forecastRes.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );
      setForecast(dailyForecast);
    } catch (err) {
      setError("City not found or API error.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-700 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🌤 Weather Forecast App</h1>

      {/* SearchBar Component */}
      <SearchBar city={city} setCity={setCity} fetchWeather={fetchWeather} />

      {/* Display Error Message */}
      {error && <p className="text-red-400 mt-2">{error}</p>}

      {/* Loading State */}
      {loading && <p className="text-yellow-300 mt-3">Fetching weather data...</p>}

      {/* Display Weather Info */}
      {weather && <WeatherCard weather={weather} />}

      {/* Display 5-Day Forecast */}
      {forecast.length > 0 && <ForecastCard forecast={forecast} />}
    </div>
  );
}
