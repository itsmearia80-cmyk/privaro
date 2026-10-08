# Privaro - Private Ride. Personal Driver. (Booking Web V1.1)
Situs statis (HTML + CSS + JS murni). Tanpa backend atau database.

## Wajib sebelum deploy (`js/config.js`)
- `whatsapp.driverNumber`: nomor driver, format `628xxxxxxxxxx`.
- `pricing`: tarif saat ini Rp5.250/km, waiting jam pertama Rp30.000, tambahan Rp15.000/jam.
- `routing.google.apiKey`: opsional tetapi disarankan. Key HARUS dibatasi HTTP referrer + hanya Routes API. Kosong = langsung memakai OSRM.

## Routing
Google Routes API (primary) lalu OSRM (fallback), dengan objek hasil yang seragam `{distanceKm, durationMinutes, provider, status}`. Ganti `primary`/`fallback`/`enableFallback` di config tanpa mengubah kode lain. Jika semua gagal, tarif tidak dihitung dan pengguna diarahkan memeriksa alamat atau kirim via WhatsApp.

## Tes
    node tests.js           # pricing & validasi
    node tests-routing.js   # logika provider & fallback (fetch palsu)

## Batasan
- OSRM/Nominatim/Photon adalah server publik gratis: tanpa jaminan kapasitas, hanya fallback/development.
- Tol & parkir tidak termasuk estimasi.
- Tarif Google mengikuti kebijakan pay-as-you-go yang bisa berubah. Verifikasi di dokumentasi resmi Google sebelum produksi.
