import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, LogOut, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, userData, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setLoggingOut(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen pt-24">
                <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">Sign in to view your profile</h1>
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

    const displayName = userData?.displayName || userData?.firstName
        ? `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim()
        : 'Apple User';

    return (
        <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="py-12">
                    <h1 className="text-4xl font-semibold text-gray-900">Your Account</h1>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
                    <div className="flex items-center gap-6 mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">{displayName}</h2>
                            <p className="text-gray-500">Apple ID</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{user?.email || 'Not set'}</p>
                            </div>
                        </div>

                        {userData?.phone && (
                            <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{userData.phone}</p>
                                </div>
                            </div>
                        )}

                        {userData?.address && (
                            <div className="flex items-center gap-4 py-3 border-b border-gray-100">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium">
                                        {userData.address.street}, {userData.address.city}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    <Link
                        to="/orders"
                        className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <Package className="w-6 h-6 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">Orders</p>
                                <p className="text-sm text-gray-500">View your order history</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>

                    <Link
                        to="/cart"
                        className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <User className="w-6 h-6 text-gray-400" />
                            <div>
                                <p className="font-medium text-gray-900">Shopping Bag</p>
                                <p className="text-sm text-gray-500">View items in your bag</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                </div>

                {/* Account Actions */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                    >
                        <div className="flex items-center gap-4">
                            <LogOut className="w-6 h-6 text-red-500" />
                            <div>
                                <p className="font-medium text-red-600">Sign Out</p>
                                <p className="text-sm text-gray-500">Sign out of your Apple ID</p>
                            </div>
                        </div>
                        {loggingOut && (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                        )}
                    </button>
                </div>

                {/* Account Info Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Account created: {userData?.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
