'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

    // Check if user is logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-white text-black shadow-md' : 'bg-blue-600 text-white'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Space Booking</Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          {user && <Link href="/booking" className="hover:underline">Book</Link>}
          {user && <Link href="/dashboard" className="hover:underline">Dashboard</Link>}
          {user?.role === 'admin' && <Link href="/admin" className="hover:underline">Admin</Link>}
          {user ? (
            <Link href="/api/auth/logout" className="hover:underline">Logout</Link>
          ) : (
            <Link href="/signin" className="hover:underline">Sign In</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md hover:bg-opacity-20 hover:bg-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-600 text-white shadow-md">
          <div className="px-4 py-2 space-y-2">
            <Link href="/" className="block hover:underline" onClick={toggleMenu}>Home</Link>
            {user && <Link href="/booking" className="block hover:underline" onClick={toggleMenu}>Book</Link>}
            {user && <Link href="/dashboard" className="block hover:underline" onClick={toggleMenu}>Dashboard</Link>}
            {user?.role === 'admin' && <Link href="/admin" className="block hover:underline" onClick={toggleMenu}>Admin</Link>}
            {user ? (
              <Link href="/api/auth/logout" className="block hover:underline" onClick={toggleMenu}>Logout</Link>
            ) : (
              <Link href="/signin" className="block hover:underline" onClick={toggleMenu}>Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}