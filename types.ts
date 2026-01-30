export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  category: 'mac' | 'iphone' | 'ipad' | 'watch' | 'audio';
  isNew?: boolean;
  colors: ProductColor[];
  storageOptions: StorageOption[];
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string; // Optional specific image for this color
}

export interface StorageOption {
  size: string;
  priceModifier: number;
}

export interface CartItem {
  product: Product;
  color: ProductColor;
  storage: StorageOption;
  quantity: number;
}

export enum NavLinkType {
  Store = 'Store',
  Mac = 'Mac',
  iPad = 'iPad',
  iPhone = 'iPhone',
  Watch = 'Watch',
  Support = 'Support',
}