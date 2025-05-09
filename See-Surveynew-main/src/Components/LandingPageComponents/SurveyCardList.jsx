import React from 'react';

const surveys = [
  { id: 1, title: 'Customer Satisfaction Survey', location: 'Main Office', country: 'Pakistan', city: 'Lahore' },
  { id: 2, title: 'Product Feedback Survey', location: 'Regional Center', country: 'USA', city: 'New York' },
  { id: 3, title: 'Employee Engagement Survey', location: 'Headquarters', country: 'Germany', city: 'Berlin' },
];

const SurveyCardList = () => {
  return (
    <div className="p-6 overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700 text-sm uppercase">
            <th className="px-6 py-3">Survey ID</th>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Location</th>
            <th className="px-6 py-3">Country</th>
            <th className="px-6 py-3">City</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map((survey) => (
            <tr key={survey.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{survey.id}</td>
              <td className="px-6 py-4">{survey.title}</td>
              <td className="px-6 py-4">{survey.location}</td>
              <td className="px-6 py-4">{survey.country}</td>
              <td className="px-6 py-4">{survey.city}</td>
              <td className="px-6 py-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Continue
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SurveyCardList;
