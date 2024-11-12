'use client';

import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { FaDownload } from 'react-icons/fa';

export default function TextToImage() {
  const [prompt, setPrompt] = useState<string>('');
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function generateImage() {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError(null);
    setOutputImage(null);

    try {
      const response = await fetch('/api/text-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setOutputImage(result.output[0]); // API повертає масив із URL зображень
      }
    } catch (err) {
      setError('An error occurred while generating the image.');
    } finally {
      setLoading(false);
    }
  }

  async function downloadImage() {
    if (outputImage) {
      try {
        const response = await fetch(outputImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'generated-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        setError('Failed to download the image. Please try again.');
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col py-10 lg:pl-72">
      {/* Error Notification */}
      {error && (
        <div className="mx-4 mb-10 rounded-md bg-red-50 p-4 lg:mx-6 xl:mx-8">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {/* Action Panel */}
      <div className="mx-4 bg-gray-900 shadow sm:rounded-lg lg:mx-6 xl:mx-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-start sm:justify-between">
            <div>
              <h3 className="text:base font-semibold leading-6 text-gray-300 lg:text-xl">
                Enter a prompt to generate an image
              </h3>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Describe the scene or subject you'd like to generate.
              </p>
            </div>
            <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
              <button
                type="button"
                disabled={!prompt || loading}
                onClick={generateImage}
                className={`${
                  !prompt || loading
                    ? 'cursor-not-allowed bg-indigo-300 text-gray-300 hover:bg-indigo-300 hover:text-gray-300'
                    : 'bg-indigo-600 text-white'
                } inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:px-3.5 lg:py-2.5`}
              >
                Generate Image
                <SparklesIcon className="ml-2 h-4 w-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="mt-10 grid flex-1 gap-6 px-4 lg:px-6 xl:grid-cols-2 xl:gap-8 xl:px-8">
        {/* Left Side: Text Input */}
        <div className="flex flex-col justify-center items-center w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the scene or subject you'd like to generate..."
            className="w-full h-40 bg-transparent text-gray-300 border border-gray-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Right Side: Output */}
        <div className="flex flex-col justify-center items-center w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          {loading ? (
            <ThreeDots height="50" width="50" color="#eee" ariaLabel="loading" />
          ) : outputImage ? (
            <div className="relative">
              <img
                src={outputImage}
                alt="Generated AI Image"
                className="h-auto w-full object-cover rounded-md mb-4"
              />
              <button
                onClick={downloadImage}
                className="absolute top-2 right-2 px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
              >
                <FaDownload />
              </button>
            </div>
          ) : (
            <span className="text-gray-500">Generated image will appear here.</span>
          )}
        </div>
      </section>
      <section className="mt-12 px-4 lg:px-6 xl:px-8">
        <h2 className="text-xl font-bold text-gray-300 mb-4">How to Use</h2>
        <p className="text-gray-400 mb-4">
          To generate an image from text:
        </p>
        <ul className="list-disc list-inside text-gray-400 mb-6">
          <li>Enter a text prompt in the box on the left.</li>
          <li>Click the "Generate Image" button to start the process.</li>
          <li>The generated image will appear on the right once the process is complete.</li>
        </ul>
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
          <img
            src="3ex.jpg"
            alt="Example of text-to-image generation"
            className="h-auto w-full object-contain rounded-md"
          />
        </div>
      </section>
    </main>
  );
}
