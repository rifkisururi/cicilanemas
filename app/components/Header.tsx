'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="header-container">
                {/* Logo */}
                <Link href="/" className="logo">
                    <span className="logo-icon">💎</span>
                    <span className="logo-text">Cicilan Emas</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="nav-desktop">
                    <Link href="/" className="nav-link">Beranda</Link>
                    <Link href="/produk" className="nav-link">Produk</Link>
                    <Link href="/dashboard" className="nav-link">Dashboard</Link>
                    <Link href="/admin" className="nav-link nav-admin">Admin</Link>
                    <ThemeToggle />
                </nav>

                {/* Mobile Menu Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <ThemeToggle />
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
                <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Beranda
                </Link>
                <Link href="/produk" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Produk
                </Link>
                <Link href="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                </Link>
                <Link href="/admin" className="nav-link nav-admin" onClick={() => setIsMenuOpen(false)}>
                    Admin Panel
                </Link>
            </nav>
        </header>
    );
}
