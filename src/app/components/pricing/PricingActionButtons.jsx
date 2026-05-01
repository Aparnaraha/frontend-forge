import { Button } from "../ui/Button";

/**
 * Action buttons for the detail page header. Each button is rendered only
 * when its corresponding capability flag is true.
 */
export function PricingActionButtons({
  busy,
  caps: { canSubmit, canApprove, canRevision, canReject, canWithdraw, canExpire, canDelete },
  onAction,
  onDelete,
}) {
  return (
    <>
      {canSubmit && (
        <Button variant="primary" size="sm" disabled={busy} onClick={() => onAction("submitPricing")}>
          ➤ Submit for Approval
        </Button>
      )}
      {canApprove && (
        <Button variant="success" size="sm" disabled={busy} onClick={() => onAction("approvePricing")}>
          ✓ Approve
        </Button>
      )}
      {canRevision && (
        <Button size="sm" disabled={busy} onClick={() => onAction("revision")}>
          ↩ Send for Revision
        </Button>
      )}
      {canReject && (
        <Button
          variant="danger"
          size="sm"
          disabled={busy}
          onClick={() => {
            const reason = window.prompt("Reason for rejection:");
            if (reason !== null) onAction("rejectPricing", { reason });
          }}
        >
          ✕ Reject
        </Button>
      )}
      {canWithdraw && (
        <Button size="sm" disabled={busy} onClick={() => onAction("withdrawPricing")}>
          ↩ Withdraw
        </Button>
      )}
      {canExpire && (
        <Button size="sm" disabled={busy} onClick={() => onAction("expirePricing")}>
          ⏱ Mark Expired
        </Button>
      )}
      {canDelete && (
        <Button variant="danger" size="sm" disabled={busy} onClick={onDelete}>
          🗑 Delete
        </Button>
      )}
    </>
  );
}
