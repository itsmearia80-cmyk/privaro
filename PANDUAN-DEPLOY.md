# Panduan Upload Privaro ke Cloudflare (via GitHub)

Waktu yang dibutuhkan: sekitar 15 menit. Biaya: Rp0 (akun GitHub dan Cloudflare gratis).

> Label menu Cloudflare/GitHub bisa berubah sewaktu-waktu. Jika tampilannya sedikit berbeda dari panduan ini, cari menu dengan nama yang mirip.

---

## Bagian 0 - Persiapan (wajib)

1. Ekstrak `privaro.zip` di komputer Anda.
2. Buka `js/config.js` dengan Notepad/VS Code.
3. Ganti `driverNumber: "628XXXXXXXXXX"` dengan nomor WhatsApp driver, format `62` tanpa `+` dan tanpa `0` di depan. Contoh: `6281234567890`.
4. Cek tarif di bagian `pricing`. Isi `operatingArea` dan `serviceHours` hanya jika sudah pasti.
5. (Opsional) Tes lokal: buka terminal di folder proyek, jalankan `python3 -m http.server 8080`, lalu buka `http://localhost:8080`.

---

## Bagian 1 - Buat akun dan repository GitHub

1. Daftar/login di https://github.com.
2. Klik **+** (kanan atas) > **New repository**.
3. Isi **Repository name**, misalnya `privaro`.
4. Pilih **Public** atau **Private** (keduanya bisa dipakai Cloudflare Pages).
5. Jangan centang "Add a README". Klik **Create repository**.

### Cara A - Upload lewat browser (paling mudah, tanpa install apa pun)

1. Di halaman repository yang baru, klik **uploading an existing file**.
2. Buka folder hasil ekstrak, pilih **isi** folder (`index.html`, `css`, `js`, `assets`, dll.), lalu seret ke halaman GitHub.
   - Penting: `index.html` harus berada di **paling luar** repository, bukan di dalam subfolder. Jangan upload file zip-nya.
3. Tunggu selesai, isi pesan commit (mis. `first version`), klik **Commit changes**.

### Cara B - Lewat Git (jika sudah terpasang)

Jalankan di dalam folder proyek (ganti `USERNAME`):

    git init
    git add .
    git commit -m "first version"
    git branch -M main
    git remote add origin https://github.com/USERNAME/privaro.git
    git push -u origin main

---

## Bagian 2 - Hubungkan ke Cloudflare Pages

1. Daftar/login di https://dash.cloudflare.com.
2. Di menu kiri pilih **Workers & Pages**.
3. Klik **Create application**, pilih tab/opsi **Pages**, lalu **Connect to Git**.
4. Pilih **GitHub**. Anda akan diminta login ke GitHub dan memberi izin.
5. Pilih akses repository:
   - **Only select repositories** (disarankan), lalu pilih `privaro`.
   - Klik **Install & Authorize**.
6. Pilih repository tadi, klik **Begin setup**.
7. Isi pengaturan build:
   - **Project name**: nama bebas. Ini menjadi alamat `nama.pages.dev`, jadi pilih yang rapi.
   - **Production branch**: `main`
   - **Framework preset**: `None`
   - **Build command**: kosongkan
   - **Build output directory**: kosongkan atau isi `/` (situs ini tidak punya proses build)
   - **Root directory**: kosongkan
8. Klik **Save and Deploy**. Tunggu beberapa saat sampai statusnya sukses.
9. Klik **Continue to project**. Alamat situs Anda ada di bagian atas, bentuknya `https://nama-project.pages.dev`.

---

## Bagian 3 - Tes setelah online (jangan dilewati)

Buka alamat `pages.dev` di HP dan di komputer, lalu cek:

1. Isi form dengan data uji, tekan **GET ESTIMATE**. Jarak dan tarif harus muncul.
2. Tekan **SEND BOOKING TO WHATSAPP**. WhatsApp harus terbuka ke **nomor driver yang benar** dengan pesan terisi.
3. Coba satu lokasi yang sengaja ngawur. Tarif harus menjadi "To be confirmed", bukan Rp0.
4. Pastikan tulisan "Toll & parking not included" terlihat di form dan di hasil estimasi.
5. Bandingkan jarak hasil situs dengan Google Maps untuk 2-3 rute nyata. Geocoding gratis bisa salah memilih titik pada alamat yang ambigu.

---

