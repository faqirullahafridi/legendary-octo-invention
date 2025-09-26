import React, { useState } from 'react';

const BackgroundStep = ({ nextStep, prevStep }) => {
  const [backgroundType, setBackgroundType] = useState('white');
  const [customColor, setCustomColor] = useState('#ffffff');

  const backgroundOptions = [
    { id: 'white', name: 'White', color: '#ffffff' },
    { id: 'lightgray', name: 'Light Gray', color: '#f0f0f0' },
    { id: 'blue', name: 'Blue', color: '#0078d7' },
    { id: 'transparent', name: 'Transparent', color: 'transparent' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Background</h2>
        <p className="mt-1 text-gray-600">Select a background color for your passport photo</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {backgroundOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setBackgroundType(option.id)}
              className={`cursor-pointer border-2 rounded-lg p-4 text-center ${
                backgroundType === option.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-16 h-16 mx-auto rounded-md mb-2 border border-gray-300"
                style={{
                  backgroundColor: option.color,
                  backgroundImage: option.id === 'transparent' 
                    ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' 
                    : 'none',
                  backgroundSize: option.id === 'transparent' ? '10px 10px' : 'auto',
                  backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                }}
              ></div>
              <span className="text-sm font-medium text-gray-900">{option.name}</span>
            </div>
          ))}
        </div>

        {backgroundType === 'custom' && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
              />
              <input
                type="text"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={prevStep}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackgroundStep;