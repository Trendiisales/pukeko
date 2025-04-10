import React from 'react';
import Button from './components/common/Button';

function TailwindDemo() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold text-center mb-8">Tailwind CSS Demo</h1>
                <p className="text-gray-600">This is a simple demo of Tailwind CSS styling.</p>
                <div className="flex flex-col space-y-4">
                  <Button onClick={() => alert('Primary button clicked!')}>
                    Primary Button
                  </Button>
                  <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                    Secondary Button
                  </button>
                  <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                    Outlined Button
                  </button>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="font-bold text-blue-800">Card Title</h3>
                    <p className="text-blue-700 text-sm">Card content with Tailwind styling</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="font-bold text-green-800">Card Title</h3>
                    <p className="text-green-700 text-sm">Card content with Tailwind styling</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TailwindDemo;