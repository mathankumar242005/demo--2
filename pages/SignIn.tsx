import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Smartphone, Lock } from 'lucide-react';

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            console.error('Login error:', err);
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/invalid-credential':
                    setError('Incorrect email or password.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many attempts. Please try again later.');
                    break;
                default:
                    setError('Failed to log in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black text-white min-h-screen pt-24 px-4 flex flex-col items-center">
            <div className="w-full max-w-md p-8 bg-[#1a1a1a] rounded-2xl border border-[#333]">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold mb-2">Sign in to Apple</h2>
                    <p className="text-gray-400">Access your saved items and orders.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email or Phone Number"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-[#2a2a2a] border border-[#444] rounded-lg p-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            />
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                        {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-[#333] text-center">
                    <p className="text-gray-400">
                        Don't have an Apple ID?{' '}
                        <Link to="/signup" className="text-blue-500 hover:underline">
                            Create yours now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
