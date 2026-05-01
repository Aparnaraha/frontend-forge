// Formatting + record mapping utilities.

export const formatPrice = (price, currency = "USD") => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${currency} ${price}`;
  }
};

export const cycleSuffix = (c) =>
  c === "annually" ? "yr" : c === "quarterly" ? "qtr" : "mo";

export const BILLING_CYCLE_MAP = {
  monthly: "monthly",
  annually: "annually",
  quarterly: "quarterly",
  yearly: "annually",
  "one-time": "monthly",
};

/**
 * Maps the raw CAP record to a flat row used by the list view.
 */
export function mapPricing(p) {
  return {
    id:             p.ID             ?? "—",
    conditionType:  p.conditionType  ?? "—",
    name:           p.name           ?? "(unnamed)",
    description:   p.description    ?? "",
    price:          p.price          ?? 0,
    currency:       p.currency       ?? "USD",
    billingCycle:   p.billingCycle   ?? "monthly",
    validFrom:      p.validFrom      ? p.validFrom.slice(0, 10) : "—",
    validTo:        p.validTo        ? p.validTo.slice(0, 10)   : "—",
    salesOrg:       p.salesOrg       ?? "—",
    pricingStatus:  p.PricingStatus  ?? "Pending",
    approvalStatus: p.ApprovalStatus ?? "Not_Started",
    updatedAt:      p.modifiedAt
                      ? p.modifiedAt.slice(0, 10)
                      : p.createdAt
                      ? p.createdAt.slice(0, 10)
                      : "—",
    updatedBy:      p.requestedBy
                      ? `${p.requestedBy.firstName ?? ""} ${p.requestedBy.lastName ?? ""}`.trim() || "—"
                      : p.requestedBy_ID
                      ? `UID ${String(p.requestedBy_ID).slice(0, 6)}`
                      : "—",
  };
}
