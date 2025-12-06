'use client';

import { goldProducts, sampleInstallments } from '../data/mock-data';
import { formatCurrency } from '../types';
import Link from 'next/link';

export default function AdminDashboard() {
    // Calculate stats
    const totalStock = goldProducts.reduce((sum, p) => sum + p.stock, 0);
    const outOfStock = goldProducts.filter(p => p.stock === 0).length;
    const activeInstallments = sampleInstallments.filter(i => i.status === 'active').length;
    const totalRevenue = sampleInstallments.reduce((sum, i) => sum + i.totalAmount, 0);

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-title">Dashboard Admin</h1>
                <p className="admin-subtitle">Selamat datang di panel admin Cicilan Emas</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <p className="stat-label">Total Stok</p>
                    <p className="stat-value">{totalStock} pcs</p>
                    <p className={`stat-change ${outOfStock > 0 ? 'negative' : 'positive'}`}>
                        {outOfStock > 0 ? `${outOfStock} produk habis` : 'Semua tersedia'}
                    </p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Cicilan Aktif</p>
                    <p className="stat-value">{activeInstallments}</p>
                    <p className="stat-change positive">Berjalan lancar</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Total Penjualan</p>
                    <p className="stat-value">{formatCurrency(totalRevenue)}</p>
                    <p className="stat-change positive">+15% dari bulan lalu</p>
                </div>
                <div className="stat-card">
                    <p className="stat-label">Produk</p>
                    <p className="stat-value">{goldProducts.length}</p>
                    <p className="stat-change positive">UBS & Antam</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-card" style={{ marginTop: 'var(--spacing-xl)' }}>
                <h2 className="admin-card-title">Aksi Cepat</h2>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                    <Link href="/admin/settings" className="btn btn-primary">
                        ⚙️ Pengaturan Margin
                    </Link>
                    <Link href="/admin/stok" className="btn btn-secondary">
                        📦 Update Stok
                    </Link>
                    <Link href="/admin/cicilan" className="btn btn-secondary">
                        📋 Lihat Cicilan
                    </Link>
                </div>
            </div>

            {/* Recent Products */}
            <div className="admin-card" style={{ marginTop: 'var(--spacing-lg)' }}>
                <h2 className="admin-card-title">Daftar Produk</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>Produk</th>
                                <th>Harga</th>
                                <th>Stok</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goldProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <strong>{product.brand} {product.weight}g</strong>
                                    </td>
                                    <td>{formatCurrency(product.totalPrice)}</td>
                                    <td>{product.stock} pcs</td>
                                    <td>
                                        <span className={`status-badge ${product.stock > 0 ? 'status-paid' : 'status-late'}`}>
                                            {product.stock > 0 ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
