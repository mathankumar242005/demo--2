import { NavLinkType, Product } from './types';

export const NAV_LINKS = [
  { label: 'Store', path: '/store', type: NavLinkType.Store },
  { label: 'Mac', path: '/store?category=mac', type: NavLinkType.Mac },
  { label: 'iPad', path: '/store?category=ipad', type: NavLinkType.iPad },
  { label: 'iPhone', path: '/store?category=iphone', type: NavLinkType.iPhone },
  { label: 'Watch', path: '/store?category=watch', type: NavLinkType.Watch },
  { label: 'Support', path: '/support', type: NavLinkType.Support },
];

export const PRODUCTS: Product[] = [
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    tagline: 'Hello, Apple Intelligence.',
    description: 'The ultimate iPhone. Featuring the A18 Pro chip, Camera Control, and a stunning titanium design. Built for Apple Intelligence.',
    price: 999,
    category: 'iphone',
    isNew: true,
    image: 'https://picsum.photos/800/800?grayscale&blur=2',
    colors: [
      { name: 'Desert Titanium', hex: '#C5A586' },
      { name: 'Natural Titanium', hex: '#BEBDB8' },
      { name: 'White Titanium', hex: '#F2F1ED' },
      { name: 'Black Titanium', hex: '#3C3C3D' },
    ],
    storageOptions: [
      { size: '128GB', priceModifier: 0 },
      { size: '256GB', priceModifier: 100 },
      { size: '512GB', priceModifier: 300 },
      { size: '1TB', priceModifier: 500 },
    ],
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    tagline: 'Apple Intelligence is here.',
    description: 'A total powerhouse. Camera Control. Action button. And the superfast A18 chip.',
    price: 799,
    category: 'iphone',
    isNew: true,
    image: 'https://picsum.photos/800/800?grayscale',
    colors: [
      { name: 'Ultramarine', hex: '#5E6CE1' },
      { name: 'Teal', hex: '#87C2BC' },
      { name: 'Pink', hex: '#E79AB3' },
      { name: 'White', hex: '#F5F5F7' },
      { name: 'Black', hex: '#35393B' },
    ],
    storageOptions: [
      { size: '128GB', priceModifier: 0 },
      { size: '256GB', priceModifier: 100 },
      { size: '512GB', priceModifier: 300 },
    ],
  },
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air 15" with M3',
    tagline: 'Lean. Mean. M3 machine.',
    description: 'Supercharged by the M3 chip. The world’s most popular laptop is better than ever.',
    price: 1299,
    category: 'mac',
    isNew: true,
    image: 'https://picsum.photos/1200/800',
    colors: [
      { name: 'Midnight', hex: '#2e333b' },
      { name: 'Starlight', hex: '#f0e6d2' },
      { name: 'Space Gray', hex: '#7d7e80' },
      { name: 'Silver', hex: '#e3e4e5' },
    ],
    storageOptions: [
      { size: '256GB SSD', priceModifier: 0 },
      { size: '512GB SSD', priceModifier: 200 },
      { size: '1TB SSD', priceModifier: 400 },
    ],
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2',
    tagline: 'New finish. Never quit.',
    description: 'The most rugged and capable Apple Watch pushes the limits again. Now in black titanium.',
    price: 799,
    category: 'watch',
    isNew: true,
    image: 'https://picsum.photos/600/600',
    colors: [
      { name: 'Black Titanium', hex: '#1A1A1A' },
      { name: 'Natural Titanium', hex: '#cbbba0' },
    ],
    storageOptions: [
      { size: 'GPS + Cellular', priceModifier: 0 },
    ],
  },
   {
    id: 'ipad-pro-m4',
    name: 'iPad Pro (M4)',
    tagline: 'Thinpossible.',
    description: 'The thinnest Apple product ever. Featuring the outrageous performance of the M4 chip.',
    price: 999,
    category: 'ipad',
    isNew: true,
    image: 'https://picsum.photos/700/700',
    colors: [
      { name: 'Space Black', hex: '#2e2e2e' },
      { name: 'Silver', hex: '#e3e4e5' },
    ],
    storageOptions: [
      { size: '256GB', priceModifier: 0 },
      { size: '512GB', priceModifier: 200 },
      { size: '1TB', priceModifier: 600 },
    ],
  },
];