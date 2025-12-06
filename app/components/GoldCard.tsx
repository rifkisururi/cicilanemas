'use client';

import { GoldProduct, formatCurrency } from '../types';
import Link from 'next/link';

interface GoldCardProps {
    product: GoldProduct;
}

export default function GoldCard({ product }: GoldCardProps) {
    const isAvailable = product.stock > 0;

    return (
        <div className={`gold-card ${!isAvailable ? 'out-of-stock' : ''}`}>
            {/* Badge */}
            <div className="card-badge">
                <span className={`brand-badge ${product.brand.toLowerCase()}`}>
                    {product.brand}
                </span>
                {!isAvailable && <span className="stock-badge">Stok Habis</span>}
            </div>

            {/* Gold Icon/Image */}
            <div className="card-image">
                <div className="gold-icon">
                    <span className="gold-bar">🪙</span>
                    <span className="weight-label">{product.weight}g</span>
                </div>
            </div>

            {/* Info */}
            <div className="card-info">
                <h3 className="card-title">
                    Emas {product.brand} {product.weight} Gram
                </h3>
                <p className="card-price">{formatCurrency(product.totalPrice)}</p>
                <p className="card-price-per-gram">
                    {formatCurrency(product.pricePerGram)}/gram
                </p>
                <p className={`card-stock ${isAvailable ? 'available' : 'empty'}`}>
                    {isAvailable ? `Stok: ${product.stock} pcs` : 'Tidak tersedia'}
                </p>
            </div>

            {/* Actions */}
            <div className="card-actions">
                <Link
                    href={isAvailable ? `/produk/${product.id}` : '#'}
                    className={`btn btn-primary ${!isAvailable ? 'disabled' : ''}`}
                    onClick={(e) => !isAvailable && e.preventDefault()}
                >
                    {isAvailable ? 'Lihat Detail' : 'Stok Habis'}
                </Link>
            </div>
        </div>
    );
}
