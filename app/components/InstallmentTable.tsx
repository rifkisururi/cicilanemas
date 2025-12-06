'use client';

import { PaymentSchedule, formatCurrency, formatDate } from '../types';

interface InstallmentTableProps {
    schedule: PaymentSchedule[];
    showActions?: boolean;
    onPayment?: (installmentNumber: number) => void;
}

export default function InstallmentTable({
    schedule,
    showActions = false,
    onPayment
}: InstallmentTableProps) {
    const getStatusBadge = (status: PaymentSchedule['status']) => {
        const statusMap = {
            pending: { text: 'Belum Bayar', class: 'status-pending' },
            paid: { text: 'Lunas', class: 'status-paid' },
            late: { text: 'Terlambat', class: 'status-late' },
            paid_late: { text: 'Lunas (Terlambat)', class: 'status-paid-late' },
        };
        return statusMap[status];
    };

    return (
        <div className="installment-table-container">
            <h3 className="table-title">Jadwal Angsuran</h3>

            {/* Mobile Cards View */}
            <div className="schedule-cards">
                {schedule.map((item) => {
                    const statusInfo = getStatusBadge(item.status);
                    return (
                        <div key={item.installmentNumber} className={`schedule-card ${item.status}`}>
                            <div className="card-header">
                                <span className="installment-number">Angsuran #{item.installmentNumber}</span>
                                <span className={`status-badge ${statusInfo.class}`}>
                                    {statusInfo.text}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="card-row">
                                    <span className="row-label">Jatuh Tempo:</span>
                                    <span className="row-value">{formatDate(item.dueDate)}</span>
                                </div>
                                <div className="card-row">
                                    <span className="row-label">Angsuran:</span>
                                    <span className="row-value">{formatCurrency(item.principalAmount)}</span>
                                </div>
                                {item.penaltyAmount > 0 && (
                                    <div className="card-row penalty">
                                        <span className="row-label">Denda:</span>
                                        <span className="row-value">{formatCurrency(item.penaltyAmount)}</span>
                                    </div>
                                )}
                                <div className="card-row total">
                                    <span className="row-label">Total:</span>
                                    <span className="row-value">{formatCurrency(item.totalAmount)}</span>
                                </div>
                            </div>
                            {showActions && item.status === 'pending' && (
                                <div className="card-actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => onPayment?.(item.installmentNumber)}
                                    >
                                        Bayar Sekarang
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Desktop Table View */}
            <div className="schedule-table-wrapper">
                <table className="schedule-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Jatuh Tempo</th>
                            <th>Angsuran</th>
                            <th>Denda</th>
                            <th>Total</th>
                            <th>Status</th>
                            {showActions && <th>Aksi</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {schedule.map((item) => {
                            const statusInfo = getStatusBadge(item.status);
                            return (
                                <tr key={item.installmentNumber} className={item.status}>
                                    <td>{item.installmentNumber}</td>
                                    <td>{formatDate(item.dueDate)}</td>
                                    <td>{formatCurrency(item.principalAmount)}</td>
                                    <td className={item.penaltyAmount > 0 ? 'penalty' : ''}>
                                        {item.penaltyAmount > 0 ? formatCurrency(item.penaltyAmount) : '-'}
                                    </td>
                                    <td className="total">{formatCurrency(item.totalAmount)}</td>
                                    <td>
                                        <span className={`status-badge ${statusInfo.class}`}>
                                            {statusInfo.text}
                                        </span>
                                    </td>
                                    {showActions && (
                                        <td>
                                            {item.status === 'pending' && (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => onPayment?.(item.installmentNumber)}
                                                >
                                                    Bayar
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
