const Validation = (() => {
  function normalizePhone(raw) {
    let p = String(raw).replace(/[\s\-().]/g, "");
    if (p.startsWith("+")) p = p.slice(1);
    if (p.startsWith("0")) p = "62" + p.slice(1);
    return p;
  }
  const isValidPhone = (raw) => /^62\d{8,13}$/.test(normalizePhone(raw));
  function todayISO() {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }
  function validateBooking(s) {
    const e = {};
    if (!s.name) e.name = "Please enter your full name.";
    if (!s.whatsapp) e.whatsapp = "Please enter your WhatsApp number.";
    else if (!isValidPhone(s.whatsapp)) e.whatsapp = "Please enter a valid Indonesian number, e.g. 08123456789.";
    if (!s.service) e.service = "Please choose a service.";
    if (!s.date) e.date = "Please select a pickup date.";
    else if (s.date < todayISO()) e.date = "Please select today or a future date.";
    if (!s.time) e.time = "Please select a pickup time.";
    if (!s.pickup) e.pickup = "Please enter the pickup location.";
    if (!s.destination) e.destination = "Please enter the destination.";
    else if (s.pickup && s.pickup.toLowerCase() === s.destination.toLowerCase())
      e.destination = "Pickup and destination appear to be the same. Please check the locations.";
    if (!(s.passengers >= 1 && s.passengers <= CONFIG.booking.maxPassengers))
      e.passengers = `Please enter 1 to ${CONFIG.booking.maxPassengers} passengers.`;
    return e;
  }
  return { normalizePhone, isValidPhone, todayISO, validateBooking };
})();
if (typeof module !== "undefined") module.exports = Validation;
