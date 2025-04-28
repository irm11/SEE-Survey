import { useState } from 'react';

const SiteLocationForm = () => {
  const [formData, setFormData] = useState({
    latitude: '',
    longitude: '',
    siteName: '',
    address: '',
    description: '',
    frontImage: null,
    sideImage: null,
    topImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] }); // Handle image upload
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getMapUrl = () => {
    const { latitude, longitude } = formData;
    if (!latitude || !longitude) return defaultMap;
    return `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  };

  const defaultMap = "https://maps.google.com/maps?q=33.6844,73.0479&z=15&output=embed"; // Default Islamabad

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-2">
      <div className="bg-white p-3 rounded-xl shadow-md w-full ">

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Text Fields */}
          <input
            type="text"
            name="siteName"
            placeholder="Site Name"
            value={formData.siteName}
            onChange={handleChange}
            className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={handleChange}
            className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={handleChange}
            className="border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Image Uploads */}
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Front View Image</label>
            <input
              type="file"
              name="frontImage"
              accept="image/*"
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Side View Image</label>
            <input
              type="file"
              name="sideImage"
              accept="image/*"
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Top View Image</label>
            <input
              type="file"
              name="topImage"
              accept="image/*"
              onChange={handleChange}
              className="border p-2 rounded-md"
            />
          </div>
        </form>

        {/* Google Map Below Form */}
        <div className="w-full h-80">
          <iframe
            title="Google Map"
            src={getMapUrl()}
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            className="rounded-md shadow-md border"
          ></iframe>
        </div>
        <button className=' gap-3 p-6 w-50 h-5 items-center flex text-white bg-blue-600 border rounded'>Save And continue</button>
      </div>
      
    </div>
  );
};

export default SiteLocationForm;
