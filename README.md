# AsetAI MVP — website bisnis digital pribadi

Versi pertama ini adalah aplikasi web statis yang dirancang untuk HP Android. Tidak memerlukan server sendiri, akun pengguna, atau API berbayar untuk dicoba.

## Fitur
- Catat dan kelola produk digital.
- Alur status Draft → Perlu ditinjau → Disetujui → Dipublikasikan.
- Simpan tautan penjualan eksternal, misalnya halaman produk di Lynk.id.
- Buat kerangka materi promosi berdasarkan template lokal.
- Salin prompt untuk digunakan di ChatGPT.
- Catat transaksi dan lihat omzet yang dimasukkan secara manual.
- Checklist rencana 30 hari.
- Ekspor data ke file JSON sebagai cadangan.

## Batasan penting
- Generator promosi lokal **bukan AI yang terhubung**. Untuk generasi AI, salin prompt ke ChatGPT atau integrasikan API di tahap berikutnya.
- Aplikasi ini tidak menerima pembayaran dan tidak memverifikasi transaksi.
- Tidak ada pengiriman file otomatis dari aplikasi ini. Gunakan fitur yang tersedia di platform penjualan dan uji alur pembeliannya.
- Data tersimpan di localStorage browser/perangkat. Jika data browser dihapus atau berganti perangkat, data bisa hilang. Gunakan tombol Ekspor data secara berkala.
- Jangan menyimpan kata sandi, data rekening, atau data sensitif pembeli di aplikasi ini.
- Target omzet bukan jaminan. Validasi permintaan sebelum membuat banyak produk.

## Cara mencoba langsung di HP Android
1. Ekstrak ZIP.
2. Buka `index.html` di browser yang mendukung file lokal. Jika browser tidak membuka file dengan baik, gunakan hosting statis gratis.
3. Tambahkan produk contoh milik sendiri, lalu uji fitur status, promosi, dan catatan penjualan.

## Cara menerbitkan website gratis melalui GitHub Pages
1. Buat akun GitHub jika belum punya.
2. Buat repository baru, misalnya `asetai-mvp`.
3. Unggah `index.html`, `style.css`, dan `app.js` ke root repository.
4. Buka Settings → Pages.
5. Pilih sumber deployment dari branch utama dan folder root, lalu simpan.
6. Tunggu deployment selesai; buka URL Pages yang ditampilkan GitHub.
7. Uji semua fitur di HP.

Alternatif hosting statis: Cloudflare Pages. Ikuti dokumentasi resmi penyedia hosting karena tampilan pengaturan dapat berubah.

## Cara menghubungkan ke Lynk.id
1. Buat produk digital di Lynk.id secara terpisah.
2. Salin tautan halaman produk yang benar.
3. Di AsetAI, edit produk dan tempel tautan tersebut pada kolom “Tautan penjualan”.
4. Uji tautan dan alur pembelian dari sudut pandang pembeli.
5. Pastikan file dikirim oleh platform setelah pembayaran berhasil, sesuai pengaturan dan ketentuan platform.

## Pengembangan selanjutnya
- Integrasi API AI (mungkin berbiaya; jangan masukkan API key ke JavaScript publik).
- Penyimpanan cloud dan autentikasi jika dibutuhkan.
- Integrasi pembayaran/webhook melalui backend yang aman.
- Analitik kunjungan dan konversi.
