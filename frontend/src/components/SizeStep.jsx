import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SizeStep = ({ imageData, setProcessedImage, nextStep, prevStep }) => {
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState('us');
  const [backgroundType, setBackgroundType] = useState('white');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available sizes from backend
    axios.get('/api/sizes')
      .then(response => {
        setSizes(response.data);
        // Set default size to first one
        if (Object.keys(response.data).length > 0) {
          setSelectedSize(Object.keys(response.data)[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching sizes:', error);
        // Fallback to hardcoded sizes
        setSizes({
          us: { name: 'US (2x2 inches)', width: 600, height: 600 },
          eu: { name: 'EU/UK/Pakistan (35x45 mm)', width: 413, height: 531 },
          india: { name: 'India (51x51 mm)', width: 602, height: 602 }
        });
      });
  }, []);

  const handleProcess = () => {
    setProcessing(true);
    setError('');
    
    // Process image with selected options
    axios.post('/api/process', {
      filename: imageData.filename,
      size: selectedSize,
      background: backgroundType,
      watermark: true // For free version
    })
    .then(response => {
      setProcessedImage(response.data);
      setProcessing(false);
      nextStep();
    })
    .catch(error => {
      console.error('Processing error:', error);
      setError('Failed to process image. Please try again.');
      setProcessing(false);
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Select Passport Size</h2>
        <p className="mt-1 text-gray-600">Choose the passport size for your country</p>
      </div>

      {error && (
        <div className="text-red-500 text-center">{error}</div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(sizes).map(([key, size]) => (
            <div
              key={key}
              onClick={() => setSelectedSize(key)}
              className={`cursor-pointer border-2 rounded-lg p-4 text-center ${
                selectedSize === key
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{size.name}</div>
              <div className="mt-1 text-sm text-gray-500">
                {size.width} × {size.height} px
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Free version:</strong> Includes watermark.{' '}
                <a href="#" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                  Upgrade to premium
                </a>{' '}
                for watermark-free HD photos.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={prevStep}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </button>
          <button
            onClick={handleProcess}
            disabled={processing}
            className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              processing
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {processing ? 'Processing...' : 'Process Photo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeStep;