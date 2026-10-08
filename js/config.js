// SATU-SATUNYA tempat untuk mengubah nomor WhatsApp, tarif, routing, dan info bisnis.
const CONFIG = {
  business: {
    name: "Privaro",                // tagline: "Private Ride. Personal Driver."
    operatingArea: "",              // isi bila sudah pasti. Kosong = tidak ditampilkan
    serviceHours: ""                // isi bila sudah pasti. Kosong = tidak ditampilkan
  },
  whatsapp: { driverNumber: "6281573011713" }, // GANTI (format 62..., tanpa + dan tanpa 0)
  pricing: { pricePerKm: 5250, firstWaitingHour: 30000, additionalWaitingHour: 15000 },
  routing: {
    primary: "google",              // "google" | "osrm"
    fallback: "osrm",
    enableFallback: true,
    timeoutMs: 8000,
    longTripKm: 100,
    google: {
      // Key BROWSER yang SUDAH dibatasi (HTTP referrer + hanya Routes API). Kosong = Google dilewati, langsung fallback.
      apiKey: "",
      endpoint: "https://routes.googleapis.com/directions/v2:computeRoutes"
    },
    osrm: {                         // fallback/development: server publik, bukan jaminan kapasitas produksi
      routerUrls: [
        "https://router.project-osrm.org/route/v1/driving",
        "https://routing.openstreetmap.de/routed-car/route/v1/driving"
      ],
      geocoderUrl: "https://nominatim.openstreetmap.org/search",
      fallbackGeocoderUrl: "https://photon.komoot.io/api/",
      countryCodes: "id",
      minGapMs: 1100
    }
  },
  booking: { maxNotesLength: 500, maxPassengers: 8 }
};
