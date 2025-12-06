'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();

    const navLinks = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/settings', label: 'Pengaturan', icon: '⚙️' },
        { href: '/admin/stok', label: 'Manajemen Stok', icon: '📦' },
        { href: '/admin/cicilan', label: 'Daftar Cicilan', icon: '📋' },
    ];

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <Link href="/" className="logo" style={{ justifyContent: 'flex-start' }}>
                        <span className="logo-icon">💎</span>
                        <span className="logo-text">Admin Panel</span>
                    </Link>
                </div>

                <nav className="admin-nav">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`admin-nav-link ${pathname === link.href ? 'active' : ''}`}
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-xl)' }}>
                    <Link href="/" className="admin-nav-link">
                        <span>🏠</span>
                        <span>Kembali ke Website</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="admin-mobile-header" style={{
                display: 'flex',
                padding: 'var(--spacing-md)',
                background: 'var(--gray-900)',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Link href="/" className="logo">
                    <span className="logo-icon">💎</span>
                    <span className="logo-text">Admin</span>
                </Link>
                <div style={{ display: 'flex', gap: 'var(--spacing-xs)', overflowX: 'auto' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`btn btn-sm ${pathname === link.href ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            {link.icon}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
