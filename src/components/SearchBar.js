export default function SearchBar({ city, setCity, fetchWeather }) {
    return (
      <div className="flex gap-3 bg-white p-2 rounded-xl shadow-lg w-full max-w-md">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-2 text-gray-800 rounded-md focus:outline-none"
        />
        <button 
          onClick={fetchWeather} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Search
        </button>
      </div>
    );
  }
  