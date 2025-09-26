import React, { useState, useRef, useEffect } from 'react';

const EditStep = ({ imageData, nextStep, prevStep }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const imageRef = useRef(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
  };

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.transform = `scale(${zoom}) rotate(${rotation}deg)`;
      imageRef.current.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    }
  }, [zoom, rotation, brightness, contrast]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Edit Your Photo</h2>
        <p className="mt-1 text-gray-600">Adjust your photo to meet passport requirements</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Preview */}
        <div className="md:w-2/3 flex justify-center">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-center items-center h-96 overflow-hidden">
              <img
                ref={imageRef}
                src={imageData.previewUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain transition-transform duration-200"
              />
            </div>
          </div>
        </div>

        {/* Edit Controls */}
        <div className="md:w-1/3 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Adjustments</h3>
            
            <div className="space-y-4">
              {/* Zoom Controls */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">Zoom</label>
                  <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Rotation Controls */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Rotation</label>
                <div className="flex space-x-2">
                  <button
                    onClick={handleRotateLeft}
                    className="flex-1 py-2 px-3 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    ↺ Left
                  </button>
                  <button
                    onClick={handleRotateRight}
                    className="flex-1 py-2 px-3 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Right ↻
                  </button>
                </div>
              </div>

              {/* Brightness Controls */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">Brightness</label>
                  <span className="text-sm text-gray-500">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Contrast Controls */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-700">Contrast</label>
                  <span className="text-sm text-gray-500">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              onClick={prevStep}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStep;