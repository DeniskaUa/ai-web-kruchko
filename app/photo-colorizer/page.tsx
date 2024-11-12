'use client';

import Dropzone from 'react-dropzone';
import { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { FaTrashAlt, FaDownload } from 'react-icons/fa';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/outline';

const acceptedFileTypes = {
  'image/jpeg': ['.jpeg', '.jpg', '.png'],
};

const maxFileSize = 5 * 1024 * 1024; // 5MB

export default function FotoColorizer() {
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  function onImageDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (!file) {
      setError('Failed to load the file. Please try again.');
      return;
    }
    setFile(file);
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

  async function submitImage() {
    if (!base64Image) {
      setError('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/photo-colorizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setOutputImage(result.output);
      }
    } catch (err) {
      setError('An error occurred while processing the image.');
    } finally {
      setLoading(false);
    }
  }

  function removeImage() {
    setFile(null);
    setBase64Image(null);
    setOutputImage(null);
  }

  async function downloadImage() {
    if (outputImage) {
      try {
        const response = await fetch(outputImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'colorized-photo.png';
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
                Upload a black & white photo
              </h3>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Upload a black-and-white photo to bring it to life with colors using AI.
              </p>
            </div>
            <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
              <button
                type="button"
                disabled={loading || !file}
                onClick={submitImage}
                className={`${
                  !file || loading
                    ? 'cursor-not-allowed bg-indigo-300 text-gray-300 hover:bg-indigo-300 hover:text-gray-300'
                    : 'bg-indigo-600 text-white'
                } inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:px-3.5 lg:py-2.5`}
              >
                Colorize Photo
                <SparklesIcon className="ml-2 h-4 w-4 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="mt-10 grid flex-1 gap-6 px-4 lg:px-6 xl:grid-cols-2 xl:gap-8 xl:px-8">
        {/* Left Side: Dropzone */}
        <Dropzone
  onDrop={onImageDrop}
  accept={acceptedFileTypes}
  maxSize={maxFileSize}
  multiple={false}
  disabled={!!file} // Відключає дропзону, якщо файл завантажено
>
  {({ getRootProps, getInputProps }) => (
    <div
      {...getRootProps({
        onClick: !!file ? (e) => e.preventDefault() : undefined, // Забороняє кліки, якщо файл завантажено
      })}
      className="flex flex-col justify-center items-center w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {file ? (
        <div className="relative">
          <img
            src={URL.createObjectURL(file)}
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
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-semibold text-gray-300">
            Drag & drop your photo here or click to upload
          </span>
        </>
      )}
    </div>
  )}
</Dropzone>



        {/* Right Side: Output */}
        <div className="flex flex-col justify-center items-center w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          {loading ? (
            <ThreeDots height="50" width="50" color="#eee" ariaLabel="loading" />
          ) : outputImage ? (
            <div className="relative">
              <img
                src={outputImage}
                alt="AI Colorized"
                className="h-auto w-full object-cover rounded-md"
              />
              <button
                onClick={downloadImage}
                className="absolute top-2 right-2 px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
              >
                <FaDownload />
              </button>
            </div>
          ) : (
            <span className="text-gray-500">AI-colorized photo will appear here.</span>
          )}
        </div>
      </section>
      {/* Explanation and Example */}
<section className="mt-12 px-4 lg:px-6 xl:px-8">
  <h2 className="text-xl font-bold text-gray-300 mb-4">How to Use</h2>
  <p className="text-gray-400 mb-4">
    To bring your black-and-white photo to life with colors:
  </p>
  <ul className="list-disc list-inside text-gray-400 mb-6">
    <li>Upload a black-and-white photo using the upload section above.</li>
    <li>Wait for the AI to process your image and apply realistic colors to it.</li>
    <li>View and download the colorized version of your photo.</li>
  </ul>
  <h3 className="text-lg font-semibold text-gray-300 mb-2">Example:</h3>
  <p className="text-gray-400 mb-4">
    Below is an example of a black-and-white photo colorized by the AI.
  </p>
  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
    <img
      src="/7ex.jpg"
      alt="Example of black-and-white photo colorization"
      className="h-auto w-full object-contain rounded-md mb-4"
    />

  </div>
</section>

    </main>
  );
}
