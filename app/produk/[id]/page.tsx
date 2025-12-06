'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import InstallmentCalculator from '../../components/InstallmentCalculator';
import InstallmentTable from '../../components/InstallmentTable';
import PurchaseForm, { PurchaseFormData } from '../../components/PurchaseForm';
import { getProductById, defaultSettings } from '../../data/mock-data';
import {
    formatCurrency,
    calculateInstallment,
    generatePaymentSchedule,
    TenorMonths,
    DEFAULT_DOWN_PAYMENT_PERCENT
} from '../../types';

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params.id as string;
    const product = getProductById(productId);

    const [mode, setMode] = useState<'cash' | 'installment'>('installment');
    const [selectedTenor, setSelectedTenor] = useState<TenorMonths>(12);
    const [downPaymentPercent, setDownPaymentPercent] = useState(DEFAULT_DOWN_PAYMENT_PERCENT);
    const [showResult, setShowResult] = useState(false);
    const [formData, setFormData] = useState<PurchaseFormData | null>(null);

    if (!product) {
        return (
            <>
                <Header />
                <div className="page-container">
                    <div className="feature-card" style={{ textAlign: 'center', marginTop: 'var(--spacing-2xl)' }}>
                        <div className="feature-icon">❌</div>
                        <h3 className="feature-title">Produk Tidak Ditemukan</h3>
                        <p className="feature-description">Produk yang Anda cari tidak tersedia.</p>
                        <a href="/produk" className="btn btn-primary mt-lg">Kembali ke Produk</a>
                    </div>
                </div>
            </>
        );
    }

    const isAvailable = product.stock > 0;
    const calculation = calculateInstallment(product.totalPrice, defaultSettings, selectedTenor, downPaymentPercent);
    const schedule = generatePaymentSchedule(calculation.amountToFinance, selectedTenor, new Date());

    const handleSubmit = (data: PurchaseFormData) => {
        setFormData(data);
        setShowResult(true);
    };

    if (showResult && formData) {
        return (
            <>
                <Header />
                <div className="page-container">
                    <div className="modal-overlay" style={{ position: 'relative', background: 'transparent', minHeight: '80vh' }}>
                        <div className="modal" style={{ maxWidth: '600px' }}>
                            <div className="modal-icon">✅</div>
                            <h2 className="modal-title">
                                {mode === 'cash' ? 'Pembelian Berhasil!' : 'Pengajuan Cicilan Berhasil!'}
                            </h2>
                            <p className="modal-message">
                                Terima kasih, {formData.customerName}.
                                {mode === 'cash'
                                    ? ` Pembelian emas ${product.brand} ${product.weight}g senilai ${formatCurrency(product.totalPrice)} telah kami terima.`
                                    : ` Pengajuan cicilan emas ${product.brand} ${product.weight}g dengan tenor ${selectedTenor} bulan telah kami terima. Uang muka: ${formatCurrency(calculation.downPaymentAmount)}`
                                }
                            </p>

                            {mode === 'installment' && (
                                <div style={{ textAlign: 'left', marginBottom: 'var(--spacing-lg)' }}>
                                    <InstallmentTable schedule={schedule} />
                                </div>
                            )}

                            <div className="flex gap-md" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                                <a href="/dashboard" className="btn btn-primary">Lihat Dashboard</a>
                                <a href="/produk" className="btn btn-secondary">Belanja Lagi</a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="page-container">
                <div className="page-header">
                    <div className="breadcrumb">
                        <a href="/">Beranda</a>
                        <span>/</span>
                        <a href="/produk">Produk</a>
                        <span>/</span>
                        <span>{product.brand} {product.weight}g</span>
                    </div>
                </div>

                <div className="product-detail-grid">
                    {/* Product Image */}
                    <div className="product-image-section">
                        <span className={`brand-badge ${product.brand.toLowerCase()}`} style={{ fontSize: '1rem', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
                            {product.brand}
                        </span>
                        <div className="product-icon-large">🪙</div>
                        <div className="weight-label" style={{ fontSize: '1.25rem', padding: 'var(--spacing-sm) var(--spacing-lg)' }}>
                            {product.weight} gram
                        </div>
                        <p style={{ color: 'var(--gold-700)', fontWeight: '600' }}>
                            {formatCurrency(product.pricePerGram)}/gram
                        </p>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        <div>
                            <h1 className="page-title" style={{ fontSize: '1.75rem' }}>
                                Emas {product.brand} {product.weight} Gram
                            </h1>
                            <p className="card-price" style={{ fontSize: '2rem', marginTop: 'var(--spacing-sm)' }}>
                                {formatCurrency(product.totalPrice)}
                            </p>
                            <p className={`card-stock ${isAvailable ? 'available' : 'empty'}`} style={{ marginTop: 'var(--spacing-sm)' }}>
                                {isAvailable ? `Stok tersedia: ${product.stock} pcs` : 'Stok habis'}
                            </p>
                        </div>

                        {/* Mode Tabs */}
                        {isAvailable && (
                            <>
                                <div className="tabs">
                                    <button
                                        className={`tab ${mode === 'installment' ? 'active' : ''}`}
                                        onClick={() => setMode('installment')}
                                    >
                                        💳 Cicilan
                                    </button>
                                    <button
                                        className={`tab ${mode === 'cash' ? 'active' : ''}`}
                                        onClick={() => setMode('cash')}
                                    >
                                        💵 Cash
                                    </button>
                                </div>

                                {mode === 'installment' && (
                                    <InstallmentCalculator
                                        product={product}
                                        settings={defaultSettings}
                                        onTenorChange={setSelectedTenor}
                                        onDownPaymentChange={setDownPaymentPercent}
                                    />
                                )}

                                {mode === 'cash' && (
                                    <div className="installment-calculator">
                                        <h3 className="calculator-title">Pembelian Cash</h3>
                                        <div className="monthly-payment">
                                            <span className="monthly-label">Total Pembayaran:</span>
                                            <span className="monthly-amount">{formatCurrency(product.totalPrice)}</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Purchase Form */}
                {isAvailable && (
                    <div style={{ marginTop: 'var(--spacing-2xl)', maxWidth: '600px' }}>
                        <PurchaseForm
                            product={product}
                            mode={mode}
                            onSubmit={handleSubmit}
                        />
                    </div>
                )}

                {!isAvailable && (
                    <div className="feature-card" style={{ textAlign: 'center', marginTop: 'var(--spacing-2xl)' }}>
                        <div className="feature-icon">😔</div>
                        <h3 className="feature-title">Stok Habis</h3>
                        <p className="feature-description">
                            Maaf, produk ini sedang tidak tersedia. Silakan pilih produk lain.
                        </p>
                        <a href="/produk" className="btn btn-primary mt-lg">Lihat Produk Lain</a>
                    </div>
                )}
            </div>

            <footer className="footer">
                <p className="footer-text">© 2024 Cicilan Emas. Semua hak dilindungi.</p>
            </footer>
        </>
    );
}
