export default function SearchBar({ city, setCity, fetchWeather }) {
    return (
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border rounded-md w-64"
        />
        <button 
          onClick={fetchWeather} 
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    );
  }
  