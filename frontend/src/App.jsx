import React, { useState } from 'react';
import './App.css';
import UploadStep from './components/UploadStep';
import EditStep from './components/EditStep';
import BackgroundStep from './components/BackgroundStep';
import SizeStep from './components/SizeStep';
import DownloadStep from './components/DownloadStep';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [imageData, setImageData] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    { id: 1, title: 'Upload', component: UploadStep },
    { id: 2, title: 'Edit', component: EditStep },
    { id: 3, title: 'Background', component: BackgroundStep },
    { id: 4, title: 'Size', component: SizeStep },
    { id: 5, title: 'Download', component: DownloadStep }
  ];

  const StepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Passport Photo Maker</h1>
          <p className="mt-1 text-lg text-gray-600">Create passport photos online in seconds</p>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Step Progress */}
          <div className="mb-8">
            <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 sm:text-base">
              {steps.map((step) => (
                <li 
                  key={step.id} 
                  className={`flex md:w-full items-center ${
                    step.id < currentStep ? 'text-green-600' : 
                    step.id === currentStep ? 'text-blue-600' : 'text-gray-500'
                  } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10`}
                >
                  <span className={`flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 ${
                    step.id === steps.length ? 'after:hidden' : ''
                  }`}>
                    <span className={`step-indicator ${
                      step.id < currentStep ? 'completed' : 
                      step.id === currentStep ? 'active' : ''
                    }`}>
                      {step.id}
                    </span>
                    <span className="ml-2">{step.title}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Step Content */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <StepComponent 
                imageData={imageData}
                setImageData={setImageData}
                processedImage={processedImage}
                setProcessedImage={setProcessedImage}
                nextStep={nextStep}
                prevStep={prevStep}
                currentStep={currentStep}
                totalSteps={steps.length}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;