const PricingService = (() => {
  const billableDistance = (km, tripType) => (tripType === "round-trip" ? km * 2 : km);
  const calculateDistanceCost = (km, tripType) =>
    Math.round(billableDistance(km, tripType) * CONFIG.pricing.pricePerKm);
  const calculateWaitingCost = (h) =>
    h <= 0 ? 0 : CONFIG.pricing.firstWaitingHour + (h - 1) * CONFIG.pricing.additionalWaitingHour;
  const calculateTotalFare = (distanceCost, waitingCost) => distanceCost + waitingCost;
  function calculateFare({ distanceKm, tripType, waitingHours }) {
    const distanceCost = calculateDistanceCost(distanceKm, tripType);
    const waitingCost = calculateWaitingCost(waitingHours);
    return { distanceKm, billableDistanceKm: billableDistance(distanceKm, tripType), distanceCost, waitingCost,
      estimatedTotal: calculateTotalFare(distanceCost, waitingCost) };
  }
  const formatRupiah = (n) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })
      .format(n).replace(/\s/g, "");
  return { calculateDistanceCost, calculateWaitingCost, calculateTotalFare, calculateFare, formatRupiah };
})();
if (typeof module !== "undefined") module.exports = PricingService;
