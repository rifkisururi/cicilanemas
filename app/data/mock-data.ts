import { GoldProduct, InstallmentSettings, InstallmentPlan, AVAILABLE_TENORS } from '../types';

// Default settings untuk cicilan
export const defaultSettings: InstallmentSettings = {
    marginPercent: 0.10,       // 10% margin keuntungan PER TAHUN
    adminFeePercent: 0.01,     // 1% biaya admin
    latePenaltyPercent: 0.01,  // 1% denda keterlambatan
    minDownPaymentPercent: 0.05, // 5% uang muka minimum
    maxDownPaymentPercent: 0.50, // 50% uang muka maksimum
};

// Mock data produk emas - harga per produk individual
export const goldProducts: GoldProduct[] = [
    // UBS
    {
        id: 'ubs-1g',
        brand: 'UBS',
        weight: 1,
        pricePerGram: 2471000,    // Rp 2.471.000 per gram
        totalPrice: 2471000,      // Rp 2.471.000
        stock: 5,                 // TERSEDIA
        imageUrl: '/emas-ubs.png',
    },
    {
        id: 'ubs-2g',
        brand: 'UBS',
        weight: 2,
        pricePerGram: 2465000,    // Rp 2.465.000 per gram
        totalPrice: 4930000,      // Rp 4.930.000
        stock: 0,                 // HABIS
        imageUrl: '/emas-ubs.png',
    },
    {
        id: 'ubs-5g',
        brand: 'UBS',
        weight: 5,
        pricePerGram: 2460000,    // Rp 2.460.000 per gram
        totalPrice: 12300000,     // Rp 12.300.000
        stock: 0,                 // HABIS
        imageUrl: '/emas-ubs.png',
    },
    {
        id: 'ubs-10g',
        brand: 'UBS',
        weight: 10,
        pricePerGram: 2455000,    // Rp 2.455.000 per gram
        totalPrice: 24550000,     // Rp 24.550.000
        stock: 0,                 // HABIS
        imageUrl: '/emas-ubs.png',
    },
    // ANTAM
    {
        id: 'antam-1g',
        brand: 'ANTAM',
        weight: 1,
        pricePerGram: 2620000,    // Rp 2.620.000 per gram
        totalPrice: 2620000,      // Rp 2.620.000
        stock: 0,                 // HABIS
        imageUrl: '/emas-antam.png',
    },
    {
        id: 'antam-2g',
        brand: 'ANTAM',
        weight: 2,
        pricePerGram: 2614000,    // Rp 2.614.000 per gram
        totalPrice: 5228000,      // Rp 5.228.000
        stock: 3,                 // TERSEDIA
        imageUrl: '/emas-antam.png',
    },
    {
        id: 'antam-5g',
        brand: 'ANTAM',
        weight: 5,
        pricePerGram: 2608000,    // Rp 2.608.000 per gram
        totalPrice: 13040000,     // Rp 13.040.000
        stock: 0,                 // HABIS
        imageUrl: '/emas-antam.png',
    },
    {
        id: 'antam-10g',
        brand: 'ANTAM',
        weight: 10,
        pricePerGram: 2602000,    // Rp 2.602.000 per gram
        totalPrice: 26020000,     // Rp 26.020.000
        stock: 0,                 // HABIS
        imageUrl: '/emas-antam.png',
    },
];

// Sample cicilan pelanggan
export const sampleInstallments: InstallmentPlan[] = [
    {
        id: 'cicil-001',
        customerId: 'cust-001',
        customerName: 'Ahmad Rizki',
        customerPhone: '081234567890',
        customerAddress: 'Jl. Merdeka No. 123, Jakarta',
        product: goldProducts[0],
        tenor: 12,
        goldPrice: goldProducts[0].totalPrice,
        downPaymentPercent: 0.10,
        downPaymentAmount: goldProducts[0].totalPrice * 0.10,
        financingAmount: goldProducts[0].totalPrice * 0.90,
        marginAmount: goldProducts[0].totalPrice * 0.90 * 0.10,
        adminFeeAmount: goldProducts[0].totalPrice * 0.90 * 0.01,
        totalAmount: goldProducts[0].totalPrice,
        amountToFinance: goldProducts[0].totalPrice * 0.90 * 1.11,
        monthlyInstallment: (goldProducts[0].totalPrice * 0.90 * 1.11) / 12,
        startDate: new Date('2024-12-01'),
        paymentSchedule: [],
        status: 'active',
        createdAt: new Date('2024-12-01'),
    },
];

// Helper to get product by ID
export function getProductById(id: string): GoldProduct | undefined {
    return goldProducts.find(p => p.id === id);
}

// Check if product is available (has stock)
export function isProductAvailable(id: string): boolean {
    const product = getProductById(id);
    return product ? product.stock > 0 : false;
}

// Get all available tenors
export function getAvailableTenors() {
    return AVAILABLE_TENORS;
}

// Update product price (for admin use)
export function updateProductPrice(id: string, newPricePerGram: number): boolean {
    const product = goldProducts.find(p => p.id === id);
    if (product) {
        product.pricePerGram = newPricePerGram;
        product.totalPrice = newPricePerGram * product.weight;
        return true;
    }
    return false;
}

// Update product stock (for admin use)
export function updateProductStock(id: string, newStock: number): boolean {
    const product = goldProducts.find(p => p.id === id);
    if (product) {
        product.stock = Math.max(0, newStock);
        return true;
    }
    return false;
}
