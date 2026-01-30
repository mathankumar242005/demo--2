import {
    collection,
    doc,
    getDocs,
    setDoc,
    deleteDoc,
    serverTimestamp,
    query,
    onSnapshot,
    Unsubscribe
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface CartItem {
    id?: string;
    productId: string;
    productName: string;
    productImage: string;
    color: string;
    colorHex: string;
    storage: string;
    price: number;
    quantity: number;
    addedAt?: any;
}

// Get cart collection reference for a user
const getCartRef = (userId: string) => collection(db, 'users', userId, 'cart');

// Add item to cart (or update quantity if exists)
export const addToCart = async (userId: string, item: Omit<CartItem, 'id' | 'addedAt'>): Promise<void> => {
    const cartRef = getCartRef(userId);
    // Use a composite key for uniqueness
    const itemId = `${item.productId}_${item.color}_${item.storage}`.replace(/\s+/g, '_');

    await setDoc(doc(cartRef, itemId), {
        ...item,
        addedAt: serverTimestamp(),
    });
};

// Update item quantity
export const updateCartItemQuantity = async (
    userId: string,
    itemId: string,
    quantity: number
): Promise<void> => {
    const cartRef = getCartRef(userId);

    if (quantity <= 0) {
        await deleteDoc(doc(cartRef, itemId));
    } else {
        await setDoc(doc(cartRef, itemId), { quantity }, { merge: true });
    }
};

// Remove item from cart
export const removeFromCart = async (userId: string, itemId: string): Promise<void> => {
    const cartRef = getCartRef(userId);
    await deleteDoc(doc(cartRef, itemId));
};

// Clear entire cart
export const clearCart = async (userId: string): Promise<void> => {
    const cartRef = getCartRef(userId);
    const snapshot = await getDocs(cartRef);

    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
};

// Get all cart items (one-time fetch)
export const getCartItems = async (userId: string): Promise<CartItem[]> => {
    const cartRef = getCartRef(userId);
    const snapshot = await getDocs(query(cartRef));

    return snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
    } as CartItem));
};

// Subscribe to cart changes (real-time)
export const subscribeToCart = (
    userId: string,
    callback: (items: CartItem[]) => void
): Unsubscribe => {
    const cartRef = getCartRef(userId);

    return onSnapshot(query(cartRef), (snapshot) => {
        const items = snapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        } as CartItem));
        callback(items);
    });
};
