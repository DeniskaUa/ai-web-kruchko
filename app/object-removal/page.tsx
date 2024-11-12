'use client';

import { useRef, useState } from 'react';
import Dropzone from 'react-dropzone';
import { ThreeDots } from 'react-loader-spinner';
import { FaTrashAlt, FaDownload } from 'react-icons/fa';

export default function ObjectRemoval() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  const scaleImage = (image: HTMLImageElement, maxWidth: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
  
      if (!ctx) {
        reject('Failed to get canvas context.');
        return;
      }
  
      const scale = maxWidth / image.width;
      const newWidth = maxWidth;
      const newHeight = Math.round(image.height * scale);
  
      canvas.width = newWidth;
      canvas.height = newHeight;
  
      ctx.drawImage(image, 0, 0, newWidth, newHeight);
  
      const scaledImage = canvas.toDataURL('image/jpeg', 1.0); // Максимальна якість JPEG
  //
      resolve(scaledImage);
    });
  };
  
  const handleImageDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = async () => {
          try {
            if (img.width > 700) {
              // Масштабування
              const scaledImage = await scaleImage(img, 700);
              setUploadedImage(scaledImage);
              setImageDimensions({
                width: 700,
                height: Math.round(img.height * (700 / img.width)),
              });
            } else {
              // Без змін
              setUploadedImage(reader.result as string);
              setImageDimensions({ width: img.width, height: img.height });
            }
          } catch (err) {
            setError('Failed to scale the image.');
          }
        };
        img.onerror = () => setError('Invalid image file.');
        img.src = reader.result as string;
      };
      reader.onerror = () => setError('Failed to load the image.');
      reader.readAsDataURL(file);
    }
  };
  
  
  

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctx.beginPath();
      ctx.moveTo(x, y);
      canvas.onmousemove = (event) => {
        const moveX = event.clientX - rect.left;
        const moveY = event.clientY - rect.top;
        ctx.lineTo(moveX, moveY);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 15;
        ctx.stroke();
      };
    }
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.onmousemove = null;
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx && imageDimensions) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleSubmit = async () => {
    if (!uploadedImage || !canvasRef.current) {
      setError('Please upload an image and create a mask.');
      return;
    }
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Забезпечуємо, що зображення зберігається з 4 каналами
      const maskData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const validMask = new Uint8ClampedArray(maskData.data.length);
      for (let i = 0; i < maskData.data.length; i += 4) {
        validMask[i] = maskData.data[i]; // Red
        validMask[i + 1] = maskData.data[i + 1]; // Green
        validMask[i + 2] = maskData.data[i + 2]; // Blue
        validMask[i + 3] = maskData.data[i + 3]; // Alpha
      }
      const imageData = new ImageData(validMask, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
    }
  
    const maskData = canvas.toDataURL('image/png');
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch('/api/object-removal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          mask: maskData,
        }),
      });
  
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        setOutputImage(result.output);
      }
    } catch (error) {
      setError('Error processing the image.');
    } finally {
      setLoading(false);
    }
  };
  

  const downloadImage = async () => {
    if (outputImage) {
      const response = await fetch(outputImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'processed-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <main className="flex min-h-screen flex-col py-10 lg:pl-72">
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
              <h3 className="text-base font-semibold leading-6 text-gray-300 lg:text-xl">
                Object Removal Tool
              </h3>
              <p className="mt-2 max-w-xl text-sm text-gray-500">
                Upload an image and use the brush to mark areas for removal.
              </p>
            </div>
            <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
              <button
                type="button"
                disabled={!uploadedImage || loading}
                onClick={handleSubmit}
                className={`${
                  !uploadedImage || loading
                    ? 'cursor-not-allowed bg-indigo-300 text-gray-300'
                    : 'bg-indigo-600 text-white'
                } inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-indigo-500`}
              >
                Remove Object
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="mt-10 grid flex-1 gap-6 px-4 lg:px-6 xl:grid-cols-2 xl:gap-8 xl:px-8">
        {/* Left Side */}
        <div className="flex flex-col justify-center items-center w-full h-full rounded-lg border-2 border-dashed p-6 relative">
        <Dropzone
  onDrop={handleImageDrop}
  accept={{
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
  }}
  disabled={!!uploadedImage} 
>
  {({ getRootProps, getInputProps }) => (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center w-full h-full ${
        uploadedImage ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
    >
      {uploadedImage ? (
        <>
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded"
              style={{
                width: imageDimensions?.width || 'auto',
                height: imageDimensions?.height || 'auto',
              }}
              className="block"
            />
            <canvas
              ref={canvasRef}
              width={imageDimensions?.width || 0}
              height={imageDimensions?.height || 0}
              className="absolute top-0 left-0 cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={clearCanvas}
              className="absolute top-2 left-2 px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              Clear Mask
            </button>
            <button
              onClick={() => setUploadedImage(null)}
              className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <FaTrashAlt />
            </button>
          </div>
        </>
      ) : (
        <>
          <input {...getInputProps()} />
          <p className="text-gray-500">Drag and drop or select an image to upload.</p>
        </>
      )}
    </div>
  )}
</Dropzone>
        </div>

        {/* Right Side */}
        <div className="flex flex-col justify-center items-center w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          {loading ? (
            <ThreeDots height="50" width="50" color="#eee" ariaLabel="loading" />
          ) : outputImage ? (
            <div className="relative">
              <img
                src={outputImage}
                alt="AI Processed"
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
            <span className="text-gray-500">AI-processed image will appear here.</span>
          )}
        </div>
      </section>
      {/* Explanation and Example */}
<section className="mt-12 px-4 lg:px-6 xl:px-8">
  <h2 className="text-xl font-bold text-gray-300 mb-4">How to Use</h2>
  <p className="text-gray-400 mb-4">
    Remove unwanted objects from your photos using the following steps:
  </p>
  <ul className="list-disc list-inside text-gray-400 mb-6">
    <li>Upload an image using the upload section above.</li>
    <li>Use the brush tool to mark the area or object you want to remove. For example, you can remove unwanted accessories, logos, or other distractions.</li>
    <li>Click the "Remove Object" button to let the AI process the image and remove the marked area.</li>
    <li>Download the updated version of your photo without the unwanted objects.</li>
  </ul>
  <h3 className="text-lg font-semibold text-gray-300 mb-2">Example:</h3>
 
  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
  <img
      src="/8ex.jpg"
      alt="Example of object removal"
      className="h-auto w-full object-contain rounded-md mb-4"
    />
   
  <div className="flex justify-center items-center h-full">
  <img
    src="/dog.png"
    alt="Example of object removal"
    className="w-[512px] h-[512px] object-contain rounded-md"
  />
</div>
  </div>
</section>

    </main>
  );
}
