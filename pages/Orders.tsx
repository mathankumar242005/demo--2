import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, Order } from '../services/orderService';
import { Package, ChevronRight, Loader2, ShoppingBag } from 'lucide-react';

const statusColors: Record<Order['status'], { bg: string; text: string }> = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
    processing: { bg: 'bg-purple-100', text: 'text-purple-800' },
    shipped: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

const Orders: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                const userOrders = await getUserOrders(user.uid);
                setOrders(userOrders);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user, isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen pt-24">
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Sign in to view your orders</h1>
                    <Link
                        to="/login"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen pt-24 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen pt-24">
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-blue-600 hover:underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen pt-24">
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-6" />
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h1>
                    <p className="text-gray-500 mb-8">When you place an order, it will appear here.</p>
                    <Link
                        to="/store"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="py-12">
                    <h1 className="text-4xl font-semibold text-gray-900">Your Orders</h1>
                    <p className="text-gray-500 mt-2">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl p-6 shadow-sm"
                        >
                            {/* Order Header */}
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Order Number</p>
                                    <p className="font-semibold text-lg">{order.orderNumber}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status].bg} ${statusColors[order.status].text}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-4 mb-6">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.color} / {item.storage} • Qty: {item.quantity}
                                            </p>
                                        </div>
                                        <p className="font-medium">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Order Footer */}
                            <div className="border-t border-gray-200 pt-4 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Package className="w-4 h-4" />
                                    {order.estimatedDelivery ? (
                                        <span>Estimated delivery: {order.estimatedDelivery}</span>
                                    ) : (
                                        <span>Ordered on {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-semibold text-lg">
                                        Total: ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Orders;
