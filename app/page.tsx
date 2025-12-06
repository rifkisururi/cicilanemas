import Header from './components/Header';
import GoldCard from './components/GoldCard';
import { goldProducts } from './data/mock-data';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Investasi Emas Lebih Mudah dengan{' '}
              <span className="highlight">Cicilan Emas</span>
            </h1>
            <p className="hero-subtitle">
              Pilih emas UBS atau Antam dengan berbagai pecahan.
              Beli tunai atau cicilan hingga 36 bulan dengan proses mudah dan cepat.
            </p>
            <div className="hero-buttons">
              <Link href="/produk" className="btn btn-primary btn-lg">
                Lihat Produk
              </Link>
              <Link href="/dashboard" className="btn btn-outline btn-lg">
                Cek Cicilan Saya
              </Link>
            </div>
          </div>
          <div className="hero-image">
            🪙
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Produk Emas Tersedia</h2>
            <p className="section-subtitle">Pilih emas sesuai kebutuhan investasi Anda</p>
          </div>

          <div className="gold-cards-grid">
            {[...goldProducts]
              .sort((a, b) => {
                // Prioritaskan produk tersedia (stock > 0)
                if (a.stock > 0 && b.stock === 0) return -1;
                if (a.stock === 0 && b.stock > 0) return 1;
                // Kemudian urutkan berdasarkan harga
                return a.totalPrice - b.totalPrice;
              })
              .map((product) => (
                <GoldCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Kenapa Pilih Cicilan Emas?</h2>
            <p className="section-subtitle">Nikmati kemudahan berinvestasi emas dengan berbagai keuntungan</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Cicilan Fleksibel</h3>
              <p className="feature-description">
                Pilih tenor 12, 18, 24, 30, atau 36 bulan sesuai kemampuan Anda
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3 className="feature-title">Emas Bersertifikat</h3>
              <p className="feature-description">
                Hanya emas UBS dan Antam dengan sertifikat resmi
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Aman & Terpercaya</h3>
              <p className="feature-description">
                Proses mudah dengan transparansi biaya yang jelas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="section-container">
          <div className="feature-card" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <div className="feature-icon">📞</div>
            <h3 className="feature-title">Butuh Bantuan?</h3>
            <p className="feature-description" style={{ marginBottom: 'var(--spacing-lg)' }}>
              Hubungi customer service kami untuk konsultasi gratis tentang investasi emas
            </p>
            <a href="tel:+6281234567890" className="btn btn-primary">
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          © 2024 Cicilan Emas. Semua hak dilindungi.
        </p>
      </footer>
    </>
  );
}
