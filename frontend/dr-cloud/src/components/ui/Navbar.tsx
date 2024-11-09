// components/Navbar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/component/Navbar.module.css';
import { useRouter } from 'next/router';
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';


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
    const [darkMode, setDarkMode] = useState(false); // Example state for theme toggle
  
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };
  
    const toggleDarkModeHandler = () => {
      setDarkMode(!darkMode);
      // Implement theme toggle logic here (e.g., using Context or state management)
    };
  
    return (
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          {logo}
        </div>
        
        {/* Hamburger Menu Icon */}
        <div
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleMenu();
            }
          }}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <ul className={`${styles.navLinks} ${isOpen ? styles.active : ''}`}>
          {links.map((link) => {
            const isActive = router.pathname === link.href;
            return (
              <li key={link.name} className={styles.navItem}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                  onClick={() => setIsOpen(false)} // Close menu on link click
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  };
  
  export default Navbar;