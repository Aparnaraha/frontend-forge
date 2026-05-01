import { PricingTableRow } from "./PricingTableRow";

const HEAD = [
  "Condition ID", "Type", "Description", "Sales Org.", "Validity",
  { label: "Amount", align: "right" }, "Status", "Approval", "Last Changed", "",
];

export function PricingTable({ rows, role, busyId, onAction }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {HEAD.map((h, i) => {
              const label = typeof h === "string" ? h : h.label;
              const align = typeof h === "object" && h.align === "right" ? "text-right" : "text-left";
              return (
                <th key={i} className={`px-4 py-2.5 ${align}`}>{label}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <PricingTableRow
              key={p.id}
              p={p}
              role={role}
              busy={busyId === p.id}
              onAction={onAction}
            />
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={HEAD.length} className="px-4 py-12 text-center text-sm text-muted-foreground">
                No conditions match the current filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
