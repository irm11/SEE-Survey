import React, { useState } from 'react';

const NewAntennaForm = () => {
  const [form, setForm] = useState({
    sectorNumber: '',
    newOrSwap: '',
    technologies: [],
    azimuth: '',
    baseHeight: '',
    towerLeg: '',
    towerSection: '',
    angularDimensions: '',
    tubularCrossSection: '',
    sideArmOption: '',
    sideArmLength: '',
    sideArmCross: '',
    sideArmOffset: '',
    earthBusExists: '',
    earthCableLength: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({
        ...prev,
        technologies: checked
          ? [...prev.technologies, value]
          : prev.technologies.filter(v => v !== value),
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">2. New Antennas</h2>
      <h3 className="text-lg font-semibold">2.1. New Antenna #1</h3>

      <label>
        Sector Number:
        <select name="sectorNumber" onChange={handleChange} value={form.sectorNumber}>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </label>

      <div>
        New or swap?
        {['New', 'Swap'].map(opt => (
          <label key={opt}>
            <input
              type="radio"
              name="newOrSwap"
              value={opt}
              checked={form.newOrSwap === opt}
              onChange={handleChange}
            />
            {opt}
          </label>
        ))}
      </div>

      <div>
        New antenna technology:
        {['2G', '3G', '4G', '5G'].map(tech => (
          <label key={tech}>
            <input
              type="checkbox"
              name="technologies"
              value={tech}
              checked={form.technologies.includes(tech)}
              onChange={handleChange}
            />
            {tech}
          </label>
        ))}
      </div>

      <label>
        Azimuth (° from north):
        <input type="number" name="azimuth" value={form.azimuth} onChange={handleChange} />
      </label>

      <label>
        Base height from tower base (m):
        <input type="number" name="baseHeight" value={form.baseHeight} onChange={handleChange} />
      </label>

      <div>
        Tower leg:
        {['A', 'B', 'C', 'D'].map(leg => (
          <label key={leg}>
            <input
              type="radio"
              name="towerLeg"
              value={leg}
              checked={form.towerLeg === leg}
              onChange={handleChange}
            />
            {leg}
          </label>
        ))}
      </div>

      <div>
        Tower leg section:
        {['Angular', 'Tubular'].map(type => (
          <label key={type}>
            <input
              type="radio"
              name="towerSection"
              value={type}
              checked={form.towerSection === type}
              onChange={handleChange}
            />
            {type}
          </label>
        ))}
      </div>

      {form.towerSection === 'Angular' && (
        <label>
          Dimensions (L1 x L2 in mm):
          <input type="text" name="angularDimensions" value={form.angularDimensions} onChange={handleChange} />
        </label>
      )}

      {form.towerSection === 'Tubular' && (
        <label>
          Cross section (mm):
          <input type="number" name="tubularCrossSection" value={form.tubularCrossSection} onChange={handleChange} />
        </label>
      )}

      <label>
        New antenna side arm:
        <select name="sideArmOption" value={form.sideArmOption} onChange={handleChange}>
          <option value="">Select</option>
          <option value="existing">Use existing empty side arm</option>
          <option value="swapped">Use swapped antenna side arm</option>
          <option value="new">New side arm need to be supplied</option>
        </select>
      </label>

      <label>
        Side arm length (m):
        <input type="number" name="sideArmLength" value={form.sideArmLength} onChange={handleChange} />
      </label>

      <label>
        Side arm cross section (mm):
        <input type="number" name="sideArmCross" value={form.sideArmCross} onChange={handleChange} />
      </label>

      <label>
        Side arm offset from tower leg (cm):
        <input type="number" name="sideArmOffset" value={form.sideArmOffset} onChange={handleChange} />
      </label>

      <div>
        Earth bus bar exists within 10m?
        {['Yes', 'No'].map(opt => (
          <label key={opt}>
            <input
              type="radio"
              name="earthBusExists"
              value={opt}
              checked={form.earthBusExists === opt}
              onChange={handleChange}
            />
            {opt}
          </label>
        ))}
      </div>

      {form.earthBusExists === 'Yes' && (
        <label>
          Earth cable length to bus bar (m):
          <input type="number" name="earthCableLength" value={form.earthCableLength} onChange={handleChange} />
        </label>
      )}
    </div>
  );
};

export default NewAntennaForm;
