import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { showSuccess, showError } from '../../../utils/notifications';
import ImageUploader from '../../GalleryComponent';
import DynamicTable from '../../DynamicTable';

const OutdoorCabinetsForm = () => {
  const { sessionId } = useParams();
  const [formData, setFormData] = useState({
    numberOfCabinets: '',
    cabinets: Array(10).fill(null).map((_, index) => ({
      id: index + 1,
      type: [],
      vendor: '',
      model: '',
      antiTheft: '',
      coolingType: '',
      coolingCapacity: '',
      compartments: '',
      hardware: [],
      acPowerFeed: '',
      cbNumber: '',
      powerCableLength: '',
      powerCableCrossSection: '',
      blvd: '',
      blvdFreeCBs: '',
      blvdCBsRatings: [],
      llvd: '',
      llvdFreeCBs: '',
      llvdCBsRatings: [],
      pdu: '',
      pduFreeCBs: '',
      pduCBsRatings: [],
      internalLayout: '',
      freeU: '',
    }))
  });

  const [connectedModules, setConnectedModules] = useState([]);

  // Configuration for CB ratings tables
  const cbRatingsTableRows = [
    {
      key: 'rating',
      label: 'CB Rating (Amp)',
      type: 'number',
      placeholder: 'Enter rating...'
    },
    {
      key: 'connected_load',
      label: 'Connected Load',
      type: 'textarea',
      placeholder: 'Describe connected load...'
    }
  ];

  // Fetch existing data when component loads
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/outdoor-cabinets/${sessionId}`)
      .then(res => {
        const data = res.data.data || res.data;
        console.log("Fetched data:", data);

        if (data) {
          // Create a default cabinet template
          const defaultCabinet = {
            type: [],
            vendor: '',
            model: '',
            antiTheft: '',
            coolingType: '',
            coolingCapacity: '',
            compartments: '',
            hardware: [],
            acPowerFeed: '',
            cbNumber: '',
            powerCableLength: '',
            powerCableCrossSection: '',
            blvd: '',
            blvdFreeCBs: '',
            blvdCBsRatings: [],
            llvd: '',
            llvdFreeCBs: '',
            llvdCBsRatings: [],
            pdu: '',
            pduFreeCBs: '',
            pduCBsRatings: [],
            internalLayout: '',
            freeU: '',
          };

          // Merge API data with default structure
          const mergedCabinets = Array(10).fill(null).map((_, index) => {
            const apiCabinet = data.cabinets?.[index] || {};
            return {
              id: index + 1,
              ...defaultCabinet,
              ...apiCabinet,
              // Ensure arrays are properly initialized
              type: Array.isArray(apiCabinet.type) ? apiCabinet.type : [],
              hardware: Array.isArray(apiCabinet.hardware) ? apiCabinet.hardware : [],
              blvdCBsRatings: Array.isArray(apiCabinet.blvdCBsRatings) ? apiCabinet.blvdCBsRatings : [],
              llvdCBsRatings: Array.isArray(apiCabinet.llvdCBsRatings) ? apiCabinet.llvdCBsRatings : [],
              pduCBsRatings: Array.isArray(apiCabinet.pduCBsRatings) ? apiCabinet.pduCBsRatings : [],
            };
          });

          console.log("API cabinets data:", data.cabinets);
          console.log("Merged cabinets data:", mergedCabinets);

          setFormData({
            numberOfCabinets: data.numberOfCabinets || '',
            cabinets: mergedCabinets
          });
        }
      })
      .catch(err => {
        console.error("Error loading outdoor cabinets data:", err);
        if (err.response?.status !== 404) {
          showError('Error loading existing data');
        }
      });
  }, [sessionId]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/ac-panel/${sessionId}/connected-modules`);
        if (response.data.success) {
          setConnectedModules(response.data.data.connected_modules);
        }
      } catch (error) {
        console.error('Failed to fetch connected modules:', error);
      }
    };

    fetchModules();
  }, [sessionId]);

  const handleChange = (cabinetIndex, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      cabinets: prev.cabinets.map((cabinet, index) =>
        index === cabinetIndex
          ? { ...cabinet, [fieldName]: value }
          : cabinet
      )
    }));
  };

  const handleCheckboxChange = (cabinetIndex, fieldName, value, checked) => {
    setFormData(prev => ({
      ...prev,
      cabinets: prev.cabinets.map((cabinet, index) =>
        index === cabinetIndex
          ? {
            ...cabinet,
            [fieldName]: checked
              ? [...cabinet[fieldName], value]
              : cabinet[fieldName].filter(item => item !== value)
          }
          : cabinet
      )
    }));
  };

  // Get table data for a specific cabinet and equipment type with proper formatting
  const getCBRatingsTableData = useCallback((cabinetIndex, equipmentType) => {
    const cabinet = formData.cabinets[cabinetIndex];
    const ratings = cabinet?.[`${equipmentType}CBsRatings`] || [];
    
    if (ratings && ratings.length > 0) {
      return ratings.map((item, index) => ({
        id: index + 1,
        rating: item.rating?.toString() || "",
        connected_load: item.connected_load || ""
      }));
    }
    return [];
  }, [formData.cabinets]);

  // Handle CB ratings table data changes with proper data processing
  const handleCBRatingsChange = useCallback((cabinetIndex, equipmentType, newTableData) => {
    console.log(`Updating ${equipmentType} CB ratings for cabinet ${cabinetIndex}:`, newTableData);
    
    if (!newTableData || newTableData.length === 0) {
      // If no data, keep empty array but don't return early
      setFormData(prev => ({
        ...prev,
        cabinets: prev.cabinets.map((cabinet, index) =>
          index === cabinetIndex
            ? { ...cabinet, [`${equipmentType}CBsRatings`]: [] }
            : cabinet
        )
      }));
      return;
    }

    // Process and filter the data
    const processedData = newTableData
      .filter(item => {
        const rating = item.rating?.toString().trim() || '';
        const load = item.connected_load?.toString().trim() || '';
        return rating !== '' || load !== '';
      })
      .map(item => ({
        rating: parseFloat(item.rating) || 0,
        connected_load: item.connected_load || ""
      }));
    
    setFormData(prev => ({
      ...prev,
      cabinets: prev.cabinets.map((cabinet, index) =>
        index === cabinetIndex
          ? { ...cabinet, [`${equipmentType}CBsRatings`]: processedData }
          : cabinet
      )
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/outdoor-cabinets/${sessionId}`, formData);
      showSuccess('Outdoor cabinets data submitted successfully!');
      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error:", err);
      showError(`Error submitting data: ${err.response?.data?.message || 'Please try again.'}`);
    }
  };

  const images = [
    { label: 'Site outdoor location general photo', name: 'site_outdoor_location_general_photo' },
    { label: 'Free Position #1 ', name: 'free_position_1' },
    { label: 'Cabinet #1 photo general photo', name: 'cabinet_1_photo_general_photo' },
    { label: 'Cabinet #1 Photo 1/4', name: 'cabinet_1_photo_1_4' },
    { label: 'Cabinet #1 Photo 2/4', name: 'hardware_photo' },
    { label: 'Cooling System Photo', name: 'cooling_system_photo' },
    { label: 'Power Connection Photo', name: 'power_connection_photo' },
    { label: 'Cable Management Photo', name: 'cable_management_photo' },
  ];

  const cabinetTypes = ['RAN', 'MW', 'Power', 'All in one', 'Other'];
  const vendors = ['Nokia', 'Ericsson', 'Huawei', 'ZTE', 'Eltek', 'Vertiv'];
  const models = [
    'Nokia AAOB', 'Nokia AAOA', 'Nokia ACOC', 'Huawei MTS', 'Huawei TP cabinet',
    'Huawei APM', 'Huawei TMC', 'Huawei Power Cube', 'Ericsson RBS 6120',
    'Ericsson RBS 6150', 'ZTE ZXDU68 W301', 'ZTE ZXDU68 W201', 'Other'
  ];
  const hardwareOptions = ['RAN', 'Transmission', 'DC rectifiers', 'Batteries', 'ODF', 'Empty cabinet', 'Other'];

  // Helper function to check if any cabinet has AC power feed
  const hasAnyACPowerFeed = () => {
    const activeCabinets = formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1);
    return activeCabinets.some(cabinet => cabinet.acPowerFeed === 'Yes');
  };

  // Helper function to check if any cabinet has BLVD
  const hasAnyBLVD = () => {
    const activeCabinets = formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1);
    return activeCabinets.some(cabinet => cabinet.blvd === 'Yes');
  };

  // Helper function to check if any cabinet has LLVD
  const hasAnyLLVD = () => {
    const activeCabinets = formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1);
    return activeCabinets.some(cabinet => cabinet.llvd === 'Yes');
  };

  // Helper function to check if any cabinet has PDU
  const hasAnyPDU = () => {
    const activeCabinets = formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1);
    return activeCabinets.some(cabinet => cabinet.pdu === 'Yes');
  };

  return (
    <div className="max-h-screen flex items-start space-x-2 justify-start bg-gray-100 p-2">
      <div className="bg-white p-3 rounded-xl shadow-md w-[80%]">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Number of Cabinets Selection */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <label className="block font-semibold mb-2">How many cabinets existing on site?</label>
            <select
              name="numberOfCabinets"
              value={formData.numberOfCabinets}
              onChange={(e) => {
                console.log("Changing number of cabinets to:", e.target.value);
                console.log("Current formData.cabinets length:", formData.cabinets.length);
                console.log("First cabinet structure:", formData.cabinets[0]);
                setFormData(prev => ({ ...prev, numberOfCabinets: e.target.value }));
              }}
              className="border p-3 rounded-md w-48"
              required
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* Table Layout */}
          <div className="overflow-auto max-h-[600px]">
            <table className="table-auto w-full border-collapse">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th
                    className="border px-2 py-3 text-left font-semibold sticky top-0 left-0 bg-blue-500 z-30"
                    style={{ width: '200px', minWidth: '200px', maxWidth: '200px' }}
                  >
                    Field Description
                  </th>
                  {Array.from({ length: parseInt(formData.numberOfCabinets) || 1 }, (_, i) => (
                    <th
                      key={i}
                      className="border px-4 py-3 text-center font-semibold min-w-[340px] sticky top-0 bg-blue-500 z-20"
                    >
                      Existing outdoor cabinet #{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Cabinet Type */}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Cabinet type
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                        {cabinetTypes.map(type => (
                          <label key={type} className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={cabinet.type.includes(type)}
                              onChange={(e) => handleCheckboxChange(cabinetIndex, 'type', type, e.target.checked)}
                              className="w-4 h-4"
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Cabinet Vendor */}
                <tr>
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Cabinet vendor
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="grid grid-cols-3 gap-1">
                        {vendors.map(vendor => (
                          <label key={vendor} className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name={`vendor-${cabinetIndex}`}
                              value={vendor}
                              checked={cabinet.vendor === vendor}
                              onChange={(e) => handleChange(cabinetIndex, 'vendor', e.target.value)}
                              className="w-4 h-4"
                            />
                            {vendor}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Cabinet Model */}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Cabinet model
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <select
                        value={cabinet.model}
                        onChange={(e) => handleChange(cabinetIndex, 'model', e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                      >
                        <option value="">Select</option>
                        {models.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>

                {/* Anti Theft */}
                <tr>
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Cabinet has anti theft?
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="flex gap-4">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name={`antiTheft-${cabinetIndex}`}
                              value={option}
                              checked={cabinet.antiTheft === option}
                              onChange={(e) => handleChange(cabinetIndex, 'antiTheft', e.target.value)}
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Cooling Type */}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Cooling type
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="grid grid-cols-2 gap-1">
                        {['Air-condition', 'Fan-filter'].map(option => (
                          <label key={option} className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name={`coolingType-${cabinetIndex}`}
                              value={option}
                              checked={cabinet.coolingType === option}
                              onChange={(e) => handleChange(cabinetIndex, 'coolingType', e.target.value)}
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Cooling Capacity */}
                <tr>
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Cooling capacity (watt)
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <input
                        type="number"
                        value={cabinet.coolingCapacity}
                        onChange={(e) => handleChange(cabinetIndex, 'coolingCapacity', e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="0000"
                      />
                    </td>
                  ))}
                </tr>

                {/* Compartments */}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    How many compartment?
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="flex gap-4">
                        {['1', '2'].map(option => (
                          <label key={option} className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name={`compartments-${cabinetIndex}`}
                              value={option}
                              checked={cabinet.compartments === option}
                              onChange={(e) => handleChange(cabinetIndex, 'compartments', e.target.value)}
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Existing Hardware */}
                <tr>
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Existing hardware inside the cabinet
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="grid grid-cols-2 gap-1">
                        {hardwareOptions.map(option => (
                          <label key={option} className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={cabinet.hardware.includes(option)}
                              onChange={(e) => handleCheckboxChange(cabinetIndex, 'hardware', option, e.target.checked)}
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* AC Power Feed */}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Does the cabinet has AC power feed from the main AC panel?
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="flex gap-4">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name={`acPowerFeed-${cabinetIndex}`}
                              value={option}
                              checked={cabinet.acPowerFeed === option}
                              onChange={(e) => handleChange(cabinetIndex, 'acPowerFeed', e.target.value)}
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* CB Number - Only show if any cabinet has AC power feed */}
                {hasAnyACPowerFeed() && (
                  <tr>
                    <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-300 text-white z-10">
                      what is the CB number in the AC panel?
                    </td>
                    {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                      <td key={cabinetIndex} className="border px-2 py-2">
                        <select
                          value={cabinet.cbNumber}
                          onChange={(e) => handleChange(cabinetIndex, 'cbNumber', e.target.value)}
                          className="w-full p-2 border rounded text-sm "
                          disabled={cabinet.acPowerFeed !== 'Yes'}
                        >
                          <option value="">Select</option>
                          {connectedModules.map((module, index) => (
                            <option key={index} value={module}>{module}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Power Cable Length - Only show if any cabinet has AC power feed */}
                {hasAnyACPowerFeed() && (
                  <tr >
                    <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-300 text-white z-10">
                      Length of power cable from the AC panel to the CB inside the cabinet (meter)
                    </td>
                    {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                      <td key={cabinetIndex} className="border px-2 py-2">
                        <input
                          type="number"
                          value={cabinet.powerCableLength}
                          onChange={(e) => handleChange(cabinetIndex, 'powerCableLength', e.target.value)}
                          className={`w-full p-2 border rounded text-sm ${cabinet.acPowerFeed !== 'Yes'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : ''
                            }`}
                          placeholder={cabinet.acPowerFeed === 'Yes' ? '000' : 'N/A'}
                          disabled={cabinet.acPowerFeed !== 'Yes'}
                        />
                      </td>
                    ))}
                  </tr>
                )}

                {/* Power Cable Cross Section - Only show if any cabinet has AC power feed */}
                {hasAnyACPowerFeed() && (
                  <tr>
                    <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-300 text-white z-10">
                      Cross section of power cable from the AC panel to the CB inside the cabinet (mm)
                    </td>
                    {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                      <td key={cabinetIndex} className="border px-2 py-2">
                        <input
                          type="number"
                          value={cabinet.powerCableCrossSection}
                          onChange={(e) => handleChange(cabinetIndex, 'powerCableCrossSection', e.target.value)}
                          className={`w-full p-2 border rounded text-sm ${cabinet.acPowerFeed !== 'Yes'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : ''
                            }`}
                          placeholder={cabinet.acPowerFeed === 'Yes' ? '000' : 'N/A'}
                          disabled={cabinet.acPowerFeed !== 'Yes'}
                        />
                      </td>
                    ))}
                  </tr>
                )}

                {/* BLVD */}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Is there BLVD in the cabinet?
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="flex gap-4">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name={`blvd-${cabinetIndex}`}
                              value={option}
                              checked={cabinet.blvd === option}
                              onChange={(e) => handleChange(cabinetIndex, 'blvd', e.target.value)}
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* BLVD Free CBs - Only show if any cabinet has BLVD */}
                {hasAnyBLVD() && (
                  <tr >
                    <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-300 text-white z-10">
                      Does the BLVD has free CBs?
                    </td>
                    {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                      <td key={cabinetIndex} className="border px-2 py-2">
                        <div className="flex gap-4">
                          {['Yes', 'No'].map(option => (
                            <label key={option} className="flex items-center gap-1 text-sm">
                              <input
                                type="radio"
                                name={`blvdFreeCBs-${cabinetIndex}`}
                                value={option}
                                checked={cabinet.blvdFreeCBs === option}
                                onChange={(e) => handleChange(cabinetIndex, 'blvdFreeCBs', e.target.value)}
                                className="w-4 h-4"
                                disabled={cabinet.blvd !== 'Yes'}
                              />
                              <span className={cabinet.blvd !== 'Yes' ? 'text-gray-400' : ''}>
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}

                {/* BLVD CBs Ratings - Only show if any cabinet has BLVD */}
                {hasAnyBLVD() && (
                  <tr className="bg-gray-50">
                    <td className="border px-4  font-semibold sticky left-0 bg-blue-300 text-white z-10">
                      Existing BLVD CBs ratings & connected loads
                    </td>
                    {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                      <td key={cabinetIndex} className="border">
                        {cabinet.blvd === 'Yes' ? (
                          <div className="">
                            <DynamicTable
                              key={`blvd-${cabinetIndex}-${cabinet.blvdCBsRatings?.length || 0}`}
                              title=""
                              rows={cbRatingsTableRows}
                              initialData={getCBRatingsTableData(cabinetIndex, 'blvd')}
                              onChange={(newData) => handleCBRatingsChange(cabinetIndex, 'blvd', newData)}
                              minColumns={1}
                              autoExpand={true}
                              enableDragDrop={true}
                              enableDelete={true}
                              className=""
                              tableClassName="w-full border border-gray-300"
                              headerClassName="bg-gray-200"
                              cellClassName="border px-2 py-2"
                              labelClassName="border px-2 py-2 font-semibold bg-gray-50 text-xs"
                            />
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm p-4 text-center">
                            N/A (No BLVD)
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                )}

                {/* LLVD */}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Is there LLVD in the cabinet?
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="flex gap-4">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name={`llvd-${cabinetIndex}`}
                              value={option}
                              checked={cabinet.llvd === option}
                              onChange={(e) => handleChange(cabinetIndex, 'llvd', e.target.value)}
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* LLVD Free CBs - Only show if any cabinet has LLVD */}
                {hasAnyLLVD() && (
                  <tr >
                    <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-300 text-white z-10">
                      Does the LLVD has free CBs?
                    </td>
                    {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                      <td key={cabinetIndex} className="border px-2 py-2">
                        <div className="flex gap-4">
                          {['Yes', 'No'].map(option => (
                            <label key={option} className="flex items-center gap-1 text-sm">
                              <input
                                type="radio"
                                name={`llvdFreeCBs-${cabinetIndex}`}
                                value={option}
                                checked={cabinet.llvdFreeCBs === option}
                                onChange={(e) => handleChange(cabinetIndex, 'llvdFreeCBs', e.target.value)}
                                className="w-4 h-4"
                                disabled={cabinet.llvd !== 'Yes'}
                              />
                              <span className={cabinet.llvd !== 'Yes' ? 'text-gray-400' : ''}>
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}

                {/* LLVD CBs Ratings - Only show if any cabinet has LLVD */}
                {hasAnyLLVD() && (
                  <tr className="bg-gray-50">
                    <td className="border px-4  font-semibold sticky left-0 bg-blue-300 text-white z-10">
                      Existing LLVD CBs ratings & connected loads
                    </td>
                    {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                      <td key={cabinetIndex} className="border">
                        {cabinet.llvd === 'Yes' ? (
                          <div className="">
                            <DynamicTable
                              key={`llvd-${cabinetIndex}-${cabinet.llvdCBsRatings?.length || 0}`}
                              title=""
                              rows={cbRatingsTableRows}
                              initialData={getCBRatingsTableData(cabinetIndex, 'llvd')}
                              onChange={(newData) => handleCBRatingsChange(cabinetIndex, 'llvd', newData)}
                              minColumns={1}
                              autoExpand={true}
                              enableDragDrop={true}
                              enableDelete={true}
                              className=""
                              tableClassName="w-full border border-gray-300"
                              headerClassName="bg-gray-200"
                              cellClassName="border px-2 py-2"
                              labelClassName="border px-2 py-2 font-semibold bg-gray-50 text-xs"
                            />
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm p-4 text-center">
                            N/A (No LLVD)
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                )}

                {/* PDU */}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Is there PDU in the cabinet?
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="flex gap-4">
                        {['Yes', 'No'].map(option => (
                          <label key={option} className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name={`pdu-${cabinetIndex}`}
                              value={option}
                              checked={cabinet.pdu === option}
                              onChange={(e) => handleChange(cabinetIndex, 'pdu', e.target.value)}
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* PDU Free CBs - Only show if any cabinet has PDU */}
                {hasAnyPDU() && (
                  <tr >
                    <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-300 text-white z-10">
                      Does the PDU has free CBs?
                    </td>
                    {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                      <td key={cabinetIndex} className="border px-2 py-2">
                        <div className="flex gap-4">
                          {['Yes', 'No'].map(option => (
                            <label key={option} className="flex items-center gap-1 text-sm">
                              <input
                                type="radio"
                                name={`pduFreeCBs-${cabinetIndex}`}
                                value={option}
                                checked={cabinet.pduFreeCBs === option}
                                onChange={(e) => handleChange(cabinetIndex, 'pduFreeCBs', e.target.value)}
                                className="w-4 h-4"
                                disabled={cabinet.pdu !== 'Yes'}
                              />
                              <span className={cabinet.pdu !== 'Yes' ? 'text-gray-400' : ''}>
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}

                {/* PDU CBs Ratings - Only show if any cabinet has PDU */}
                {hasAnyPDU() && (
                  <tr className="bg-gray-50">
                    <td className="border px-4  font-semibold sticky left-0 bg-blue-300 text-white z-10">
                      Existing PDU CBs ratings & connected loads
                    </td>
                    {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                      <td key={cabinetIndex} className="border">
                        {cabinet.pdu === 'Yes' ? (
                          <div className="">
                            <DynamicTable
                              key={`pdu-${cabinetIndex}-${cabinet.pduCBsRatings?.length || 0}`}
                              title=""
                              rows={cbRatingsTableRows}
                              initialData={getCBRatingsTableData(cabinetIndex, 'pdu')}
                              onChange={(newData) => handleCBRatingsChange(cabinetIndex, 'pdu', newData)}
                              minColumns={1}
                              autoExpand={true}
                              enableDragDrop={true}
                              enableDelete={true}
                              className=""
                              tableClassName="w-full border border-gray-300"
                              headerClassName="bg-gray-200"
                              cellClassName="border px-2 py-2"
                              labelClassName="border px-2 py-2 font-semibold bg-gray-50 text-xs"
                            />
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm p-4 text-center">
                            N/A (No PDU)
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Internal Layout */}
                <tr>
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    Internal cabinet layout suitable for the installation of new Nokia base band? 19'' rack, internal spacing...
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <div className="grid grid-cols-1 gap-1">
                        {['Yes', 'No', 'Yes, with some modifications'].map(option => (
                          <label key={option} className="flex items-center gap-1 text-sm">
                            <input
                              type="radio"
                              name={`internalLayout-${cabinetIndex}`}
                              value={option}
                              checked={cabinet.internalLayout === option}
                              onChange={(e) => handleChange(cabinetIndex, 'internalLayout', e.target.value)}
                              className="w-4 h-4"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Free U */}
                <tr className="bg-gray-50">
                  <td className="border px-4 py-3 font-semibold sticky left-0 bg-blue-400 text-white z-10">
                    How many free 19'' U available for telecom hardware installation?
                  </td>
                  {formData.cabinets.slice(0, parseInt(formData.numberOfCabinets) || 1).map((cabinet, cabinetIndex) => (
                    <td key={cabinetIndex} className="border px-2 py-2">
                      <input
                        type="number"
                        value={cabinet.freeU}
                        onChange={(e) => handleChange(cabinetIndex, 'freeU', e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                        placeholder="00"
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-700 font-semibold"
            >
              Save and Continue
            </button>
          </div>
        </form>
      </div>
      <ImageUploader images={images} />
    </div>
  );
};

export default OutdoorCabinetsForm;

