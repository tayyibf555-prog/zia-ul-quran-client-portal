import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Mock Login Logic
        setTimeout(() => {
            // Accepting the provided credentials or generic ones
            if ((email.toLowerCase() === 'mnr0141@hotmail.com' || email.toLowerCase() === 'admin@azen.com') && password === 'ziaulquran2026') {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/dashboard');
            } else {
                setError('Invalid credentials. Try username: mnr0141@hotmail.com, password: ziaulquran2026');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-azen-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients/Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-azen-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-azen-secondary/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-md bg-azen-card/60 backdrop-blur-xl border border-azen-border/50 rounded-2xl p-8 shadow-2xl relative z-10">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">
                        Client <span className="text-gradient">Portal</span>
                    </h1>
                    <p className="text-azen-muted text-sm">Welcome back to Zia-ul-Quran</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-azen-muted ml-1">Username / Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azen-muted group-focus-within:text-azen-primary transition-colors" />
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-azen-bg/50 border border-azen-border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-azen-muted/50 focus:outline-none focus:border-azen-primary/50 focus:ring-1 focus:ring-azen-primary/50 transition-all font-sans"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-azen-muted ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-azen-muted group-focus-within:text-azen-primary transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-azen-bg/50 border border-azen-border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-azen-muted/50 focus:outline-none focus:border-azen-primary/50 focus:ring-1 focus:ring-azen-primary/50 transition-all font-sans"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-azen-primary to-azen-secondary hover:opacity-90 text-azen-button-text font-bold py-4 rounded-xl transition-all shadow-glow hover:shadow-glow-strong flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="#" className="text-sm text-azen-muted hover:text-azen-primary transition-colors">
                        Forgot your password?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
