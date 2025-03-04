export default function ForecastCard({ forecast }) {
    return (
      <div className="mt-6 bg-white text-gray-800 shadow-lg rounded-lg p-4 w-full max-w-3xl">
        <h2 className="text-xl font-bold text-center mb-4">📅 5-Day Forecast</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.map((day, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg flex flex-col items-center">
              <p className="font-semibold">
                {new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="w-14 h-14"
              />
              <p className="text-lg font-bold">{day.main.temp}°C</p>
              <p className="text-sm">{day.weather[0].description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  