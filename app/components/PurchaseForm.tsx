'use client';

import { useState } from 'react';
import { GoldProduct, TenorMonths, AVAILABLE_TENORS } from '../types';

interface PurchaseFormProps {
    product: GoldProduct;
    onSubmit: (data: PurchaseFormData) => void;
    mode: 'cash' | 'installment';
}

export interface PurchaseFormData {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    tenor?: TenorMonths;
    mode: 'cash' | 'installment';
}

export default function PurchaseForm({ product, onSubmit, mode }: PurchaseFormProps) {
    const [formData, setFormData] = useState<PurchaseFormData>({
        customerName: '',
        customerPhone: '',
        customerAddress: '',
        tenor: 12,
        mode: mode,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Nama lengkap harus diisi';
        }
        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = 'Nomor telepon harus diisi';
        } else if (!/^[0-9]{10,13}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
            newErrors.customerPhone = 'Nomor telepon tidak valid';
        }
        if (!formData.customerAddress.trim()) {
            newErrors.customerAddress = 'Alamat harus diisi';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <form className="purchase-form" onSubmit={handleSubmit}>
            <h3 className="form-title">
                {mode === 'cash' ? 'Form Pembelian Cash' : 'Form Pengajuan Cicilan'}
            </h3>

            <div className="form-group">
                <label htmlFor="customerName" className="form-label">
                    Nama Lengkap <span className="required">*</span>
                </label>
                <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    className={`form-input ${errors.customerName ? 'error' : ''}`}
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                />
                {errors.customerName && (
                    <span className="error-message">{errors.customerName}</span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="customerPhone" className="form-label">
                    Nomor Telepon <span className="required">*</span>
                </label>
                <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    className={`form-input ${errors.customerPhone ? 'error' : ''}`}
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                />
                {errors.customerPhone && (
                    <span className="error-message">{errors.customerPhone}</span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="customerAddress" className="form-label">
                    Alamat Lengkap <span className="required">*</span>
                </label>
                <textarea
                    id="customerAddress"
                    name="customerAddress"
                    className={`form-input form-textarea ${errors.customerAddress ? 'error' : ''}`}
                    value={formData.customerAddress}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap"
                    rows={3}
                />
                {errors.customerAddress && (
                    <span className="error-message">{errors.customerAddress}</span>
                )}
            </div>

            {mode === 'installment' && (
                <div className="form-group">
                    <label htmlFor="tenor" className="form-label">
                        Tenor Cicilan <span className="required">*</span>
                    </label>
                    <select
                        id="tenor"
                        name="tenor"
                        className="form-input form-select"
                        value={formData.tenor}
                        onChange={handleChange}
                    >
                        {AVAILABLE_TENORS.map((tenor) => (
                            <option key={tenor} value={tenor}>
                                {tenor} bulan
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg btn-block">
                {mode === 'cash' ? 'Beli Sekarang' : 'Ajukan Cicilan'}
            </button>
        </form>
    );
}
