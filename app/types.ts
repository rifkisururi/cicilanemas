// Types for Cicilan Emas Application

export type GoldBrand = 'UBS' | 'ANTAM';
export type GoldWeight = 1 | 2 | 5 | 10;
export type TenorMonths = 12 | 18 | 24 | 30 | 36;

export interface GoldProduct {
    id: string;
    brand: GoldBrand;
    weight: GoldWeight;
    pricePerGram: number;
    totalPrice: number;
    stock: number;
    imageUrl: string;
}

export interface InstallmentSettings {
    marginPercent: number;      // Margin keuntungan toko PER TAHUN (decimal, e.g. 0.10 = 10%/tahun)
    adminFeePercent: number;    // Biaya admin pembuatan cicilan (decimal)
    latePenaltyPercent: number; // Denda keterlambatan per angsuran (decimal)
    minDownPaymentPercent: number; // Uang muka minimum (default 0.05 = 5%)
    maxDownPaymentPercent: number; // Uang muka maksimum (default 0.50 = 50%)
}

export interface PaymentSchedule {
    installmentNumber: number;
    dueDate: Date;
    principalAmount: number;
    status: 'pending' | 'paid' | 'late' | 'paid_late';
    paidDate?: Date;
    penaltyAmount: number;
    totalAmount: number;
}

export interface InstallmentPlan {
    id: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    product: GoldProduct;
    tenor: TenorMonths;
    goldPrice: number;
    downPaymentPercent: number;
    downPaymentAmount: number;
    financingAmount: number;
    marginAmount: number;
    adminFeeAmount: number;
    totalAmount: number;
    amountToFinance: number;
    monthlyInstallment: number;
    startDate: Date;
    paymentSchedule: PaymentSchedule[];
    status: 'active' | 'completed' | 'defaulted';
    createdAt: Date;
}

export interface CashPurchase {
    id: string;
    customerName: string;
    customerPhone: string;
    product: GoldProduct;
    totalPrice: number;
    purchaseDate: Date;
}

// Down payment constants
export const MIN_DOWN_PAYMENT_PERCENT = 0.05; // 5%
export const MAX_DOWN_PAYMENT_PERCENT = 0.50; // 50%
export const DEFAULT_DOWN_PAYMENT_PERCENT = 0.10; // 10% default

// Utility function to calculate installment with down payment
// Margin dihitung PER TAHUN dari jumlah pembiayaan
// Admin Fee dihitung sekali dari jumlah pembiayaan
export function calculateInstallment(
    goldPrice: number,
    settings: InstallmentSettings,
    tenor: TenorMonths,
    downPaymentPercent: number = DEFAULT_DOWN_PAYMENT_PERCENT
): {
    downPaymentAmount: number;
    financingAmount: number;
    marginAmount: number;
    adminFeeAmount: number;
    totalAmount: number;
    amountToFinance: number;
    monthlyInstallment: number;
    yearsCount: number;
} {
    // Validate down payment percentage
    const validDownPayment = Math.max(
        settings.minDownPaymentPercent,
        Math.min(settings.maxDownPaymentPercent, downPaymentPercent)
    );

    // Uang muka dari harga emas
    const downPaymentAmount = goldPrice * validDownPayment;

    // Jumlah pembiayaan (harga emas - uang muka)
    const financingAmount = goldPrice - downPaymentAmount;

    // Hitung jumlah tahun dari tenor
    const yearsCount = tenor / 12;

    // Margin dihitung PER TAHUN dari jumlah pembiayaan
    // Contoh: margin 10% per tahun, tenor 24 bulan = 2 tahun = margin 20%
    const marginAmount = financingAmount * settings.marginPercent * yearsCount;

    // Admin fee hanya dihitung sekali (tidak per tahun)
    const adminFeeAmount = financingAmount * settings.adminFeePercent;

    // Total yang harus dicicil = pembiayaan + margin + admin
    const amountToFinance = financingAmount + marginAmount + adminFeeAmount;

    // Total keseluruhan = DP + cicilan
    const totalAmount = downPaymentAmount + amountToFinance;

    const monthlyInstallment = amountToFinance / tenor;

    return {
        downPaymentAmount,
        financingAmount,
        marginAmount,
        adminFeeAmount,
        totalAmount,
        amountToFinance,
        monthlyInstallment,
        yearsCount,
    };
}

// Generate payment schedule (takes amountToFinance after down payment)
export function generatePaymentSchedule(
    amountToFinance: number,
    tenor: TenorMonths,
    startDate: Date
): PaymentSchedule[] {
    const monthlyAmount = amountToFinance / tenor;
    const schedule: PaymentSchedule[] = [];

    for (let i = 1; i <= tenor; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        schedule.push({
            installmentNumber: i,
            dueDate,
            principalAmount: monthlyAmount,
            status: 'pending',
            penaltyAmount: 0,
            totalAmount: monthlyAmount,
        });
    }

    return schedule;
}

// Calculate penalty for late payment
export function calculatePenalty(
    installmentAmount: number,
    penaltyPercent: number
): number {
    return installmentAmount * penaltyPercent;
}

// Available tenors
export const AVAILABLE_TENORS: TenorMonths[] = [12, 18, 24, 30, 36];

// Format currency to IDR
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Format date to Indonesian locale
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}
