// FALLBACK / development. Geocoding (Nominatim -> Photon) lalu OSRM. Hanya alamat yang dikirim, tanpa data pelanggan.
const OsrmProvider = (() => {
  const R = () => CONFIG.routing.osrm, T = () => CONFIG.routing.timeoutMs;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let lastNominatim = 0;
  async function getJSON(url) {
    const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), T());
    try {
      const res = await fetch(url, { signal: ctl.signal, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status + " " + url.split("?")[0]);
      return await res.json();
    } finally { clearTimeout(t); }
  }
  const geocoders = [
    async (q) => { // Nominatim: berurutan, jeda >= 1 detik, tanpa autocomplete
      const wait = lastNominatim + R().minGapMs - Date.now(); if (wait > 0) await sleep(wait);
      lastNominatim = Date.now();
      const d = await getJSON(`${R().geocoderUrl}?format=jsonv2&limit=1&countrycodes=${R().countryCodes}&q=${encodeURIComponent(q)}`);
      return d.length ? { lat: +d[0].lat, lon: +d[0].lon } : null;
    },
    async (q) => {
      const d = await getJSON(`${R().fallbackGeocoderUrl}?limit=1&q=${encodeURIComponent(q + ", Indonesia")}`);
      const c = d.features && d.features[0] && d.features[0].geometry.coordinates;
      return c ? { lat: c[1], lon: c[0] } : null;
    }
  ];
  async function geocode(q) {
    for (const g of geocoders) {
      try { const hit = await g(q); if (hit) return hit; } catch (e) { console.warn("[osrm] geocoder gagal:", e.message); }
    }
    throw new Error("osrm: alamat tidak ditemukan");
  }
  async function getRoute(origin, destination) {
    const a = await geocode(origin), b = await geocode(destination); // berurutan
    let last;
    for (const base of R().routerUrls) {
      try {
        const d = await getJSON(`${base}/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`);
        if (d.code === "Ok" && d.routes && d.routes.length)
          return { distanceKm: d.routes[0].distance / 1000, durationMinutes: Math.round(d.routes[0].duration / 60), provider: "osrm", status: "success" };
        last = new Error("osrm: code " + d.code);
      } catch (e) { last = e; console.warn("[osrm] router gagal:", e.message); }
    }
    throw last || new Error("osrm: no route");
  }
  return { getRoute };
})();
