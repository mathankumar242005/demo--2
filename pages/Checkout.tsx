import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, ShippingAddress } from '../services/orderService';
import { ArrowLeft, Lock, Check, Loader2, Package } from 'lucide-react';

const Checkout: React.FC = () => {
    const { items, subtotal, tax, total, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');

    const [formData, setFormData] = useState<ShippingAddress>({
        firstName: '',
        lastName: '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isAuthenticated || !user) {
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
            return;
        }

        if (items.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);

        try {
            const order = await createOrder(
                user.uid,
                items,
                formData,
                subtotal,
                tax
            );

            // Clear cart after successful order
            await clearCart();

            setOrderNumber(order.orderNumber);
            setOrderComplete(true);
        } catch (err) {
            console.error('Checkout error:', err);
            setError('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Order confirmation screen
    if (orderComplete) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900 mb-4">
                        Thank you for your order!
                    </h1>
                    <p className="text-gray-500 mb-2">
                        Your order has been confirmed and will ship soon.
                    </p>
                    <p className="text-lg font-medium text-gray-900 mb-8">
                        Order Number: <span className="text-blue-600">{orderNumber}</span>
                    </p>

                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-8 text-left">
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="w-6 h-6 text-gray-400" />
                            <span className="font-medium">Shipping to:</span>
                        </div>
                        <p className="text-gray-600">
                            {formData.firstName} {formData.lastName}<br />
                            {formData.street}{formData.apartment ? `, ${formData.apartment}` : ''}<br />
                            {formData.city}, {formData.state} {formData.zipCode}<br />
                            {formData.country}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/orders"
                            className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
                        >
                            View Order History
                        </Link>
                        <Link
                            to="/store"
                            className="bg-gray-200 text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-gray-300 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Redirect if cart is empty
    if (items.length === 0 && !orderComplete) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen pt-24">
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h1>
                    <Link
                        to="/store"
                        className="text-blue-600 hover:underline"
                    >
                        Continue shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="py-8 flex items-center gap-4">
                    <Link to="/cart" className="text-blue-600 hover:text-blue-700">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-semibold text-gray-900">Checkout</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm">
                            <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Apartment, suite, etc. (optional)
                                </label>
                                <input
                                    type="text"
                                    name="apartment"
                                    value={formData.apartment}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ZIP Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="For delivery updates"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                    <Lock className="w-4 h-4" />
                                    <span>Your payment information is secure</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>Place Order - ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">{item.productName}</p>
                                            <p className="text-xs text-gray-500">{item.color} / {item.storage}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium text-sm">
                                            ${(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
