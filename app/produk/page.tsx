import Header from '../components/Header';
import GoldCard from '../components/GoldCard';
import { goldProducts } from '../data/mock-data';

export default function ProdukPage() {
    const ubsProducts = goldProducts.filter(p => p.brand === 'UBS');
    const antamProducts = goldProducts.filter(p => p.brand === 'ANTAM');

    return (
        <>
            <Header />

            <div className="page-container">
                <div className="page-header">
                    <div className="breadcrumb">
                        <a href="/">Beranda</a>
                        <span>/</span>
                        <span>Produk</span>
                    </div>
                    <h1 className="page-title">Produk Emas</h1>
                </div>

                {/* UBS Section */}
                <section className="section" style={{ padding: 'var(--spacing-lg) 0' }}>
                    <div className="section-header" style={{ textAlign: 'left' }}>
                        <h2 className="section-title">Emas UBS</h2>
                        <p className="section-subtitle">Emas batangan UBS dengan sertifikat resmi</p>
                    </div>
                    <div className="gold-cards-grid">
                        {ubsProducts.map((product) => (
                            <GoldCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* Antam Section */}
                <section className="section" style={{ padding: 'var(--spacing-lg) 0' }}>
                    <div className="section-header" style={{ textAlign: 'left' }}>
                        <h2 className="section-title">Emas Antam</h2>
                        <p className="section-subtitle">Emas batangan Antam dengan sertifikat resmi</p>
                    </div>
                    <div className="gold-cards-grid">
                        {antamProducts.map((product) => (
                            <GoldCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            </div>

            <footer className="footer">
                <p className="footer-text">© 2024 Cicilan Emas. Semua hak dilindungi.</p>
            </footer>
        </>
    );
}
