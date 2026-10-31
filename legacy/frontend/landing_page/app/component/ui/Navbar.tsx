// components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa';

interface NavLink {
  name: string;
  href: string;
}

interface NavbarProps {
  logo: React.ReactNode;
  links?: NavLink[];
}

const Navbar: React.FC<NavbarProps> = ({
  logo,
  links = [
    { name: 'Try Demo', href: '/try-demo' },
    { name: 'Contact', href: '/contact' },
  ],
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = document.getElementById('mobile-menu');
      if (isOpen && nav && !nav.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] ${
        scrolled ? 'backdrop-blur-md bg-white/80' : 'backdrop-blur-md bg-white/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            {logo}
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-gray-900 ${
                  router.pathname === link.href
                    ? 'text-black'
                    : 'text-gray-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            <span className="sr-only">
              {isOpen ? 'Close main menu' : 'Open main menu'}
            </span>
            {isOpen ? (
              <FaTimes className="block h-6 w-6" />
            ) : (
              <FaBars className="block h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu with Glassmorphism */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute right-0 w-48 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '64px' }}
      >
        <div className="backdrop-blur-md bg-white/90 rounded-bl-lg shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
          <div className="py-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  router.pathname === link.href
                    ? 'bg-white/80 text-gray-900'
                    : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;