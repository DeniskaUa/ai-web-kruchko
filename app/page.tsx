'use client';

import Link from 'next/link';
import Slider from 'react-slick';
import { FaMagic,FaPenFancy, FaTools, FaImage, FaCamera, FaPalette, FaCut, FaFileAlt } from 'react-icons/fa';


  export default function HomePage() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      autoplay: true,
      autoplaySpeed: 10000,
      arrows: true,
      prevArrow: (
        <button
          type="button"
          className="absolute left-0 z-10 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700"
        >
          ‹
        </button>
      ),
      nextArrow: (
        <button
          type="button"
          className="absolute right-0 z-10 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700"
        >
          ›
        </button>
      ),
      appendDots: (dots: React.ReactNode) => (
        <div style={{ bottom: '-30px' }}>
          <ul className="flex justify-center ml-[-50px]">{dots}</ul>
        </div>
      ),
      customPaging: () => (
        <div className="w-3 h-3 bg-indigo-500 rounded-full cursor-pointer hover:bg-indigo-700" />
      ),
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
  
  

  const tools = [
    {
      title: 'Remove Background',
      description: 'Effortlessly remove backgrounds from your images.',
      link: '/remove-background',
      icon: <FaMagic className="text-indigo-500 text-3xl mb-4" />,
    },
    {
      title: 'Text Extraction',
      description: 'Upload an image to extract text seamlessly.',
      link: '/text-extractor',
      icon: <FaTools className="text-indigo-500 text-3xl mb-4" />,
    },
    {
      title: 'Generate Stickers',
      description: 'Create unique stickers with AI prompts.',
      link: '/face-to-sticker',
      icon: <FaImage className="text-indigo-500 text-3xl mb-4" />,
    },
    {
      title: 'Restore Faces',
      description: 'Enhance and restore faces in photos with AI.',
      link: '/restoreFacesFromPhotos',
      icon: <FaCamera className="text-indigo-500 text-3xl mb-4" />,
    },
    {
      title: 'Colorize Photos',
      description: 'Bring black-and-white photos to life with AI coloring.',
      link: '/photo-colorizer',
      icon: <FaPalette className="text-indigo-500 text-3xl mb-4" />,
    },
    {
      title: 'Object Removal',
      description: 'Mark and remove unwanted objects in your images.',
      link: '/object-removal',
      icon: <FaCut className="text-indigo-500 text-3xl mb-4" />,
    },
    {
      title: 'Image Captioning',
      description: 'Generate captions to describe the contents of an image.',
      link: '/image-captioning',
      icon: <FaFileAlt className="text-indigo-500 text-3xl mb-4" />,
    },
    {
      title: 'Text-to-Image',
      description: 'Generate stunning images from text prompts.',
      link: '/text-to-image',
      icon: <FaPenFancy className="text-indigo-500 text-3xl mb-4" />,
    },
  ];

  return (
    <main className="lg:pl-72 bg-gray-900 text-gray-300 flex flex-col min-h-screen">
      {/* Welcome Section */}
      <section className="flex flex-col items-center justify-center py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Photo Tools Hub</h1>
        <p className="text-lg max-w-2xl">
          Discover a suite of AI-powered tools to enhance your images and extract valuable information. Start transforming your media with just a few clicks!
        </p>
      </section>

      {/* Features Section: Carousel */}
      <section className="py-16 relative">
        <Slider {...settings} className="px-6">
          {tools.map((tool, index) => (
            <div key={index} className="px-4">
              <div className="flex flex-col items-center bg-gray-800 p-6 rounded-lg shadow-md">
                {tool.icon}
                <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                <p className="text-sm text-gray-400 mb-4 text-center">{tool.description}</p>
                <Link href={tool.link} className="text-indigo-500 hover:underline">
                  Learn More →
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Example Section */}
      <section className="py-8 px-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Use AI Tools Hub?</h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Our tools are designed to be intuitive and efficient. Whether you want to remove backgrounds, extract text, or create stickers, our platform has got you covered.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 mt-auto">
        <p className="text-sm">© 2024 AI Photo Tools Hub. All rights reserved.</p>
      </footer>
    </main>
  );
}
