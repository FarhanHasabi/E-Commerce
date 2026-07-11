# Glamora — E-Commerce Fashion

Toko online pakaian berbasis web untuk pakaian pria, wanita, dan anak-anak.

---

## Teknologi yang Digunakan

**Backend**
- Python 3
- Flask — web framework & static file server
- Supabase Python Client — koneksi ke database
- Flask-CORS — mengizinkan request lintas origin
- python-dotenv — manajemen environment variable

**Frontend**
- HTML5, Tailwind CSS
- Supabase JavaScript SDK — autentikasi & akses database langsung dari browser
- Google Fonts (Playfair Display, Poppins)

**Database & Auth**
- Supabase (PostgreSQL) — penyimpanan produk, profil user, dan keranjang belanja
- Supabase Auth — registrasi dan login pengguna

---

## Struktur Project

```
E-Commerce/
├── backend/
│   ├── app.py          # Server Flask + API endpoint
│   └── .env            # Konfigurasi Supabase (tidak di-commit)
└── frontend/
    ├── index.html              # Landing page + carousel produk
    ├── category.html           # Browsing produk dengan filter & pagination
    ├── product.html            # Detail produk
    ├── cart.html               # Keranjang belanja
    ├── checkout.html           # Form checkout & pembayaran
    ├── login.html              # Halaman login
    ├── signup.html             # Halaman registrasi
    ├── contact.html            # Halaman kontak
    ├── order-confirmation.html # Konfirmasi pesanan
    └── assets/
        ├── css/style.css
        ├── js/script.js
        └── img/
```

---

## Cara Menjalankan

### 1. Clone repository

```bash
git clone https://github.com/FarhanHasabi/E-Commerce.git
cd E-Commerce
```

### 2. Buat file `.env` di folder `backend/`

```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_service_role_key
```

### 3. Install dependencies Python

```bash
cd backend
pip install flask flask-cors supabase python-dotenv
```

### 4. Jalankan server

```bash
python app.py
```

### 5. Buka di browser

```
http://127.0.0.1:5000/
```

---

## Fitur

- **Autentikasi** — Registrasi & login via Supabase Auth
- **Profil User** — Data nama disimpan di tabel `profiles` via database trigger
- **Browsing Produk** — Filter kategori (Pria / Wanita / Anak), pencarian, sorting, pagination
- **Keranjang Persisten** — Keranjang belanja disimpan di database Supabase per user
- **Checkout** — Form pengiriman + pilihan metode pembayaran (Transfer, E-Wallet, COD)
- **Carousel Produk** — Menampilkan 5 produk acak di halaman utama
- **Proteksi Halaman** — Keranjang dan checkout hanya bisa diakses setelah login

---

## Tabel Supabase yang Diperlukan

| Tabel | Fungsi |
|---|---|
| `products` | Semua produk (ditampilkan di carousel home) |
| `mens_products` | Produk kategori pria |
| `women_products` | Produk kategori wanita |
| `kid_products` | Produk kategori anak |
| `profiles` | Data profil user (diisi otomatis via DB trigger saat signup) |
| `carts` | Keranjang belanja persisten per user |

### Stored Procedure yang Diperlukan

Fungsi RPC `add_item_to_cart` harus dibuat di Supabase untuk menambah/memperbarui item di keranjang:

```sql
CREATE OR REPLACE FUNCTION add_item_to_cart(
  p_user_id UUID,
  p_sku TEXT,
  p_price NUMERIC,
  p_name TEXT,
  p_image TEXT,
  p_quantity INT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO carts (user_id, product_id, price, name, image, quantity)
  VALUES (p_user_id, p_sku, p_price, p_name, p_image, p_quantity)
  ON CONFLICT (user_id, product_id)
  DO UPDATE SET quantity = carts.quantity + p_quantity;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Lisensi

© 2024 Glamora. All rights reserved.
