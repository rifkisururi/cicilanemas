'use client';

import { useState } from 'react';
import { sampleInstallments, defaultSettings } from '../../data/mock-data';
import InstallmentTable from '../../components/InstallmentTable';
import {
    formatCurrency,
    formatDate,
    generatePaymentSchedule,
    calculateInstallment
} from '../../types';

export default function AdminCicilanPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Generate full data with payment schedules
    const installments = sampleInstallments.map(plan => {
        const calculation = calculateInstallment(plan.goldPrice, defaultSettings, plan.tenor);
        const schedule = generatePaymentSchedule(calculation.totalAmount, plan.tenor, plan.startDate);

        // Simulate some payments
        const updatedSchedule = schedule.map((item, index) => {
            if (index < 2) {
                return { ...item, status: 'paid' as const };
            }
            if (index === 2) {
                return {
                    ...item,
                    status: 'late' as const,
                    penaltyAmount: item.principalAmount * defaultSettings.latePenaltyPercent,
                    totalAmount: item.principalAmount * (1 + defaultSettings.latePenaltyPercent)
                };
            }
            return item;
        });

        return {
            ...plan,
            paymentSchedule: updatedSchedule,
            marginAmount: calculation.marginAmount,
            adminFeeAmount: calculation.adminFeeAmount,
            totalAmount: calculation.totalAmount,
            monthlyInstallment: calculation.monthlyInstallment
        };
    });

    const selectedPlan = installments.find(p => p.id === selectedId);

    const handlePaymentConfirm = (installmentNumber: number) => {
        alert(`Pembayaran angsuran #${installmentNumber} telah dikonfirmasi!`);
    };

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-title">Daftar Cicilan</h1>
                <p className="admin-subtitle">Kelola cicilan pelanggan</p>
            </div>

            <div className="dashboard-grid">
                {/* Installment List */}
                <div className="admin-card">
                    <h2 className="admin-card-title">Semua Cicilan</h2>

                    {installments.length === 0 ? (
                        <p style={{ color: 'var(--gray-500)', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                            Belum ada cicilan terdaftar
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {installments.map((plan) => {
                                const paidCount = plan.paymentSchedule.filter(
                                    s => s.status === 'paid' || s.status === 'paid_late'
                                ).length;
                                const lateCount = plan.paymentSchedule.filter(s => s.status === 'late').length;

                                return (
                                    <div
                                        key={plan.id}
                                        className="schedule-card"
                                        style={{
                                            cursor: 'pointer',
                                            border: selectedId === plan.id ? '2px solid var(--gold-500)' : undefined
                                        }}
                                        onClick={() => setSelectedId(plan.id)}
                                    >
                                        <div className="card-header">
                                            <div>
                                                <strong>{plan.customerName}</strong>
                                                <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginLeft: 'var(--spacing-sm)' }}>
                                                    {plan.customerPhone}
                                                </span>
                                            </div>
                                            <span className={`status-badge ${plan.status === 'active' ? 'status-pending' : 'status-paid'}`}>
                                                {plan.status === 'active' ? 'Aktif' : 'Selesai'}
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <div className="card-row">
                                                <span className="row-label">Produk:</span>
                                                <span className="row-value">{plan.product.brand} {plan.product.weight}g</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="row-label">Total:</span>
                                                <span className="row-value">{formatCurrency(plan.totalAmount)}</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="row-label">Progress:</span>
                                                <span className="row-value">
                                                    {paidCount}/{plan.tenor} bulan
                                                    {lateCount > 0 && (
                                                        <span style={{ color: 'var(--danger)', marginLeft: 'var(--spacing-sm)' }}>
                                                            ({lateCount} terlambat)
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Selected Detail */}
                <div className="admin-card">
                    {selectedPlan ? (
                        <>
                            <h2 className="admin-card-title">Detail Cicilan</h2>

                            <div style={{ marginBottom: 'var(--spacing-lg)', background: 'var(--gray-50)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                                <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--gray-800)' }}>
                                    Informasi Pelanggan
                                </h3>
                                <div className="calc-row">
                                    <span className="calc-label">Nama:</span>
                                    <span className="calc-value">{selectedPlan.customerName}</span>
                                </div>
                                <div className="calc-row">
                                    <span className="calc-label">Telepon:</span>
                                    <span className="calc-value">{selectedPlan.customerPhone}</span>
                                </div>
                                <div className="calc-row">
                                    <span className="calc-label">Alamat:</span>
                                    <span className="calc-value">{selectedPlan.customerAddress}</span>
                                </div>
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--gray-800)' }}>
                                    Detail Cicilan
                                </h3>
                                <div className="calc-row">
                                    <span className="calc-label">Produk:</span>
                                    <span className="calc-value">{selectedPlan.product.brand} {selectedPlan.product.weight}g</span>
                                </div>
                                <div className="calc-row">
                                    <span className="calc-label">Harga Emas:</span>
                                    <span className="calc-value">{formatCurrency(selectedPlan.goldPrice)}</span>
                                </div>
                                <div className="calc-row">
                                    <span className="calc-label">Margin:</span>
                                    <span className="calc-value">{formatCurrency(selectedPlan.marginAmount)}</span>
                                </div>
                                <div className="calc-row">
                                    <span className="calc-label">Biaya Admin:</span>
                                    <span className="calc-value">{formatCurrency(selectedPlan.adminFeeAmount)}</span>
                                </div>
                                <div className="calc-row total">
                                    <span className="calc-label">Total:</span>
                                    <span className="calc-value">{formatCurrency(selectedPlan.totalAmount)}</span>
                                </div>
                                <div className="calc-row">
                                    <span className="calc-label">Tenor:</span>
                                    <span className="calc-value">{selectedPlan.tenor} bulan</span>
                                </div>
                                <div className="calc-row">
                                    <span className="calc-label">Mulai:</span>
                                    <span className="calc-value">{formatDate(selectedPlan.startDate)}</span>
                                </div>
                            </div>

                            <InstallmentTable
                                schedule={selectedPlan.paymentSchedule}
                                showActions={true}
                                onPayment={handlePaymentConfirm}
                            />
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>📋</div>
                            <p style={{ color: 'var(--gray-500)' }}>Pilih cicilan untuk melihat detail</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
