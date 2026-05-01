import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

/**
 * Computes available row actions based on status + role.
 */
function deriveActions({ p, role, onAction }) {
  const actions = [];

  if (p.pricingStatus === "Pending" && ["Admin", "Requestor"].includes(role)) {
    actions.push({ label: "Submit for Approval", fn: () => onAction("submitPricing", p.id) });
  }
  if (p.approvalStatus === "In_Approval" && ["Admin", "Approver"].includes(role)) {
    actions.push({ label: "Approve",           fn: () => onAction("approvePricing", p.id) });
    actions.push({ label: "Send for Revision", fn: () => onAction("revision",       p.id) });
    actions.push({
      label: "Reject",
      fn: () => {
        const reason = window.prompt("Enter rejection reason:");
        if (reason !== null) onAction("rejectPricing", p.id, { reason });
      },
    });
  }
  if (p.pricingStatus === "Submitted" && ["Admin", "Requestor"].includes(role)) {
    actions.push({ label: "Withdraw", fn: () => onAction("withdrawPricing", p.id) });
  }
  if (role === "Admin" && !["Completed", "Expired"].includes(p.pricingStatus)) {
    actions.push({ label: "Mark as Expired", fn: () => onAction("expirePricing", p.id) });
  }
  return actions;
}

export function RowActionsMenu({ p, role, onAction }) {
  const [open, setOpen] = useState(false);
  const actions = deriveActions({ p, role, onAction });

  if (actions.length === 0) {
    return (
      <Link to={`/pricing/${p.id}`}>
        <Button variant="ghost" size="sm" icon aria-label="View">✎</Button>
      </Link>
    );
  }

  return (
    <div className="relative inline-flex gap-1">
      <Link to={`/pricing/${p.id}`}>
        <Button variant="ghost" size="sm" icon aria-label="Edit">✎</Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        icon
        aria-label="More actions"
        onClick={() => setOpen((v) => !v)}
      >
        ⋯
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] rounded-md border border-border bg-popover py-1 shadow-lg">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={() => { setOpen(false); a.fn(); }}
                className="block w-full whitespace-nowrap px-3.5 py-2 text-left text-sm text-popover-foreground hover:bg-accent"
              >
                {a.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
