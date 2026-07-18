'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingBag, User, Search, Menu, X, LogOut, Settings, Package, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/lib/store';
import { Button, Input } from './ui/shared';
import { useRouter, useSearchParams } from 'next/navigation';

function LogoMark() {
    return (
        <svg viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
            {/* Device icon */}
            <rect x="2" y="6" width="22" height="36" rx="5" stroke="url(#logo-grad)" strokeWidth="2.2" fill="none" />
            <circle cx="13" cy="38" r="1.5" fill="url(#logo-grad)" />
            <line x1="9" y1="10" x2="17" y2="10" stroke="url(#logo-grad)" strokeWidth="1.5" strokeLinecap="round" />
            {/* Signal dots */}
            <circle cx="34" cy="16" r="2" fill="#3B82F6" />
            <circle cx="42" cy="16" r="2" fill="#3B82F6" opacity="0.6" />
            <circle cx="50" cy="16" r="2" fill="#3B82F6" opacity="0.3" />
            {/* Text: Gadget */}
            <text x="58" y="28" fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif" fontSize="19" fontWeight="700" fill="white" letterSpacing="-0.5">
                Gadget
            </text>
            {/* Text: Bazar */}
            <text x="131" y="28" fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif" fontSize="19" fontWeight="700" fill="#3B82F6" letterSpacing="-0.5">
                Bazar
            </text>
            {/* BD badge */}
            <rect x="185" y="14" width="13" height="13" rx="3" fill="#3B82F6" opacity="0.15" />
            <text x="187.5" y="24" fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif" fontSize="9" fontWeight="800" fill="#60A5FA" letterSpacing="0.5">
                BD
            </text>
            <defs>
                <linearGradient id="logo-grad" x1="2" y1="6" x2="24" y2="42" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
            </defs>
        </svg>
    );
}

export default function Navbar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const cartItems = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        setMounted(true);

        const query = searchParams.get('search');
        if (query) setSearchQuery(query);
        else setSearchQuery('');

        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll, { passive: true });

        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (mounted) {
                const params = new URLSearchParams(searchParams.toString());
                const currentSearch = params.get('search') || '';

                if (searchQuery.trim() !== currentSearch) {
                    if (searchQuery.trim()) {
                        params.set('search', searchQuery.trim());
                    } else {
                        params.delete('search');
                    }
                    const newPath = params.toString() ? `/?${params.toString()}` : '/';
                    router.push(newPath);
                }
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [searchQuery, router, mounted, searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <>
            {/* Signature gradient accent line */}
            <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 fixed top-0 z-[60]" />

            <nav
                className={`sticky top-[3px] z-50 transition-all duration-300 ${
                    scrolled
                        ? 'bg-[#0F172A]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/[0.06]'
                        : 'bg-[#0F172A]/80 backdrop-blur-md border-b border-white/[0.04]'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-[72px]">
                        {/* Logo & Desktop Nav */}
                        <div className="flex items-center gap-10">
                            <Link
                                href="/"
                                className="flex items-center group transition-transform hover:scale-[1.02]"
                            >
                                <LogoMark />
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden md:flex items-center gap-1">
                                {[
                                    { href: '/', label: 'Home' },
                                    { href: '/shop', label: 'Shop' },
                                    { href: '/track-order', label: 'Track Order' },
                                ].map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="relative px-4 py-2 text-[13px] font-semibold text-slate-300 hover:text-white transition-colors duration-200 group"
                                    >
                                        {link.label}
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-300 group-hover:w-3/4" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Search Bar - Desktop */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <Search className="h-4 w-4 text-slate-500 transition-colors group-focus-within:text-blue-400" />
                                </div>
                                <Input
                                    type="search"
                                    placeholder="Search gadgets..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/[0.06] border-white/[0.08] focus:bg-white/[0.1] focus:border-blue-500/50 focus:ring-blue-500/20 rounded-full pl-11 pr-10 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 transition-all duration-300"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-3 flex items-center p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </form>

                        {/* Action Icons */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all duration-200"
                            >
                                <ShoppingBag className="h-[22px] w-[22px]" />
                                {mounted && totalItems > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-br from-blue-500 to-blue-600 rounded-full ring-2 ring-[#0F172A] animate-in fade-in zoom-in duration-200">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {/* Profile */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="p-2.5 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all duration-200"
                                >
                                    <User className="h-[22px] w-[22px]" />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-72 bg-[#1E293B]/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40 border border-white/[0.08] py-2 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
                                        {session ? (
                                            <>
                                                {/* User Info */}
                                                <div className="px-5 py-4 border-b border-white/[0.06] mb-1">
                                                    <p className="text-sm font-bold text-white truncate">
                                                        {session.user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                                        {session.user.email}
                                                    </p>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="px-2">
                                                    <Link
                                                        href="/track-order"
                                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-150"
                                                    >
                                                        <Search className="h-4 w-4 text-slate-500" />
                                                        <span className="flex-1">Track Order</span>
                                                        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                                                    </Link>
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-150"
                                                    >
                                                        <User className="h-4 w-4 text-slate-500" />
                                                        <span className="flex-1">My Profile</span>
                                                        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                                                    </Link>
                                                    <Link
                                                        href="/profile"
                                                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-150"
                                                    >
                                                        <Package className="h-4 w-4 text-slate-500" />
                                                        <span className="flex-1">My Orders</span>
                                                        <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
                                                    </Link>
                                                    {session.user.role === 'ADMIN' && (
                                                        <Link
                                                            href="/admin/dashboard"
                                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-blue-400 font-semibold hover:bg-blue-500/10 rounded-xl transition-all duration-150"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                            <span className="flex-1">Admin Dashboard</span>
                                                            <ChevronRight className="h-3.5 w-3.5 text-blue-500/40" />
                                                        </Link>
                                                    )}
                                                </div>

                                                {/* Logout */}
                                                <div className="border-t border-white/[0.06] mt-1 pt-1 px-2">
                                                    <button
                                                        onClick={() => signOut()}
                                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-150 font-medium"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="p-5 space-y-3">
                                                <p className="text-sm text-slate-400 font-medium">
                                                    Welcome to Gadget Bazar BD
                                                </p>
                                                <Link href="/auth/login" className="block">
                                                    <Button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-2.5 font-bold text-xs tracking-widest shadow-lg shadow-blue-500/20 transition-all duration-200">
                                                        Login
                                                    </Button>
                                                </Link>
                                                <Link
                                                    href="/auth/register"
                                                    className="block text-center text-xs text-slate-500 font-medium hover:text-blue-400 transition-colors"
                                                >
                                                    Don&apos;t have an account? Sign Up
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <div className="flex items-center md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                                >
                                    {isMenuOpen ? (
                                        <X className="h-[22px] w-[22px]" />
                                    ) : (
                                        <Menu className="h-[22px] w-[22px]" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden px-4 pb-4">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <Search className="h-4 w-4 text-slate-500" />
                        </div>
                        <Input
                            type="search"
                            placeholder="Search gadgets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.06] border-white/[0.08] focus:bg-white/[0.1] focus:border-blue-500/50 rounded-full pl-11 pr-10 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 transition-all duration-300"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-3 flex items-center p-2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </form>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/[0.06] bg-[#0F172A]/95 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
                        <div className="px-4 pt-4 pb-6 space-y-1">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/shop', label: 'Shop' },
                                { href: '/track-order', label: 'Track Order' },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between px-4 py-3.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all duration-200"
                                >
                                    {link.label}
                                    <ChevronRight className="h-4 w-4 text-slate-600" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
