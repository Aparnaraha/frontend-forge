import { Link } from "react-router-dom";
import { Chip, StatusPill } from "../ui/StatusPill";
import { sLabel, sTone } from "../../lib/status";
import { PageHeader } from "../shell/PageHeader";

/**
 * Object header for the detail page.
 */
export function PricingDetailHeader({ record, form, shortId, updatedBy, updatedAt, actions }) {
  const pricingStatus  = record.PricingStatus  ?? "Pending";
  const approvalStatus = record.ApprovalStatus ?? "Not_Started";

  return (
    <PageHeader
      backLink={
        <Link to="/" className="mb-2 inline-block text-xs text-primary hover:underline">
          ← Back
        </Link>
      }
      title={
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold text-foreground">{record.name}</h1>
          <Chip>{shortId}</Chip>
          <StatusPill tone={sTone(pricingStatus)}>{sLabel(pricingStatus)}</StatusPill>
          <span className="text-xs text-muted-foreground">{approvalStatus.replace(/_/g, " ")}</span>
        </div>
      }
      meta={
        <>
          <span><strong className="font-medium text-foreground">Type:</strong> {record.conditionType ?? "—"}</span>
          <span><strong className="font-medium text-foreground">Sales Org.:</strong> {record.salesOrg ?? "—"}</span>
          <span><strong className="font-medium text-foreground">Validity:</strong> {form.validFrom} – {form.validTo}</span>
          <span><strong className="font-medium text-foreground">Last changed:</strong> {updatedAt} by {updatedBy}</span>
        </>
      }
      actions={actions}
    />
  );
}
