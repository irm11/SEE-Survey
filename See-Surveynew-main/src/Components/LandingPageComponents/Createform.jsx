import React, { useState } from 'react'

const countries = ["Pakistan", "United States", "Germany", "India"];
const cities = ["Karachi", "Lahore", "Islamabad", "Berlin", "New York"];
const Projects = ["Project1", "Project2", "Project3"];

  


function Createform() {
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedproject, setSelectedproject] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      alert(`Country: ${selectedCountry}\nCity: ${selectedCity}\nGender: ${selectedproject}`);
    };

  return (
    
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Create A new Form</h2>
    
            {/* Country */}
            <div className="mb-4">
              <label htmlFor="country" className="block text-gray-700 mb-2">
                Country:
              </label>
              <select
                id="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Country --</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
    
            {/* Ct */}
            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-700 mb-2">
                CT
              </label>
              <select
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select CT --</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
    
            {/* project */}
            <div className="mb-4">
              <label htmlFor="gender" className="block text-gray-700 mb-2">
               Project:
              </label>
              <select
                id="project"
                value={selectedproject}
                onChange={(e) => setSelectedproject(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- Select project --</option>
                {Projects.map((Projects, index) => (
                  <option key={index} value={Projects}>
                    {Projects}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="gender" className="block text-gray-700 mb-2">
               SITE ID
              </label>
              <input type="number" className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500' />
            </div>
    
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Create Form
            </button>
          </form>
        </div>
      );
    }


export default Createform