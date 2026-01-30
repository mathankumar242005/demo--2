import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    CartItem,
    addToCart as addToCartService,
    updateCartItemQuantity,
    removeFromCart as removeFromCartService,
    clearCart as clearCartService,
    subscribeToCart
} from '../services/cartService';

interface CartContextType {
    items: CartItem[];
    loading: boolean;
    itemCount: number;
    subtotal: number;
    tax: number;
    total: number;
    addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

// Local storage key for guest cart
const GUEST_CART_KEY = 'apple_guest_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Load cart from localStorage for guests or subscribe to Firestore for logged-in users
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        if (isAuthenticated && user) {
            // Subscribe to Firestore cart for logged-in users
            setLoading(true);
            unsubscribe = subscribeToCart(user.uid, (cartItems) => {
                setItems(cartItems);
                setLoading(false);
            });
        } else {
            // Load from localStorage for guests
            try {
                const savedCart = localStorage.getItem(GUEST_CART_KEY);
                if (savedCart) {
                    setItems(JSON.parse(savedCart));
                }
            } catch (e) {
                console.error('Error loading guest cart:', e);
            }
            setLoading(false);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [isAuthenticated, user]);

    // Save guest cart to localStorage
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
        }
    }, [items, isAuthenticated]);

    // Calculate totals
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const TAX_RATE = 0.0825; // 8.25% tax
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // Add item to cart
    const addItem = useCallback(async (item: Omit<CartItem, 'id' | 'addedAt'>) => {
        if (isAuthenticated && user) {
            await addToCartService(user.uid, item);
        } else {
            // Guest cart - handle locally
            const itemId = `${item.productId}_${item.color}_${item.storage}`.replace(/\s+/g, '_');
            setItems(prev => {
                const existing = prev.find(i => i.id === itemId);
                if (existing) {
                    return prev.map(i =>
                        i.id === itemId
                            ? { ...i, quantity: i.quantity + item.quantity }
                            : i
                    );
                }
                return [...prev, { ...item, id: itemId }];
            });
        }
    }, [isAuthenticated, user]);

    // Update item quantity
    const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
        if (isAuthenticated && user) {
            await updateCartItemQuantity(user.uid, itemId, quantity);
        } else {
            // Guest cart
            if (quantity <= 0) {
                setItems(prev => prev.filter(i => i.id !== itemId));
            } else {
                setItems(prev => prev.map(i =>
                    i.id === itemId ? { ...i, quantity } : i
                ));
            }
        }
    }, [isAuthenticated, user]);

    // Remove item
    const removeItem = useCallback(async (itemId: string) => {
        if (isAuthenticated && user) {
            await removeFromCartService(user.uid, itemId);
        } else {
            setItems(prev => prev.filter(i => i.id !== itemId));
        }
    }, [isAuthenticated, user]);

    // Clear cart
    const clearCart = useCallback(async () => {
        if (isAuthenticated && user) {
            await clearCartService(user.uid);
        } else {
            setItems([]);
        }
    }, [isAuthenticated, user]);

    const value: CartContextType = {
        items,
        loading,
        itemCount,
        subtotal,
        tax,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
