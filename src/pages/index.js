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

  // Load favorite cities from localStorage on mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const fetchWeather = async (selectedCity = city) => {
    if (!selectedCity.trim()) {
      setError("Please enter a city name");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

      // Fetch current weather
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=${apiKey}`
      );
      setWeather(weatherRes.data);

      // Fetch 5-day forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=${apiKey}`
      );

      // Filter to show one forecast per day (12:00 PM)
      const dailyForecast = forecastRes.data.list.filter((reading) =>
        reading.dt_txt.includes("12:00:00")
      );

      setForecast(dailyForecast);

      // Save to favorites if it's a new city
      if (!favorites.includes(selectedCity)) {
        const updatedFavorites = [...favorites, selectedCity];
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      }
    } catch (err) {
      setError("City not found or API error");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking a favorite city
  const handleFavoriteClick = (favCity) => {
    setCity(favCity);
    fetchWeather(favCity);
  };

  // Remove a city from favorites
  const handleRemoveFavorite = (favCity) => {
    const updatedFavorites = favorites.filter((city) => city !== favCity);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-700 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🌤 Weather Forecast App</h1>

      {/* SearchBar Component */}
      <SearchBar city={city} setCity={setCity} fetchWeather={fetchWeather} />

      {/* Favorite Cities List */}
      {favorites.length > 0 && (
        <div className="mt-4 p-4 bg-white bg-opacity-20 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">⭐ Favorite Cities</h2>
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav, index) => (
              <div key={index} className="flex items-center space-x-2">
                <button
                  onClick={() => handleFavoriteClick(fav)}
                  className="bg-white bg-opacity-30 px-3 py-1 rounded-md hover:bg-opacity-50 transition"
                >
                  {fav}
                </button>
                <button
                  onClick={() => handleRemoveFavorite(fav)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
