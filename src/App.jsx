import { useState, useEffect } from 'react';
import Slider from 'react-slick'; 
import './App.css';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

function App() {
  const cities = [
    { city: 'New York' },
    { city: 'Los Angeles' },
    { city: 'Chicago' },
    { city: 'Las Vegas' },
    { city: 'Houston' }
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const losAngelesCoordinates = {
    latitude: 34.052235,
    longitude: -118.243683
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      
      const weatherForecast = await fetch(data.properties.forecast);
      const newData = await weatherForecast.json();
      setWeatherData(newData.properties.periods); // Extract periods directly for carousel
      setError(null);
    } catch (err) {
      setWeatherData(null);
      setError(err.message);
    }
  };

  useEffect(() => {
    if (selectedCity === "Los Angeles") {
      fetchWeatherData(losAngelesCoordinates.latitude, losAngelesCoordinates.longitude);
    }
  }, [selectedCity]);

  const handleSelect = (city) => {
    setSelectedCity(city);
    setSearchTerm(city);
    setSuggestions([]);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      const filteredSuggestions = cities.filter((city) =>
        city.city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <div className='main_body'>
        <h1>Weather App</h1>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Search City"
          value={searchTerm}
        />
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSelect(suggestion.city)}>
              {suggestion.city}
            </li>
          ))}
        </ul>
        {error && <p>{error}</p>}
        {weatherData && (
          <div>
            <h2>Weather Forecast</h2>
            <Slider {...settings}>
              {weatherData.map((period, index) => (
                <div className="carousel-item" key={index}>
                  <div className="forecast-details">
                    <h3>{period.name}</h3>
                    <p>{period.shortForecast}</p>
                    <div className="hover-info">
                      <p>{period.detailedForecast}</p>
                      <p>Temperature: {period.temperature}°{period.temperatureUnit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
