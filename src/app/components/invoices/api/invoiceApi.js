// =============================================================================
// Invoice API – calls your CAP / Node backend:
//   POST http://localhost:4004/account-invoice/getInvoice
//   body: { "accountId": "12345" }
//
// Returns a list of objects in the shape:
//   {
//     Invoice_id, Invoice_desc, Display_id, Invoice_Status,
//     InvoiceTotalUSD, InvoiceTotalCAD, InvoiceDueDate, InvoiceDate
//   }
// =============================================================================

const BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_INVOICE_API) ||
  "http://localhost:4004";

/**
 * Fetch invoices for a given account id.
 * @param {string} accountId
 * @returns {Promise<Array>}
 */
export async function getInvoicesByAccount(accountId) {
  const res = await fetch(`${BASE_URL}/account-invoice/getInvoice`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accountId }),
  });

  if (!res.ok) {
    throw new Error(`getInvoice failed: HTTP ${res.status}`);
  }

  const json = await res.json();
  // CAP usually returns { value: [...] } — fall back to array/data shapes too.
  return json.value ?? json.data ?? json ?? [];
}
