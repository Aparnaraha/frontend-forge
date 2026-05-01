import { Link } from "react-router-dom";
import { StatusPill } from "../ui/StatusPill";
import { sLabel, sTone } from "../../lib/status";
import { formatPrice, cycleSuffix } from "../../lib/format";
import { RowActionsMenu } from "./RowActionsMenu";
import { cn } from "@/lib/utils";

export function PricingTableRow({ p, role, busy, onAction }) {
  return (
    <tr className={cn("border-b border-border last:border-0 hover:bg-accent/40", busy && "opacity-50 transition-opacity")}>
      <td className="px-4 py-3 align-top">
        <Link
          to={`/pricing/${p.id}`}
          className="font-mono text-xs font-semibold text-primary hover:underline"
        >
          {String(p.id).slice(0, 8).toUpperCase()}
        </Link>
      </td>
      <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">{p.conditionType}</td>
      <td className="px-4 py-3 align-top">
        <div className="text-sm font-medium text-foreground">{p.name}</div>
        {p.description && <div className="text-xs text-muted-foreground">{p.description}</div>}
      </td>
      <td className="px-4 py-3 align-top text-sm text-muted-foreground">{p.salesOrg}</td>
      <td className="whitespace-nowrap px-4 py-3 align-top text-xs text-muted-foreground">
        {p.validFrom} – {p.validTo}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-right align-top">
        <span className="text-sm font-semibold text-foreground">{formatPrice(p.price, p.currency)}</span>
        <span className="ml-1 text-xs text-muted-foreground">/{cycleSuffix(p.billingCycle)}</span>
      </td>
      <td className="px-4 py-3 align-top">
        <StatusPill tone={sTone(p.pricingStatus)}>{sLabel(p.pricingStatus)}</StatusPill>
      </td>
      <td className="px-4 py-3 align-top text-xs text-muted-foreground">
        {p.approvalStatus.replace(/_/g, " ")}
      </td>
      <td className="px-4 py-3 align-top text-xs text-muted-foreground">
        <div className="whitespace-nowrap">{p.updatedAt}</div>
        <div>{p.updatedBy}</div>
      </td>
      <td className="px-4 py-3 text-right align-top">
        <RowActionsMenu p={p} role={role} onAction={onAction} />
      </td>
    </tr>
  );
}
