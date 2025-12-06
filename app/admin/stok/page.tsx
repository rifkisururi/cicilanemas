'use client';

import { useState } from 'react';
import { goldProducts as initialProducts } from '../../data/mock-data';
import { GoldProduct, formatCurrency } from '../../types';

export default function AdminStockPage() {
    const [products, setProducts] = useState<GoldProduct[]>(initialProducts);
    const [saved, setSaved] = useState(false);

    const handleStockChange = (productId: string, newStock: number) => {
        setProducts(prev =>
            prev.map(p =>
                p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p
            )
        );
        setSaved(false);
    };

    const handleSave = () => {
        // In real app, this would save to database
        console.log('Saving stock:', products);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const ubsProducts = products.filter(p => p.brand === 'UBS');
    const antamProducts = products.filter(p => p.brand === 'ANTAM');

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-title">Manajemen Stok</h1>
                <p className="admin-subtitle">Kelola ketersediaan stok emas</p>
            </div>

            {/* UBS Stock */}
            <div className="admin-card">
                <h2 className="admin-card-title">Stok Emas UBS</h2>
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
                            {ubsProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <strong>UBS {product.weight}g</strong>
                                    </td>
                                    <td>{formatCurrency(product.totalPrice)}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="stock-input"
                                            value={product.stock}
                                            onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </td>
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

            {/* Antam Stock */}
            <div className="admin-card">
                <h2 className="admin-card-title">Stok Emas Antam</h2>
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
                            {antamProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <strong>Antam {product.weight}g</strong>
                                    </td>
                                    <td>{formatCurrency(product.totalPrice)}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="stock-input"
                                            value={product.stock}
                                            onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </td>
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

            {/* Save Button */}
            <div style={{ position: 'sticky', bottom: 'var(--spacing-lg)', background: 'white', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    <p style={{ color: 'var(--gray-600)' }}>
                        Total Stok: <strong>{products.reduce((sum, p) => sum + p.stock, 0)} pcs</strong>
                    </p>
                    <div>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSave}
                        >
                            💾 Simpan Perubahan
                        </button>
                        {saved && (
                            <span style={{
                                marginLeft: 'var(--spacing-md)',
                                color: 'var(--success)',
                                fontWeight: '500'
                            }}>
                                ✓ Stok tersimpan!
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
