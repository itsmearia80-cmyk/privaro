// Pintu tunggal routing. UI & pricing hanya menerima objek ternormalisasi:
// { distanceKm, durationMinutes, provider: "google"|"osrm", status: "success" }. Gagal = melempar error.
const RoutingService = (() => {
  const providers = () => ({ google: GoogleRoutesProvider, osrm: OsrmProvider });
  async function calculateRoute(origin, destination) {
    const R = CONFIG.routing, P = providers();
    try { return await P[R.primary].getRoute(origin, destination); }
    catch (e) {
      console.warn("[routing] primary (" + R.primary + ") gagal:", e.message);
      if (!R.enableFallback || !R.fallback || R.fallback === R.primary) throw e;
      return await P[R.fallback].getRoute(origin, destination);
    }
  }
  return { calculateRoute };
})();
if (typeof module !== "undefined") module.exports = RoutingService;
