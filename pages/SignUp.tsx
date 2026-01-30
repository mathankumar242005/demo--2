import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, User, Mail, Lock } from 'lucide-react';

const SignUp: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            const { email, password, firstName, lastName } = formData;
            await signup(email, password, {
                firstName,
                lastName,
                displayName: `${firstName} ${lastName}`.trim()
            });
            navigate('/');
        } catch (err: any) {
            console.error('Signup error:', err);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('Email is already registered');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak');
                    break;
                default:
                    setError('Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen pt-24 px-4 flex flex-col items-center">
            <div className="w-full max-w-md p-8 bg-[#1a1a1a] rounded-2xl border border-[#333]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold mb-2">Create Apple ID</h2>
                    <p className="text-gray-400">One account for everything Apple.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg p-4 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg p-4 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? 'Creating Account...' : 'Create Apple ID'}
                        {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#333] text-center">
                    <p className="text-gray-400">
                        Already have an Apple ID?{' '}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
