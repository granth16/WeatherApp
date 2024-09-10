import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const cities = [
    {city:'New York'},
    {city:'Los Angeles'},
    {city:'Chicago'},
    {city:'Las Vegas'},
    {city:'Houston'}
  ]
  const[searchTerm , setSearchTerm] = useState("");
  const[suggestions , setSuggestions] = useState([]);
  const[selectedCity,setSelectedCity]= useState("");
  const[weatherData,setWeatherData]= useState(null);
 const[error,setError] = useState(null);
  const losAngelesCoordinates = {
   latitude:  34.052235 ,
  longitude: -118.243683 
  };
 const fetchWeatherData = async(latitude,longitude)=>{
  try{
    const response = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
    if(!response.ok){
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    
    const weatherForecast = await fetch(data.properties.forecast);
    const newData = weatherForecast.json();
    console.log(newData

      ,"newdata");
    setWeatherData(newData);
    setError(null);
   }
   catch(err){
    setWeatherData(null);
    setError(err.message);
   };
 }
  useEffect(()=>{
   if(selectedCity === "Los Angeles"){
    fetchWeatherData(losAngelesCoordinates.latitude,losAngelesCoordinates.longitude);
   }
  },[selectedCity])
  const handleSelect = (city) =>{
  setSelectedCity(city);
  setSearchTerm(city);
  setSuggestions([]);
  }

const handleChange =(e) =>{
  const value = e.target.value;
  setSearchTerm(value);
  if(value){
    const filteredSuggestions = cities.filter((city) => city.city.toLowerCase().includes(value.toLowerCase()) );
   setSuggestions(filteredSuggestions);
  }
  else{
   setSuggestions([]);
  }
};


  return (
    <>
     <div  className='main_body'>
      <h1>Weather App</h1>
      <input type="text" onChange={handleChange} placeholder='Search City'  value={searchTerm}/>
      <ul>
        {suggestions.map((suggestion,index)=>(
          <li key={index} onClick={()=>handleSelect(suggestion.city)}>
            {suggestion.city}
          </li>
        ))}
      </ul>
      {error &&<p></p>}
      {weatherData&&(
        <div>
          <h2>Weather Forecast</h2>
        </div>
      )}
     </div>
    </>
  )
}

export default App
