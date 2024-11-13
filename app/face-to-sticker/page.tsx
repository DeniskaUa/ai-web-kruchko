'use client';

import Dropzone from 'react-dropzone';
import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { FaTrashAlt, FaDownload } from 'react-icons/fa';
import { PhotoIcon } from '@heroicons/react/24/outline';

const acceptedFileTypes = {
  'image/jpeg': ['.jpeg', '.jpg', '.png'],
};

const maxFileSize = 5 * 1024 * 1024; // 5MB

export default function FaceToSticker() {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [outputImages, setOutputImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function onImageDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file) {
      setError('Failed to load the file. Please try again.');
      return;
    }
    setUploadedImage(file);
    convertImageToBase64(file);
    setError(null);
  }

  function convertImageToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const binaryStr = reader.result as string;
      setBase64Image(binaryStr);
    };
    reader.onerror = () => {
      setError('Error reading the file. Please try again.');
    };
    reader.readAsDataURL(file);
  }

  async function submitData() {
    if (!base64Image || !prompt.trim()) {
      setError('Please upload an image and provide a prompt.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/face-to-sticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, prompt }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setOutputImages(result.output);
      }
    } catch (err) {
      setError('An error occurred while processing the data.');
    } finally {
      setLoading(false);
    }
  }

  function removeImage() {
    setUploadedImage(null);
    setBase64Image(null);
    setOutputImages([]);
  }

  async function downloadImage(url: string, filename: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setError('Failed to download the image. Please try again.');
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
                Generate Stickers from Face
              </h3>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Upload an image and provide a prompt to generate stickers.Recommended photo size is less than 1024x1024.
              </p>
            </div>
            <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
              <button
                type="button"
                disabled={!uploadedImage || !prompt || loading}
               // onClick={submitData}
                className={`${
                  !uploadedImage || !prompt || loading
                    ? 'cursor-not-allowed bg-indigo-300 text-gray-300'
                    : 'bg-indigo-600 text-white'
                } inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-indigo-500`}
              >
                Generate Stickers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="mt-10 grid gap-6 px-4 lg:px-6 xl:gap-8 xl:px-8">
        {/* Upper Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Uploaded Image */}
          <div className="flex flex-col justify-center items-center rounded-lg border-2 border-dashed border-gray-300 p-6">
          <Dropzone
  onDrop={onImageDrop}
  accept={acceptedFileTypes}
  maxSize={maxFileSize}
  multiple={false}
  disabled={!!uploadedImage} // Відключає дропзону, якщо зображення вже завантажено
>
  {({ getRootProps, getInputProps }) => (
    <div
      {...getRootProps({
        onClick: !!uploadedImage ? (e) => e.preventDefault() : undefined, // Забороняє кліки, якщо зображення завантажено
      })}
      className={`flex flex-col justify-center items-center w-full h-full 
        
      `}
    >
      {uploadedImage ? (
        <div className="relative">
          <img
            src={URL.createObjectURL(uploadedImage)}
            alt="Uploaded"
            className="h-auto w-full object-cover rounded-md"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <FaTrashAlt />
          </button>
        </div>
      ) : (
        <>
          <input {...getInputProps()} />
          <PhotoIcon className="h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">Upload Image</p>
        </>
      )}
    </div>
  )}
</Dropzone>

          </div>

          {/* Right: First Sticker */}
          <div className="flex flex-col justify-center items-center rounded-lg border-2 border-dashed border-gray-300 p-6">
            {loading ? (
              <ThreeDots height="50" width="50" color="#eee" />
            ) : outputImages[0] ? (
              <div className="relative">
                <img
                  src={outputImages[0]}
                  alt="First Sticker"
                  className="h-auto w-full object-cover rounded-md"
                />
                <button
                  onClick={() => downloadImage(outputImages[0], 'sticker_1.png')}
                  className="absolute top-2 right-2 px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                >
                  <FaDownload />
                </button>
              </div>
            ) : (
              <span className="text-gray-500">First sticker will appear here.</span>
            )}
          </div>
        </div>

        {/* Lower Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Prompt Input */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full h-32 bg-transparent text-gray-300 border border-gray-500 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          {/* Right: Second Sticker */}
          <div className="flex flex-col justify-center items-center rounded-lg border-2 border-dashed border-gray-300 p-6">
            {loading ? (
              <ThreeDots height="50" width="50" color="#eee" />
            ) : outputImages[1] ? (
              <div className="relative">
                <img
                  src={outputImages[1]}
                  alt="Second Sticker"
                  className="h-auto w-full object-cover rounded-md"
                />
                <button
                  onClick={() => downloadImage(outputImages[1], 'sticker_2.png')}
                  className="absolute top-2 right-2 px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                >
                  <FaDownload />
                </button>
              </div>
            ) : (
              <span className="text-gray-500">Second sticker will appear here.</span>
            )}
          </div>
        </div>
      </section>
        {/* Explanation and Example */}
        <section className="mt-12 px-4 lg:px-6 xl:px-8">
        <h2 className="text-xl font-bold text-gray-300 mb-4">How to Use</h2>
        <p className="text-gray-400 mb-4">
          To generate stickers from a face:
        </p>
        <ul className="list-disc list-inside text-gray-400 mb-6">
          <li>Upload an image of a face using the section above.</li>
          <li>Enter a prompt to guide the sticker generation.</li>
          <li>Click "Generate Stickers" and wait for the results.</li>
        </ul>
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
          <img
            src="/5ex.jpg"
            alt="Example sticker generation"
            className="h-auto w-full object-contain rounded-md"
          />
        </div>
      </section>
    </main>
  );
}