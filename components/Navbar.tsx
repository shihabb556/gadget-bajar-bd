'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { Button } from './ui/shared';

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartItems = useCartStore((state) => state.items);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-indigo-600">Hasib E-com</span>
                        </Link>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        <Link href="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>

                        <Link href="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600">
                            <ShoppingCart className="h-6 w-6" />
                            {mounted && totalItems > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {session ? (
                            <div className="relative ml-3 flex items-center space-x-4">
                                {session.user.role === 'ADMIN' && (
                                    <Link href="/admin/dashboard">
                                        <Button variant="outline" size="sm">Admin</Button>
                                    </Link>
                                )}
                                <span className="text-sm font-medium text-gray-700">{session.user.name}</span>
                                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link href="/auth/login">
                                <Button size="sm">Login</Button>
                            </Link>
                        )}
                    </div>

                    <div className="-mr-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <Link href="/" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                            Home
                        </Link>
                        <Link href="/cart" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                            Cart ({mounted ? totalItems : 0})
                        </Link>
                        {session ? (
                            <>
                                {session.user.role === 'ADMIN' && (
                                    <Link href="/admin/dashboard" className="block pl-3 pr-4 py-2 text-base font-medium text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50">
                                        Admin Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={() => signOut()}
                                    className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/auth/login" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
