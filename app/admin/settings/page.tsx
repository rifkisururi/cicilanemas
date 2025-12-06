'use client';

import { useState } from 'react';
import { defaultSettings } from '../../data/mock-data';

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        marginPercent: defaultSettings.marginPercent * 100,
        adminFeePercent: defaultSettings.adminFeePercent * 100,
        latePenaltyPercent: defaultSettings.latePenaltyPercent * 100,
    });
    const [saved, setSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
        setSaved(false);
    };

    const handleSave = () => {
        // In real app, this would save to database
        console.log('Saving settings:', {
            marginPercent: settings.marginPercent / 100,
            adminFeePercent: settings.adminFeePercent / 100,
            latePenaltyPercent: settings.latePenaltyPercent / 100,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <>
            <div className="admin-header">
                <h1 className="admin-title">Pengaturan Cicilan</h1>
                <p className="admin-subtitle">Atur margin, biaya admin, dan denda keterlambatan</p>
            </div>

            <div className="admin-card">
                <h2 className="admin-card-title">Pengaturan Biaya</h2>

                <div className="settings-form">
                    <div className="setting-group">
                        <label className="setting-label" htmlFor="marginPercent">
                            Margin Keuntungan (%)
                        </label>
                        <input
                            type="number"
                            id="marginPercent"
                            name="marginPercent"
                            className="setting-input"
                            value={settings.marginPercent}
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            max="100"
                        />
                        <p className="setting-hint">
                            Keuntungan toko dari setiap cicilan. Contoh: 5 = 5%
                        </p>
                    </div>

                    <div className="setting-group">
                        <label className="setting-label" htmlFor="adminFeePercent">
                            Biaya Admin (%)
                        </label>
                        <input
                            type="number"
                            id="adminFeePercent"
                            name="adminFeePercent"
                            className="setting-input"
                            value={settings.adminFeePercent}
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            max="100"
                        />
                        <p className="setting-hint">
                            Biaya pembuatan cicilan. Contoh: 2 = 2%
                        </p>
                    </div>

                    <div className="setting-group">
                        <label className="setting-label" htmlFor="latePenaltyPercent">
                            Denda Keterlambatan (%)
                        </label>
                        <input
                            type="number"
                            id="latePenaltyPercent"
                            name="latePenaltyPercent"
                            className="setting-input"
                            value={settings.latePenaltyPercent}
                            onChange={handleChange}
                            step="0.1"
                            min="0"
                            max="100"
                        />
                        <p className="setting-hint">
                            Denda per angsuran yang terlambat. Contoh: 1 = 1%
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: 'var(--spacing-xl)' }}>
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleSave}
                    >
                        💾 Simpan Pengaturan
                    </button>

                    {saved && (
                        <span style={{
                            marginLeft: 'var(--spacing-md)',
                            color: 'var(--success)',
                            fontWeight: '500'
                        }}>
                            ✓ Pengaturan tersimpan!
                        </span>
                    )}
                </div>
            </div>

            {/* Preview */}
            <div className="admin-card">
                <h2 className="admin-card-title">Preview Perhitungan</h2>
                <p className="admin-subtitle" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    Contoh: Emas seharga Rp 1.000.000 dengan tenor 12 bulan
                </p>

                <div style={{ background: 'var(--gray-50)', padding: 'var(--spacing-lg)', borderRadius: 'var(--radius-lg)' }}>
                    <div className="calc-row">
                        <span className="calc-label">Harga Emas</span>
                        <span className="calc-value">Rp 1.000.000</span>
                    </div>
                    <div className="calc-row">
                        <span className="calc-label">Margin ({settings.marginPercent}%)</span>
                        <span className="calc-value" style={{ color: 'var(--gold-600)' }}>
                            + Rp {(1000000 * settings.marginPercent / 100).toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div className="calc-row">
                        <span className="calc-label">Biaya Admin ({settings.adminFeePercent}%)</span>
                        <span className="calc-value" style={{ color: 'var(--gold-600)' }}>
                            + Rp {(1000000 * settings.adminFeePercent / 100).toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div className="calc-row total">
                        <span className="calc-label">Total Bayar</span>
                        <span className="calc-value">
                            Rp {(1000000 * (1 + settings.marginPercent / 100 + settings.adminFeePercent / 100)).toLocaleString('id-ID')}
                        </span>
                    </div>
                    <div className="calc-row">
                        <span className="calc-label">Cicilan/Bulan (12x)</span>
                        <span className="calc-value" style={{ fontWeight: '700', color: 'var(--gold-600)' }}>
                            Rp {Math.round(1000000 * (1 + settings.marginPercent / 100 + settings.adminFeePercent / 100) / 12).toLocaleString('id-ID')}
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}
