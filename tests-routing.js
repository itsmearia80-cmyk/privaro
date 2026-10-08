// Tes logika routing (fetch palsu): node tests-routing.js
const fs = require("fs");
const src = ["js/config.js", "js/services/googleRoutesProvider.js", "js/services/osrmProvider.js", "js/services/routingService.js"]
  .map((f) => fs.readFileSync(f, "utf8").replace(/if \(typeof module[^\n]*\n?/g, "")).join("\n");
const { CONFIG, RoutingService } = new Function(src + "; return { CONFIG, RoutingService };")();
global.CONFIG = CONFIG; CONFIG.routing.osrm.minGapMs = 0;
let ok = true, calls = [];
const t = (n, c) => { console.log((c ? "PASS " : "FAIL ") + n); if (!c) { ok = false; process.exitCode = 1; } };
const js = (o, s = 200) => ({ ok: s < 400, status: s, json: async () => o });
const osrmFetch = (u) => u.includes("nominatim") ? js([{ lat: "-6.2", lon: "106.8" }]) : js({ code: "Ok", routes: [{ distance: 42500, duration: 3600 }] });
const run = () => RoutingService.calculateRoute("A", "B");
(async () => {
  CONFIG.routing.google.apiKey = "TEST";
  global.fetch = async (u) => { calls.push(u); return u.includes("googleapis") ? js({ routes: [{ distanceMeters: 42500, duration: "3600s" }] }) : osrmFetch(u); };
  let r = await run();
  t("google sukses, OSRM tidak dipanggil", r.provider === "google" && r.distanceKm === 42.5 && r.durationMinutes === 60 && !calls.some((u) => u.includes("osrm") || u.includes("nominatim")));
  global.fetch = async (u) => u.includes("googleapis") ? js({}, 403) : osrmFetch(u);
  r = await run(); t("google 403 -> fallback OSRM", r.provider === "osrm" && r.distanceKm === 42.5);
  global.fetch = async (u) => u.includes("googleapis") ? js({}) : osrmFetch(u);
  r = await run(); t("google tanpa rute -> fallback OSRM", r.provider === "osrm");
  CONFIG.routing.google.apiKey = "";
  r = await run(); t("tanpa API key -> langsung OSRM", r.provider === "osrm");
  global.fetch = async () => js({}, 500);
  let threw = false; try { await run(); } catch (e) { threw = true; } t("semua provider gagal -> error (UI: tanpa tarif)", threw);
  CONFIG.routing.google.apiKey = "TEST"; CONFIG.routing.enableFallback = false; calls = [];
  global.fetch = async (u) => { calls.push(u); return js({}, 403); };
  threw = false; try { await run(); } catch (e) { threw = true; }
  t("fallback dimatikan -> error, OSRM tidak dicoba", threw && calls.length === 1);
})();
