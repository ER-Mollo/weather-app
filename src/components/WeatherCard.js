import { useState } from "react";

export default function WeatherCard({ weather }) {
  const [isCelsius, setIsCelsius] = useState(true);

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  const temperature = isCelsius
    ? weather.main.temp
    : (weather.main.temp * 9) / 5 + 32; // Convert to Fahrenheit

  return (
    <div className="mt-6 bg-white text-gray-800 shadow-lg rounded-lg p-6 w-80 text-center">
      <h2 className="text-xl font-bold">{weather.name}, {weather.sys.country}</h2>
      <p className="text-lg">{weather.weather[0].description}</p>

      {/* Weather Icon */}
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
        className="mx-auto my-2 w-20"
      />

      {/* Temperature with Toggle Button */}
      <p className="text-3xl font-bold">{temperature.toFixed(1)}°{isCelsius ? "C" : "F"}</p>
      <button
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        onClick={toggleTemperature}
      >
        Toggle °C / °F
      </button>
    </div>
  );
}
