// =============================================================================
// Invoices API layer (SAP C4C v2 / CAP)
// -----------------------------------------------------------------------------
// Replace the body of `fetchInvoices` with a real call to your backend when
// you port this screen into your C4C/CAP project. Keep the return shape:
//
//   { value: RawInvoice[], count: number }
//
// where RawInvoice matches the dummy schema your backend returns:
//
//   {
//     Invoice_id:       string,   // backend invoice id (used for navigation)
//     Invoice_desc:     string,   // description
//     Display_id:       string,   // display id shown on the card
//     Invioce_Status:   string,   // e.g. "Open" | "Paid" | "Overdue" | "Draft"
//     InvoiceTotalUSD:  number|string,
//     InvoiceTotalCAD:  number|string,
//     InvoiceDueDate:   string,   // ISO date
//     InvoiceDate:      string,   // ISO date
//   }
// =============================================================================

import { DUMMY_INVOICES } from "./invoicesDummy";

const USE_DUMMY = true;

/**
 * EXAMPLE — SAP C4C v2 OData call you would use later:
 *
 *   GET /sap/c4c/odata/v1/c4codataapi/InvoiceCollection
 *        ?$top=4&$skip=0&$orderby=InvoiceDate desc
 *        &$filter=substringof('ABC',Display_id)
 *
 * Or your CAP service:
 *
 *   GET /odata/v4/invoice/Invoices?$top=4&$skip=0&$orderby=InvoiceDate desc
 */
export async function fetchInvoices({ page = 1, pageSize = 4, query = "", status = "all" } = {}) {
  if (USE_DUMMY) {
    // Simulate a backend call.
    await new Promise((r) => setTimeout(r, 250));

    let rows = DUMMY_INVOICES;

    if (status !== "all") {
      rows = rows.filter(
        (r) => (r.Invioce_Status || "").toLowerCase() === status.toLowerCase(),
      );
    }
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (r) =>
          (r.Display_id     || "").toLowerCase().includes(q) ||
          (r.Invoice_desc   || "").toLowerCase().includes(q) ||
          (r.Invoice_id     || "").toLowerCase().includes(q),
      );
    }

    const count = rows.length;
    const start = (page - 1) * pageSize;
    return { value: rows.slice(start, start + pageSize), count };
  }

  // ---- Real call (uncomment & adapt when wiring to backend) ------------------
  const top   = pageSize;
  const skip  = (page - 1) * pageSize;
  const url   =
    `/sap/c4c/odata/v1/c4codataapi/InvoiceCollection` +
    `?$top=${top}&$skip=${skip}&$inlinecount=allpages` +
    (status !== "all" ? `&$filter=Invioce_Status eq '${status}'` : "") +
    (query ? `&$filter=substringof('${query}',Display_id)` : "");
  
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return {
    value: json.d?.results ?? [],
    count: Number(json.d?.__count ?? json.d?.results?.length ?? 0),
  };
}

/**
 * Fetch a single invoice by backend id.
 * EXAMPLE: GET /sap/c4c/odata/v1/c4codataapi/InvoiceCollection('<id>')
 */
export async function fetchInvoiceById(id) {
  if (USE_DUMMY) {
    await new Promise((r) => setTimeout(r, 150));
    return DUMMY_INVOICES.find((x) => x.Invoice_id === id) ?? null;
  }
  
  const res = await fetch(`/sap/c4c/odata/v1/c4codataapi/InvoiceCollection('${id}')`, {
    headers: { Accept: "application/json" }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.d ?? null;
}
