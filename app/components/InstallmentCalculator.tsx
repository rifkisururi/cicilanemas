'use client';

import { useState } from 'react';
import {
    GoldProduct,
    InstallmentSettings,
    TenorMonths,
    AVAILABLE_TENORS,
    DEFAULT_DOWN_PAYMENT_PERCENT,
    calculateInstallment,
    formatCurrency
} from '../types';

interface InstallmentCalculatorProps {
    product: GoldProduct;
    settings: InstallmentSettings;
    onTenorChange?: (tenor: TenorMonths) => void;
    onDownPaymentChange?: (percent: number) => void;
}

export default function InstallmentCalculator({
    product,
    settings,
    onTenorChange,
    onDownPaymentChange
}: InstallmentCalculatorProps) {
    const [selectedTenor, setSelectedTenor] = useState<TenorMonths>(12);
    const [downPaymentPercent, setDownPaymentPercent] = useState(DEFAULT_DOWN_PAYMENT_PERCENT);
    const [dpInputMode, setDpInputMode] = useState<'percent' | 'rupiah'>('rupiah');

    const calculation = calculateInstallment(
        product.totalPrice,
        settings,
        selectedTenor,
        downPaymentPercent
    );

    // Harga perolehan = harga emas + margin
    const hargaPerolehan = product.totalPrice + calculation.marginAmount;

    // Jumlah pembiayaan = harga perolehan - uang muka
    const jumlahPembiayaan = hargaPerolehan - calculation.downPaymentAmount;

    // Bayar saat pengajuan = DP + Admin Fee
    const bayarSaatPengajuan = calculation.downPaymentAmount + calculation.adminFeeAmount;

    const handleTenorChange = (tenor: TenorMonths) => {
        setSelectedTenor(tenor);
        onTenorChange?.(tenor);
    };

    const handleDpPercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) / 100;
        const clampedValue = Math.max(
            settings.minDownPaymentPercent,
            Math.min(settings.maxDownPaymentPercent, value)
        );
        setDownPaymentPercent(clampedValue);
        onDownPaymentChange?.(clampedValue);
    };

    const handleDpRupiahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rupiahValue = parseFloat(e.target.value.replace(/[^0-9]/g, '')) || 0;
        const percentValue = rupiahValue / product.totalPrice;
        const clampedValue = Math.max(
            settings.minDownPaymentPercent,
            Math.min(settings.maxDownPaymentPercent, percentValue)
        );
        setDownPaymentPercent(clampedValue);
        onDownPaymentChange?.(clampedValue);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) / 100;
        const clampedValue = Math.max(
            settings.minDownPaymentPercent,
            Math.min(settings.maxDownPaymentPercent, value)
        );
        setDownPaymentPercent(clampedValue);
        onDownPaymentChange?.(clampedValue);
    };

    const minDpAmount = product.totalPrice * settings.minDownPaymentPercent;
    const maxDpAmount = product.totalPrice * settings.maxDownPaymentPercent;

    return (
        <div className="installment-calculator">
            <h3 className="calculator-title">Kalkulator Cicilan</h3>

            {/* Down Payment Section */}
            <div className="tenor-section" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label className="section-label">Uang Muka (DP)</label>

                {/* Toggle input mode */}
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                    <button
                        type="button"
                        className={`tenor-btn ${dpInputMode === 'rupiah' ? 'active' : ''}`}
                        onClick={() => setDpInputMode('rupiah')}
                        style={{ fontSize: '0.875rem', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                    >
                        Rupiah (Rp)
                    </button>
                    <button
                        type="button"
                        className={`tenor-btn ${dpInputMode === 'percent' ? 'active' : ''}`}
                        onClick={() => setDpInputMode('percent')}
                        style={{ fontSize: '0.875rem', padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                    >
                        Persen (%)
                    </button>
                </div>

                {dpInputMode === 'percent' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <input
                            type="number"
                            min={settings.minDownPaymentPercent * 100}
                            max={settings.maxDownPaymentPercent * 100}
                            value={(downPaymentPercent * 100).toFixed(0)}
                            onChange={handleDpPercentChange}
                            style={{
                                width: '80px',
                                padding: 'var(--spacing-sm)',
                                border: '1px solid var(--gray-300)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'center',
                                fontSize: '1rem',
                            }}
                        />
                        <span style={{ fontWeight: '500' }}>%</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                            = {formatCurrency(calculation.downPaymentAmount)}
                        </span>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <span style={{ fontWeight: '500' }}>Rp</span>
                        <input
                            type="text"
                            value={Math.round(calculation.downPaymentAmount).toLocaleString('id-ID')}
                            onChange={handleDpRupiahChange}
                            style={{
                                width: '150px',
                                padding: 'var(--spacing-sm)',
                                border: '1px solid var(--gray-300)',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'right',
                                fontSize: '1rem',
                            }}
                        />
                        <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                            = {(downPaymentPercent * 100).toFixed(0)}%
                        </span>
                    </div>
                )}

                {/* Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {(settings.minDownPaymentPercent * 100).toFixed(0)}%
                    </span>
                    <input
                        type="range"
                        min={settings.minDownPaymentPercent * 100}
                        max={settings.maxDownPaymentPercent * 100}
                        step="1"
                        value={downPaymentPercent * 100}
                        onChange={handleSliderChange}
                        style={{
                            flex: 1,
                            height: '8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            accentColor: 'var(--gold-500)',
                        }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {(settings.maxDownPaymentPercent * 100).toFixed(0)}%
                    </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 'var(--spacing-xs)' }}>
                    Min: {formatCurrency(minDpAmount)} | Max: {formatCurrency(maxDpAmount)}
                </p>
            </div>

            {/* Tenor Selection */}
            <div className="tenor-section">
                <label className="section-label">Pilih Tenor Cicilan:</label>
                <div className="tenor-options">
                    {AVAILABLE_TENORS.map((tenor) => (
                        <button
                            key={tenor}
                            className={`tenor-btn ${selectedTenor === tenor ? 'active' : ''}`}
                            onClick={() => handleTenorChange(tenor)}
                        >
                            {tenor} bulan
                        </button>
                    ))}
                </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="calculation-breakdown">
                <div className="calc-row" style={{ background: 'var(--calculator-info-bg)', margin: '0 calc(-1 * var(--spacing-lg))', padding: 'var(--spacing-sm) var(--spacing-lg)', fontWeight: '600' }}>
                    <span className="calc-label" style={{ color: 'var(--text-primary)' }}>Harga Perolehan Emas</span>
                    <span className="calc-value" style={{ color: 'var(--text-gold)' }}>{formatCurrency(hargaPerolehan)}</span>
                </div>
                <div className="calc-row">
                    <span className="calc-label">
                        Uang Muka ({(downPaymentPercent * 100).toFixed(0)}%)
                    </span>
                    <span className="calc-value" style={{ color: 'var(--success)' }}>
                        - {formatCurrency(calculation.downPaymentAmount)}
                    </span>
                </div>
                <div className="calc-row total">
                    <span className="calc-label">Total Cicilan</span>
                    <span className="calc-value">{formatCurrency(jumlahPembiayaan)}</span>
                </div>
            </div>

            {/* Monthly Payment */}
            <div className="monthly-payment">
                <span className="monthly-label">Cicilan per bulan:</span>
                <span className="monthly-amount">
                    {formatCurrency(jumlahPembiayaan / selectedTenor)}
                </span>
                <span className="monthly-tenor">x {selectedTenor} bulan</span>
            </div>

            {/* Bayar Saat Pengajuan */}
            <div style={{
                marginTop: 'var(--spacing-lg)',
                padding: 'var(--spacing-lg)',
                background: 'var(--calculator-info-bg)',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--calculator-info-border)'
            }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-sm)' }}>
                    💳 Dibayar saat pengajuan:
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Uang Muka</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{formatCurrency(calculation.downPaymentAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Biaya Admin</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{formatCurrency(calculation.adminFeeAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid var(--calculator-info-border)' }}>
                    <span style={{ fontWeight: '700', color: 'var(--text-gold)' }}>TOTAL BAYAR</span>
                    <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--text-gold)' }}>
                        {formatCurrency(bayarSaatPengajuan)}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="calculator-info">
                <p className="info-text" style={{ marginTop: 'var(--spacing-xs)' }}>
                    ⚠️ Denda keterlambatan: {(settings.latePenaltyPercent * 100).toFixed(0)}% per angsuran
                </p>
            </div>
        </div>
    );
}
