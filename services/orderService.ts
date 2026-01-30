import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem } from './cartService';

export interface ShippingAddress {
    firstName: string;
    lastName: string;
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
}

export interface OrderItem {
    productId: string;
    productName: string;
    productImage: string;
    color: string;
    colorHex: string;
    storage: string;
    price: number;
    quantity: number;
}

export interface Order {
    id?: string;
    userId: string;
    orderNumber: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingAddress: ShippingAddress;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    estimatedDelivery?: string;
}

// Generate order number
const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `W${timestamp}${random}`;
};

// Create new order
export const createOrder = async (
    userId: string,
    cartItems: CartItem[],
    shippingAddress: ShippingAddress,
    subtotal: number,
    tax: number
): Promise<Order> => {
    const orderNumber = generateOrderNumber();
    const shipping = 0; // Free shipping
    const total = subtotal + tax + shipping;

    // Calculate estimated delivery (2-5 business days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const orderData: Omit<Order, 'id'> = {
        userId,
        orderNumber,
        items: cartItems.map(item => ({
            productId: item.productId,
            productName: item.productName,
            productImage: item.productImage,
            color: item.color,
            colorHex: item.colorHex,
            storage: item.storage,
            price: item.price,
            quantity: item.quantity,
        })),
        subtotal,
        tax,
        shipping,
        total,
        status: 'confirmed',
        shippingAddress,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        estimatedDelivery,
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);

    return {
        id: docRef.id,
        ...orderData,
    };
};

// Get user's orders
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Order));
};

// Get single order
export const getOrder = async (orderId: string): Promise<Order | null> => {
    const docSnap = await getDoc(doc(db, 'orders', orderId));
    if (docSnap.exists()) {
        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Order;
    }
    return null;
};

// Update order status
export const updateOrderStatus = async (
    orderId: string,
    status: Order['status']
): Promise<void> => {
    await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: serverTimestamp(),
    });
};
