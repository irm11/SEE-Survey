import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const countries = ["Pakistan", "United States", "Germany", "India"];

function Createform() {
  const navigate = useNavigate();
  
  // State management
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedSiteID, setSelectedSiteID] = useState("");
  const [cities, setCities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetching cities and projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:8000/projects/projects/');
        const data = response.data;
        setCities(data.map(item => item.ct));
        setProjects(data.map(item => item.project_name));
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to fetch cities and projects.");
      }
    };
    fetchProjects();
  }, []);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Prepare formData for submission
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

    console.log("Form Data to Submit:", formData);

    // ✅ Post Request
    try {
      const response = await axios.post('http://localhost:8000/site-location/', formData);

      // If response is OK, navigate immediately
      if (response.status === 200 || response.status === 201) {
        const createdSiteId = response.data.site_id || selectedSiteID;

        console.log("Response Data:", response.data);
        setSuccess("Survey created successfully!");
        alert("Survey created successfully!");
        console.log("Navigating to:", `/sites/${createdSiteId}/site-info/Site-Location`);

        // ✅ Navigate to the Site Location Page
        navigate(`/sites/${createdSiteId}/site-info/Site-Location`);
      } else {
        throw new Error("Unexpected response status.");
      }
    } catch (error) {
      console.error("Error posting form data:", error.message);
      setError("submitting the form.");
      alert("please wait ...");
    } finally {
      setLoading(false);

      // ✅ Navigate in any case after 2 seconds
      setTimeout(() => {
        console.log("Forced Navigation to:", `/sites/${selectedSiteID}/site-info/Site-Location`);
        navigate(`/sites/${selectedSiteID}/site-info/Site-Location`);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create A New Survey</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        {loading && <div className="text-blue-500 mb-4">Submitting... Please wait.</div>}

        {/* Country */}
        <div className="mb-4">
          <label htmlFor="country" className="block text-gray-700 mb-2">Country:</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">-- Select Country --</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 mb-2">City (CT):</label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">-- Select City --</option>
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">-- Select Project --</option>
            {projects.map((project, index) => (
              <option key={index} value={project}>{project}</option>
            ))}
          </select>
        </div>

        {/* Site ID */}
        <div className="mb-4">
          <label htmlFor="siteId" className="block text-gray-700 mb-2">SITE ID:</label>
          <input
            type="number"
            id="siteId"
            value={selectedSiteID}
            onChange={(e) => setSelectedSiteID(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          {loading ? "Submitting..." : "Create Survey"}
        </button>
      </form>
    </div>
  );
}

export default Createform;
