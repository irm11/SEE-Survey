import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const countries = ["Pakistan", "United States", "Germany", "India"];

function Createform() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSiteID, setSelectedSiteID] = useState("");
  const [cities, setCities] = useState([]);
  const [projects, setProjects] = useState([]);


 //fecthing ct AND PROJECT FROIM API END POINT
  useEffect(() => {
    axios.get('http://localhost:8000/projects/projects/')
      .then(response => {
        const data = response.data;
        const citiesList = data.map(item => item.ct);
        const projectList = data.map(item => item.project_name);
        setCities(citiesList);
        setProjects(projectList);
  
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // POST THE FORM DATA API:
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = {
      site_id: selectedSiteID || "",
      site_name: "",
      region: selectedCountry || "",
      city: selectedCity || "",
      longitude: 0,
      latitude: 0,
      site_elevation: 0,
      address: ""
    };
  
    try {

      
 // for redirecting
      const response = await axios.post('http://localhost:8000/site-location/', formData);
  
      if (response.status === 200 || response.status === 201) {
        const createdSiteId = response.data.site_id || selectedSiteID;
  
        alert("Survey created successfully!");
        console.log("Response:", response.data);
  
        // 🔁 Redirect to Site Location Form
        navigate(`/sites/${createdSiteId}/site-info/Site-Location`);
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Something went wrong!");
      }
    } catch (error) {
      console.error("Error posting form data:", error);
      if (error.response) {
        console.log("Server error response:", error.response.data);
      }
      alert("Something went wrong!");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create A new Survey</h2>

        {/* Country */}
        <div className="mb-4">
          <label htmlFor="country" className="block text-gray-700 mb-2">Country:</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select Country --</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 mb-2">CT</label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">-- Select CT --</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Project */}
        <div className="mb-4">
          <label htmlFor="project" className="block text-gray-700 mb-2">Project:</label>
          <select
            id="project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">-- Select Project --</option>
            {projects.map((project, index) => (
              <option key={index} value={project}>{project}</option>
            ))}
          </select>
        </div>

        {/* Site ID */}
        <div className="mb-4">
          <label htmlFor="siteId" className="block text-gray-700 mb-2">SITE ID</label>
          <input
            type="number"
            id="siteId"
            value={selectedSiteID}
            onChange={(e) => setSelectedSiteID(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Create Survey
        </button>
      </form>
    </div>
  );
}

export default Createform;