## Bagian 4 - Update di kemudian hari

Setiap kali Anda mengubah file (mis. tarif di `js/config.js`) dan menyimpannya ke GitHub, Cloudflare otomatis deploy ulang dalam beberapa menit.

- Lewat browser: buka file di GitHub, klik ikon pensil (Edit), ubah, lalu **Commit changes**.
- Lewat Git: `git add . && git commit -m "update tarif" && git push`.

Jika perubahan belum tampak, tekan refresh keras (Ctrl+Shift+R) atau cek tab **Deployments** di Cloudflare.

---

## Bagian 5 - Domain sendiri (opsional, bisa nanti)

Di proyek Pages: **Custom domains** > **Set up a custom domain**, lalu ikuti petunjuk DNS. Situs sudah berfungsi penuh di `*.pages.dev` tanpa langkah ini.

---

## Masalah umum

| Gejala | Penyebab biasa | Solusi |
|---|---|---|
| Halaman 404 | `index.html` berada di dalam subfolder | Pindahkan semua file ke root repository |
| Tampilan tanpa gaya | Folder `css`/`js` tidak ikut ter-upload | Upload ulang, pastikan folder terlihat di GitHub |
| WhatsApp ke nomor salah | `driverNumber` belum diganti | Edit `js/config.js`, commit |
| Estimasi sering "To be confirmed" | Server peta gratis sibuk/membatasi, atau lokasi tidak ditemukan | Coba nama lokasi lebih spesifik. Untuk trafik tinggi, lihat Batasan di README |
| Repo tidak muncul di Cloudflare | Izin GitHub belum diberikan | Di GitHub: Settings > Applications > Cloudflare Pages > Configure, tambahkan repo |

## Catatan penting

- Setelah proyek Pages dibuat **lewat Git**, menurut dokumentasi Cloudflare Anda tidak bisa mengubahnya menjadi mode Direct Upload belakangan. Kalau ragu, putuskan sekarang: Git (otomatis update, disarankan) atau Direct Upload (unggah manual tiap kali).
- Jangan menaruh password atau API key rahasia di file mana pun. Semua isi situs ini bisa dibaca publik.
- Nomor WhatsApp driver akan terlihat publik di situs. Itu memang tujuannya, tetapi pastikan driver setuju.

---

## Lampiran A - Mengaktifkan Google Routes API (routing utama V1.1)

Tanpa langkah ini situs tetap jalan, tetapi memakai OSRM gratis (kurang stabil). Google dilewati otomatis selama `apiKey` kosong.

1. Buka https://console.cloud.google.com, buat project baru.
2. Aktifkan **Billing** (Google mewajibkan akun billing untuk Routes API).
3. **APIs & Services > Library**: aktifkan **Routes API**.
4. **APIs & Services > Credentials > Create credentials > API key**.
5. Edit key tersebut, **wajib** atur pembatasan:
   - *Application restrictions*: **Websites (HTTP referrers)**, isi domain situs Anda (mis. `https://nama-situs.workers.dev/*`, dan domain kustom bila ada).
   - *API restrictions*: **Restrict key**, pilih hanya **Routes API**.
6. Di **Billing > Budgets & alerts**, buat budget dan notifikasi, serta pasang quota harian di **Routes API > Quotas**.
7. Tempel key ke `js/config.js` pada `routing.google.apiKey`, commit, tunggu deploy.
8. Tes dari domain produksi (bukan hanya lokal). Di Console browser (F12), tidak boleh ada error 403 dari `routes.googleapis.com`. Kalau ada, cek pembatasan referrer di langkah 5. Pesan error yang muncul akan menunjukkan penyebabnya.

Catatan: key yang ditaruh di `config.js` terlihat publik oleh siapa pun yang membuka situs. Pembatasan referrer + quota + budget alert adalah satu-satunya pengaman di arsitektur V1.1. Jangan gunakan key tanpa pembatasan.

## Lampiran B - Jika alamat `*.workers.dev`

Cloudflare kini sering membuat proyek sebagai Worker dengan static assets (alamat `nama.workers.dev`), bukan Pages (`nama.pages.dev`). Keduanya menyajikan situs statis ini dengan baik. Isian build tetap: tanpa build command, direktori aset di root (`/`). Untuk mengganti nama proyek, buat proyek baru dari repository yang sama; nama di alamat tidak bisa sekadar diedit.
