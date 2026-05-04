import { QnovateHeader } from "../qnovate/QnovateHeader";
import { QnovateTabs, HOME_TAB } from "../qnovate/QnovateTabs";
import { Tag, User, Receipt } from "lucide-react";
import { getSession } from "../../lib/auth";

/**
 * Page shell for all Pricing screens — header + tab strip + main scroll area.
 *
 * @param {{ extraTabs?: any[]; children: any }} props
 */
export function QnovateShell({ extraTabs = [], children }) {
  const session = getSession();

  const tabs = [
    HOME_TAB,
    { key: "pricing",  label: "Pricing",  to: "/pricing",  icon: Tag,     closable: true },
    { key: "invoices", label: "Invoices", to: "/invoices", icon: Receipt, closable: true },
    ...extraTabs,
  ];

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      <QnovateHeader user={session?.user} />
      <QnovateTabs tabs={tabs} />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
    </div>
  );
}

export const PRICING_DETAIL_TAB = (id, name) => ({
  key: `pricing-${id}`,
  sub: `Pricing | ${String(id).slice(0, 7)}`,
  label: name ?? "Detail",
  to: `/pricing/${id}`,
  icon: User,
  closable: true,
});
