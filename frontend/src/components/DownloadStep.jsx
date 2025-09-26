import React, { useState } from 'react';
import axios from 'axios';

const DownloadStep = ({ processedImage, prevStep }) => {
  const [copies, setCopies] = useState(4);
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState('image'); // 'image' or 'pdf'

  const handleDownload = (type) => {
    setDownloading(true);
    setDownloadType(type);

    if (type === 'image') {
      // Download processed image
      window.location.href = `/api/download/${processedImage.processed_filename}`;
      setDownloading(false);
    } else {
      // Download PDF with multiple copies
      axios.post('/api/download-pdf', {
        filenames: [processedImage.processed_filename],
        copies: copies
      })
      .then(response => {
        window.location.href = `/api/download/${response.data.pdf_filename}`;
        setDownloading(false);
      })
      .catch(error => {
        console.error('PDF download error:', error);
        setDownloading(false);
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Download Your Passport Photo</h2>
        <p className="mt-1 text-gray-600">Get your processed passport photo in various formats</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Preview</h3>
            <div className="flex justify-center">
              <img
                src={`/api/download/${processedImage.processed_filename}`}
                alt="Processed"
                className="max-h-80 rounded-md border border-gray-200"
              />
            </div>
            <div className="mt-3 text-center text-sm text-gray-500">
              {processedImage.size.name} - {processedImage.size.width} × {processedImage.size.height} px
            </div>
          </div>

          {/* Download Options */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Download Options</h3>
              
              <div className="space-y-4">
                {/* Single Image Download */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Single Image</h4>
                      <p className="text-sm text-gray-500">Download as JPG, PNG, or PDF</p>
                    </div>
                    <button
                      onClick={() => handleDownload('image')}
                      disabled={downloading && downloadType === 'image'}
                      className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        downloading && downloadType === 'image'
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {downloading && downloadType === 'image' ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      JPG
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      PNG
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      PDF
                    </span>
                  </div>
                </div>

                {/* Multiple Copies Download */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Multiple Copies</h4>
                      <p className="text-sm text-gray-500">Generate multiple copies on A4 sheet</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of copies per sheet
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[4, 6, 8].map((count) => (
                        <button
                          key={count}
                          onClick={() => setCopies(count)}
                          className={`py-2 px-3 border rounded-md text-sm font-medium ${
                            copies === count
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {count} copies
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => handleDownload('pdf')}
                      disabled={downloading && downloadType === 'pdf'}
                      className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                        downloading && downloadType === 'pdf'
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {downloading && downloadType === 'pdf' ? 'Generating PDF...' : `Download PDF (${copies} copies)`}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Upgrade */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-5 text-white">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-white">Upgrade to Premium</h3>
                  <p className="mt-1 text-purple-100">
                    Remove watermarks, get HD quality, and access advanced features
                  </p>
                  <div className="mt-4">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-purple-600 bg-white hover:bg-purple-50">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={prevStep}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadStep;