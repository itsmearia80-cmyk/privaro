const WhatsAppService = (() => {
  const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const fmtKm = (n) => (Math.round(n * 10) / 10).toString();
  const PROVIDER = { google: "Google Routes", osrm: "OSRM" };
  function buildMessage(s, route, fare) {
    const na = "Belum dapat dihitung";
    const wait = s.waitingHours ? `${s.waitingHours} jam` : "Tidak ada";
    const L = [`Halo, saya ingin booking ${CONFIG.business.name}.`, "",
      `Nama: ${s.name}`, `WhatsApp: ${s.whatsapp}`, `Service: ${s.service}`,
      `Tanggal: ${new Date(s.date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`,
      `Jam: ${s.time}`, `Trip: ${s.tripType === "round-trip" ? "Round Trip" : "One Way"}`,
      `Pickup: ${s.pickup}`, `Destination: ${s.destination}`, `Jumlah Penumpang: ${s.passengers}`,
      `Jarak Estimasi: ${route ? fmtKm(route.distanceKm) + " km (satu arah)" : na}`,
      `Waiting: ${wait}`, `Estimasi Tarif: ${fare ? PricingService.formatRupiah(fare.estimatedTotal) : na}`,
      "Tol/Parkir: tidak termasuk estimasi",
      `Dihitung dengan: ${route ? PROVIDER[route.provider] || route.provider : "-"}`];
    if (s.notes) L.push(`Catatan: ${s.notes}`);
    L.push("", "Mohon konfirmasi ketersediaan dan harga final. Terima kasih.");
    return L.join("\n");
  }
  const buildUrl = (msg) => `https://wa.me/${CONFIG.whatsapp.driverNumber}?text=${encodeURIComponent(msg)}`;
  return { buildMessage, buildUrl, fmtDate, fmtKm };
})();
if (typeof module !== "undefined") module.exports = WhatsAppService;
