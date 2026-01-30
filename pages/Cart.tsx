import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart: React.FC = () => {
    const { items, loading, itemCount, subtotal, tax, total, updateQuantity, removeItem } = useCart();
    const { isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen pt-24 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen pt-24">
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                    <h1 className="text-3xl font-semibold text-gray-900 mb-4">Your bag is empty.</h1>
                    <p className="text-gray-500 mb-8">
                        {isAuthenticated
                            ? "Looks like you haven't added anything to your bag yet."
                            : "Sign in to see if you have any saved items, or continue shopping."}
                    </p>
                    <Link
                        to="/store"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                        <ArrowRight className="w-5 h-5" />
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
                    <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
                        Your bag. <span className="text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}.</span>
                    </h1>
                </div>

                {/* Cart Items */}
                <div className="space-y-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6"
                        >
                            {/* Product Image */}
                            <div className="w-32 h-32 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                                <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">{item.productName}</h3>
                                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                                        <p className="flex items-center gap-2">
                                            <span
                                                className="w-4 h-4 rounded-full border border-gray-300"
                                                style={{ backgroundColor: item.colorHex }}
                                            />
                                            {item.color}
                                        </p>
                                        <p>{item.storage}</p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeItem(item.id!)}
                                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="text-right sm:min-w-[100px]">
                                <p className="text-xl font-semibold text-gray-900">
                                    ${(item.price * item.quantity).toLocaleString()}
                                </p>
                                {item.quantity > 1 && (
                                    <p className="text-sm text-gray-500">${item.price.toLocaleString()} each</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm">
                    <div className="space-y-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Estimated tax</span>
                            <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-semibold text-gray-900">
                            <span>Total</span>
                            <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        {isAuthenticated ? (
                            <Link
                                to="/checkout"
                                className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                Check Out
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        ) : (
                            <div className="space-y-4">
                                <Link
                                    to="/login"
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    Sign in to Check Out
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <p className="text-center text-sm text-gray-500">
                                    Sign in to access your saved items and complete your purchase.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-8 text-center">
                    <Link
                        to="/store"
                        className="text-blue-600 hover:underline font-medium"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
