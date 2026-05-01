import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * /pricing/new — there is no longer a dedicated page; create happens in a drawer
 * on the list page. This route just redirects so existing links keep working.
 *
 * The list reads ?create=1 to auto-open the drawer.
 */
export default function PricingNew() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/pricing?create=1", { replace: true });
  }, [navigate]);
  return null;
}
