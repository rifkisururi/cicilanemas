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

    const calculation = calculateInstallment(
        product.totalPrice,
        settings,
        selectedTenor,
        downPaymentPercent
    );

    const handleTenorChange = (tenor: TenorMonths) => {
        setSelectedTenor(tenor);
        onTenorChange?.(tenor);
    };

    const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) / 100;
        const clampedValue = Math.max(
            settings.minDownPaymentPercent,
            Math.min(settings.maxDownPaymentPercent, value)
        );
        setDownPaymentPercent(clampedValue);
        onDownPaymentChange?.(clampedValue);
    };

    return (
        <div className="installment-calculator">
            <h3 className="calculator-title">Kalkulator Cicilan</h3>

            {/* Down Payment Section */}
            <div className="tenor-section" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label className="section-label">
                    Uang Muka (DP): {(downPaymentPercent * 100).toFixed(0)}%
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        {(settings.minDownPaymentPercent * 100).toFixed(0)}%
                    </span>
                    <input
                        type="range"
                        min={settings.minDownPaymentPercent * 100}
                        max={settings.maxDownPaymentPercent * 100}
                        step="5"
                        value={downPaymentPercent * 100}
                        onChange={handleDownPaymentChange}
                        style={{
                            flex: 1,
                            height: '8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            accentColor: 'var(--gold-500)',
                        }}
                    />
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                        {(settings.maxDownPaymentPercent * 100).toFixed(0)}%
                    </span>
                </div>
                <p className="setting-hint" style={{ marginTop: 'var(--spacing-sm)' }}>
                    Uang muka: <strong>{formatCurrency(calculation.downPaymentAmount)}</strong>
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
                <div className="calc-row">
                    <span className="calc-label">Harga Emas</span>
                    <span className="calc-value">{formatCurrency(product.totalPrice)}</span>
                </div>
                <div className="calc-row">
                    <span className="calc-label">
                        Uang Muka ({(downPaymentPercent * 100).toFixed(0)}%)
                    </span>
                    <span className="calc-value" style={{ color: 'var(--success)' }}>
                        - {formatCurrency(calculation.downPaymentAmount)}
                    </span>
                </div>
                <div className="calc-row" style={{ background: 'var(--gold-50)', margin: '0 calc(-1 * var(--spacing-lg))', padding: 'var(--spacing-sm) var(--spacing-lg)', fontWeight: '600' }}>
                    <span className="calc-label">Jumlah Pembiayaan</span>
                    <span className="calc-value">{formatCurrency(calculation.financingAmount)}</span>
                </div>
                <div className="calc-row">
                    <span className="calc-label">
                        Margin ({(settings.marginPercent * 100).toFixed(0)}%/thn × {calculation.yearsCount.toFixed(1)} thn)
                    </span>
                    <span className="calc-value highlight">
                        + {formatCurrency(calculation.marginAmount)}
                    </span>
                </div>
                <div className="calc-row">
                    <span className="calc-label">
                        Biaya Admin ({(settings.adminFeePercent * 100).toFixed(0)}%)
                    </span>
                    <span className="calc-value highlight">
                        + {formatCurrency(calculation.adminFeeAmount)}
                    </span>
                </div>
                <div className="calc-row total">
                    <span className="calc-label">Total Cicilan</span>
                    <span className="calc-value">{formatCurrency(calculation.amountToFinance)}</span>
                </div>
            </div>

            {/* Monthly Payment */}
            <div className="monthly-payment">
                <span className="monthly-label">Cicilan per bulan:</span>
                <span className="monthly-amount">
                    {formatCurrency(calculation.monthlyInstallment)}
                </span>
                <span className="monthly-tenor">x {selectedTenor} bulan</span>
            </div>

            {/* Info */}
            <div className="calculator-info">
                <p className="info-text">
                    💰 Bayar DP: <strong>{formatCurrency(calculation.downPaymentAmount)}</strong> saat pengajuan
                </p>
                <p className="info-text" style={{ marginTop: 'var(--spacing-xs)' }}>
                    ⚠️ Denda keterlambatan: {(settings.latePenaltyPercent * 100).toFixed(0)}% per angsuran
                </p>
            </div>
        </div>
    );
}
