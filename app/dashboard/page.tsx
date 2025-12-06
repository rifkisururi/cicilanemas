'use client';

import { useState } from 'react';
import Header from '../components/Header';
import InstallmentTable from '../components/InstallmentTable';
import { sampleInstallments } from '../data/mock-data';
import { defaultSettings } from '../data/mock-data';
import {
    formatCurrency,
    formatDate,
    generatePaymentSchedule,
    calculateInstallment
} from '../types';

export default function DashboardPage() {
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

    // Simulated data - in real app would come from API/database
    const customerInstallments = sampleInstallments.map(plan => {
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

        return { ...plan, paymentSchedule: updatedSchedule };
    });

    const selectedPlan = customerInstallments.find(p => p.id === selectedPlanId);

    const handlePayment = (installmentNumber: number) => {
        alert(`Pembayaran angsuran #${installmentNumber} berhasil!`);
    };

    return (
        <>
            <Header />

            <div className="page-container">
                <div className="page-header">
                    <div className="breadcrumb">
                        <a href="/">Beranda</a>
                        <span>/</span>
                        <span>Dashboard</span>
                    </div>
                    <h1 className="page-title">Dashboard Cicilan</h1>
                </div>

                {customerInstallments.length === 0 ? (
                    <div className="feature-card" style={{ textAlign: 'center' }}>
                        <div className="feature-icon">📋</div>
                        <h3 className="feature-title">Belum Ada Cicilan</h3>
                        <p className="feature-description">
                            Anda belum memiliki cicilan aktif. Mulai investasi emas sekarang!
                        </p>
                        <a href="/produk" className="btn btn-primary mt-lg">Lihat Produk</a>
                    </div>
                ) : (
                    <div className="dashboard-grid">
                        {/* Installment List */}
                        <div className="dashboard-card">
                            <h2 className="admin-card-title">Daftar Cicilan Saya</h2>

                            {customerInstallments.map((plan) => {
                                const paidCount = plan.paymentSchedule.filter(s => s.status === 'paid' || s.status === 'paid_late').length;
                                const progress = (paidCount / plan.tenor) * 100;

                                return (
                                    <div
                                        key={plan.id}
                                        className="schedule-card"
                                        style={{
                                            marginBottom: 'var(--spacing-md)',
                                            cursor: 'pointer',
                                            border: selectedPlanId === plan.id ? '2px solid var(--gold-500)' : undefined
                                        }}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                    >
                                        <div className="card-header">
                                            <span className="installment-number">
                                                {plan.product.brand} {plan.product.weight}g
                                            </span>
                                            <span className={`status-badge ${plan.status === 'active' ? 'status-pending' : 'status-paid'}`}>
                                                {plan.status === 'active' ? 'Aktif' : 'Selesai'}
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <div className="card-row">
                                                <span className="row-label">Total Cicilan:</span>
                                                <span className="row-value">{formatCurrency(plan.totalAmount)}</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="row-label">Per Bulan:</span>
                                                <span className="row-value">{formatCurrency(plan.monthlyInstallment)}</span>
                                            </div>
                                            <div className="card-row">
                                                <span className="row-label">Progress:</span>
                                                <span className="row-value">{paidCount}/{plan.tenor} bulan</span>
                                            </div>
                                            <div style={{
                                                marginTop: 'var(--spacing-sm)',
                                                background: 'var(--gray-200)',
                                                borderRadius: 'var(--radius-full)',
                                                height: '8px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${progress}%`,
                                                    background: 'var(--gold-500)',
                                                    height: '100%',
                                                    borderRadius: 'var(--radius-full)',
                                                    transition: 'width 0.3s'
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected Plan Detail */}
                        <div className="dashboard-card">
                            {selectedPlan ? (
                                <>
                                    <h2 className="admin-card-title">Detail Cicilan</h2>

                                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
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
                                        onPayment={handlePayment}
                                    />
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>👈</div>
                                    <p style={{ color: 'var(--gray-500)' }}>Pilih cicilan untuk melihat detail</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <footer className="footer">
                <p className="footer-text">© 2024 Cicilan Emas. Semua hak dilindungi.</p>
            </footer>
        </>
    );
}
