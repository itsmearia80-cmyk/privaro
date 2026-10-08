// PRIMARY. Google Routes API (Compute Routes). Hanya meminta distanceMeters + duration (tanpa traffic).
const GoogleRoutesProvider = (() => {
  async function getRoute(origin, destination) {
    const R = CONFIG.routing, G = R.google;
    if (!G.apiKey) throw new Error("google: apiKey belum diisi");
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), R.timeoutMs);
    try {
      const res = await fetch(G.endpoint, {
        method: "POST", signal: ctl.signal,
        headers: { "Content-Type": "application/json", "X-Goog-Api-Key": G.apiKey, "X-Goog-FieldMask": "routes.distanceMeters,routes.duration" },
        body: JSON.stringify({ origin: { address: origin }, destination: { address: destination },
          travelMode: "DRIVE", routingPreference: "TRAFFIC_UNAWARE", regionCode: "ID", languageCode: "id" })
      });
      if (!res.ok) throw new Error("google: HTTP " + res.status); // body mentah tidak pernah ditampilkan ke user
      const r = ((await res.json()).routes || [])[0];
      if (!r || !(r.distanceMeters > 0)) throw new Error("google: rute tidak ditemukan");
      return { distanceKm: r.distanceMeters / 1000, durationMinutes: Math.round((parseFloat(r.duration) || 0) / 60), provider: "google", status: "success" };
    } finally { clearTimeout(t); }
  }
  return { getRoute };
})();
