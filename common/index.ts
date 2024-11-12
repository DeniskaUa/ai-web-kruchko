
import { NavItem } from '@/types';
import { FaMagic,FaHome,FaPenFancy, FaTools, FaImage, FaCamera, FaPalette, FaCut, FaFileAlt } from 'react-icons/fa';

export const navigation: Array<NavItem> = [
  { name: 'Home', href: '/', icon: FaHome },
  { name: 'Remove Background', href: '/remove-background', icon: FaMagic },
  { name: 'Text Extraction', href: '/text-extractor', icon: FaTools },
  { name: 'Text-to-Image', href: '/text-to-image', icon: FaPenFancy },
  { name: 'Restore Faces', href: '/restoreFacesFromPhotos', icon: FaCamera },
  { name: 'Generate Stickers', href: '/face-to-sticker', icon: FaImage },
  { name: 'Image Captioning', href: '/image-captioning', icon: FaFileAlt },
  { name: 'Colorize Photos', href: '/photo-colorizer', icon: FaPalette },
  { name: 'Object Removal', href: '/object-removal', icon: FaCut },
];
