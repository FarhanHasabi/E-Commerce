from flask import Flask, request, jsonify, send_from_directory
from supabase import create_client, Client
from dotenv import load_dotenv
from flask_cors import CORS
import os

# Memuat variabel lingkungan (seperti SUPABASE_URL)
load_dotenv()

app = Flask(__name__)
CORS(app)

# --- KONFIGURASI FIREBASE/SUPABASE ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Inisialisasi klien Supabase
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as e:
    print(f"Error connecting to Supabase: {e}")
    # Jika Supabase gagal, kita masih bisa menjalankan server
    supabase = None 

# Tentukan path absolut ke direktori frontend
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'frontend')

# --- ROUTE UNTUK FRONTEND (WEBSITE) ---

# 1. Rute Root (/)
# Saat pengguna mengakses http://127.0.0.1:5000/, kita kirim file index.html
@app.route("/")
def serve_index():
    # Mengirim file index.html dari direktori frontend
    return send_from_directory(FRONTEND_DIR, 'index.html')

# 2. Rute untuk file statis (assets)
# Rute ini diperlukan agar browser bisa memuat CSS, JS, dan gambar dari folder assets
@app.route('/<path:filename>')
def serve_static(filename):
    # Melayani semua file lain dari direktori frontend (termasuk assets)
    return send_from_directory(FRONTEND_DIR, filename)

# --- ROUTE UNTUK BACKEND (API) ---

# 3. Contoh endpoint ambil produk
@app.route("/api/products", methods=["GET"])
def get_products():
    if not supabase:
        return jsonify({"error": "Database connection failed"}), 500
    
    # Ubah rute API agar lebih jelas, misalnya /api/products
    data = supabase.table("products").select("*").execute()
    return jsonify(data.data)

# 4. Contoh endpoint tambah produk
@app.route("/api/products", methods=["POST"])
def add_product():
    if not supabase:
        return jsonify({"error": "Database connection failed"}), 500

    payload = request.get_json()
    data = supabase.table("products").insert(payload).execute()
    return jsonify(data.data), 201

# 5. Contoh endpoint user login (kalau pakai Supabase Auth)
@app.route("/api/login", methods=["POST"])
def login():
    if not supabase:
        return jsonify({"error": "Database connection failed"}), 500

    payload = request.get_json()
    email = payload.get("email")
    password = payload.get("password")
    
    try:
        user = supabase.auth.sign_in_with_password(
            {"email": email, "password": password})
        return jsonify(user.model_dump())
    except Exception as e:
        # Menangani kesalahan otentikasi
        return jsonify({"error": str(e)}), 401


if __name__ == "__main__":
    # Penting: Pastikan folder 'frontend' berada satu tingkat di atas 'backend'
    print(f"Server berjalan. Coba akses: http://127.0.0.1:5000/")
    app.run(debug=True)
