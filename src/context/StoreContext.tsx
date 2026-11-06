import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Brand, 
  Promotion, 
  CartItem, 
  Order, 
  UserProfile, 
  UserAddress 
} from '../types';
import { 
  PRODUCTS_DATA, 
  BRANDS_DATA, 
  PROMOTIONS_DATA, 
  INITIAL_ORDERS 
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Catalog
  products: Product[];
  brands: Brand[];
  promotions: Promotion[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, colorName: string, colorHex: string, size: string, quantity?: number) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingCost: number;
  cartTotal: number;
  cartItemCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Orders
  orders: Order[];
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (
    orderId: string, 
    paymentStatus: Order['paymentStatus'], 
    fulfillmentStatus: Order['fulfillmentStatus'],
    trackingNumber?: string
  ) => void;

  // Auth / User
  currentUser: UserProfile | null;
  login: (email: string) => boolean;
  register: (firstName: string, lastName: string, email: string, phone: string) => boolean;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  removeAddress: (addressId: string) => void;

  // Notification Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 120000;
const STANDARD_SHIPPING_FEE = 7800;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products & Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sense_products_v2');
      if (!saved) return PRODUCTS_DATA;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : PRODUCTS_DATA;
    } catch {
      return PRODUCTS_DATA;
    }
  });

  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const saved = localStorage.getItem('sense_brands_v1');
      if (!saved) return BRANDS_DATA;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : BRANDS_DATA;
    } catch {
      return BRANDS_DATA;
    }
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    try {
      const saved = localStorage.getItem('sense_promos_v1');
      if (!saved) return PROMOTIONS_DATA;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : PROMOTIONS_DATA;
    } catch {
      return PROMOTIONS_DATA;
    }
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sense_cart_v1');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sense_coupon_v1') || null;
    } catch {
      return null;
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sense_wishlist_v1');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('sense_orders_v1');
      if (!saved) return INITIAL_ORDERS;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('sense_user_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // ignore
    }
    // Seed an initial demo session user so the user can immediately test account capabilities
    return {
      id: 'usr-default',
      email: 'demo@sense.com.ar',
      firstName: 'Mateo',
      lastName: 'Romero',
      phone: '+54 11 4829-1920',
      createdAt: '2026-01-15T10:00:00Z',
      addresses: [
        {
          id: 'addr-1',
          alias: 'Casa Principal',
          fullName: 'Mateo Romero',
          street: 'Av. Santa Fe',
          number: '3245',
          floorApt: '4 B',
          city: 'Palermo, CABA',
          province: 'Ciudad Autónoma de Buenos Aires',
          postalCode: 'C1425BGD',
          phone: '+54 11 4829-1920',
          isDefault: true,
        },
      ],
    };
  });

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sense_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sense_brands_v1', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('sense_promos_v1', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('sense_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('sense_coupon_v1', appliedCoupon);
    } else {
      localStorage.removeItem('sense_coupon_v1');
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('sense_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('sense_orders_v1', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sense_user_v1', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sense_user_v1');
    }
  }, [currentUser]);

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const cartDiscount = appliedCoupon === 'SENSE10'
    ? Math.round(cartSubtotal * 0.1)
    : 0;

  const cartShippingCost = (cartSubtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon === 'ENVIOGRATIS' || cart.length === 0)
    ? 0
    : STANDARD_SHIPPING_FEE;

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShippingCost);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Cart Actions
  const addToCart = (
    product: Product, 
    colorName: string, 
    colorHex: string, 
    size: string, 
    quantity = 1
  ): boolean => {
    if (!size || !colorName) {
      showToast('Por favor seleccioná un talle y color', 'error');
      return false;
    }

    const matchingVariant = product.variants.find(
      (v) => v.colorName.toLowerCase() === colorName.toLowerCase() && v.size === size
    );

    if (matchingVariant && matchingVariant.stock <= 0) {
      showToast('Lo sentimos, esa combinación no tiene stock disponible', 'error');
      return false;
    }

    const cartItemId = `${product.id}_${colorName}_${size}`;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === cartItemId);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (matchingVariant && nextQty > matchingVariant.stock) {
          showToast(`Límite de stock alcanzado (${matchingVariant.stock} disponibles)`, 'info');
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity: nextQty } : item
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedColor: colorName,
          selectedColorHex: colorHex,
          selectedSize: size,
          quantity,
          unitPrice: product.price,
        },
      ];
    });

    showToast(`"${product.name}" agregado a tu bolsa`, 'success');
    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Producto eliminado del carrito', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const formattedCode = code.trim().toUpperCase();
    if (formattedCode === 'SENSE10') {
      setAppliedCoupon('SENSE10');
      showToast('¡Cupón SENSE10 aplicado! 10% de descuento', 'success');
      return { success: true, message: '10% de descuento aplicado con éxito.' };
    }
    if (formattedCode === 'ENVIOGRATIS') {
      setAppliedCoupon('ENVIOGRATIS');
      showToast('¡Envío gratis bonificado!', 'success');
      return { success: true, message: 'Envío bonificado para este pedido.' };
    }
    showToast('El cupón ingresado no es válido', 'error');
    return { success: false, message: 'Cupón inválido. Probá con SENSE10 o ENVIOGRATIS.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón removido', 'info');
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Eliminado de tus favoritos', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Guardado en tus favoritos', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const clearWishlist = () => setWishlist([]);

  // Orders Actions
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `SNS-${randomNum}`,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    paymentStatus: Order['paymentStatus'],
    fulfillmentStatus: Order['fulfillmentStatus'],
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              paymentStatus,
              fulfillmentStatus,
              ...(trackingNumber ? { trackingNumber } : {}),
            }
          : o
      )
    );
    showToast('Estado del pedido actualizado', 'success');
  };

  // Auth Actions
  const login = (email: string) => {
    const mockUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      firstName: email.split('@')[0] || 'Cliente',
      lastName: 'SENSE',
      phone: '+54 11 3902-8819',
      createdAt: new Date().toISOString(),
      addresses: [
        {
          id: 'addr-demo',
          alias: 'Dirección Principal',
          fullName: `${email.split('@')[0]} SENSE`,
          street: 'Av. Libertador',
          number: '2450',
          city: 'Palermo, CABA',
          province: 'Ciudad Autónoma de Buenos Aires',
          postalCode: 'C1425',
          phone: '+54 11 3902-8819',
          isDefault: true,
        },
      ],
    };
    setCurrentUser(mockUser);
    showToast(`¡Bienvenido de vuelta, ${mockUser.firstName}!`, 'success');
    return true;
  };

  const register = (firstName: string, lastName: string, email: string, phone: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      firstName,
      lastName,
      phone,
      createdAt: new Date().toISOString(),
      addresses: [],
    };
    setCurrentUser(newUser);
    showToast(`Cuenta creada con éxito. ¡Bienvenido a SENSE!`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Sesión cerrada correctamente', 'info');
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...profile });
    showToast('Perfil actualizado con éxito', 'success');
  };

  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddr: UserAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    const updatedAddresses = address.isDefault
      ? [...currentUser.addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
      : [...currentUser.addresses, newAddr];

    setCurrentUser({
      ...currentUser,
      addresses: updatedAddresses,
    });
    showToast('Nueva dirección guardada', 'success');
  };

  const removeAddress = (addressId: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      addresses: currentUser.addresses.filter((a) => a.id !== addressId),
    });
    showToast('Dirección eliminada', 'info');
  };

  // Catalog CRUD (Admin)
  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Producto "${newProduct.name}" creado con éxito`, 'success');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('Producto actualizado en catálogo', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Producto eliminado del catálogo', 'info');
  };

  const addBrand = (brandData: Omit<Brand, 'id'>) => {
    const newBrand: Brand = {
      ...brandData,
      id: brandData.slug || `brand-${Date.now()}`,
    };
    setBrands((prev) => [...prev, newBrand]);
    showToast(`Marca "${newBrand.name}" añadida`, 'success');
  };

  const updateBrand = (id: string, updatedFields: Partial<Brand>) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
    showToast('Marca actualizada', 'success');
  };

  const deleteBrand = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
    showToast('Marca eliminada', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        brands,
        promotions,
        addProduct,
        updateProduct,
        deleteProduct,
        addBrand,
        updateBrand,
        deleteBrand,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartShippingCost,
        cartTotal,
        cartItemCount,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        orders,
        createOrder,
        updateOrderStatus,
        currentUser,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        toasts,
        showToast,
      }}
    >
      {children}
      {/* Toast Feedback Portal */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all transform duration-200 ${
              toast.type === 'error'
                ? 'bg-white text-[#C8102E] border-[#C8102E]'
                : toast.type === 'info'
                ? 'bg-[#111111] text-white border-black'
                : 'bg-[#111111] text-white border-black'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
