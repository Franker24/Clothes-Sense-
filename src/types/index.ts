/**
 * SENSE E-Commerce Domain Types
 * Prepared for future Supabase PostgreSQL schema compatibility
 */

export type Gender = 'hombre' | 'mujer' | 'ninos' | 'unisex';

export type ProductCategory = 
  | 'remeras-tops'
  | 'buzos-hoodies'
  | 'camperas-abrigos'
  | 'pantalones-jeans'
  | 'calzado-zapatillas'
  | 'accesorios';

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  size: string; // e.g. "S", "M", "L", "XL", "39", "40", "41", "42"
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  gender: Gender;
  category: ProductCategory;
  price: number; // in ARS (Argentine Pesos)
  originalPrice?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  description: string;
  details: string[];
  careInstructions?: string[];
  images: string[];
  variants: ProductVariant[];
  availableColors: { name: string; hex: string }[];
  availableSizes: string[];
  rating?: number;
  reviewsCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  origin: string;
  description: string;
  logoText: string;
  coverImage?: string;
  featured?: boolean;
  productCount?: number;
}

export interface CartItem {
  id: string; // cart item composite ID (productId + color + size)
  productId: string;
  product: Product;
  selectedColor: string;
  selectedColorHex: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
}

export interface UserAddress {
  id: string;
  alias: string;
  fullName: string;
  street: string;
  number: string;
  floorApt?: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: UserAddress[];
  createdAt: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  provider: 'Correo Argentino' | 'Andreani' | 'SENSE Express CABA / GBA';
  estimatedDays: string;
  price: number;
  isFree?: boolean;
}

export type OrderPaymentStatus = 'aprobado' | 'pendiente' | 'rechazado';
export type OrderFulfillmentStatus = 'preparando' | 'enviado' | 'entregado' | 'cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    number: string;
    floorApt?: string;
    city: string;
    province: string;
    postalCode: string;
    notes?: string;
  };
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: 'Mercado Pago' | 'Tarjeta de Crédito / Débito' | 'Transferencia Bancaria';
  paymentStatus: OrderPaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  trackingNumber?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  total: number;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  discountTag: string;
  ctaText: string;
  ctaLink: string;
  code?: string;
  active: boolean;
}
