import { useNavigate } from "react-router-dom";
import { ShellHeader } from "./ShellHeader";
import { Sidebar } from "./Sidebar";
import { getSession, logout } from "../../lib/auth";

/**
 * Standard app shell: header + sidebar + main scroll area.
 */
export function Shell({ pendingCount = 0, children }) {
  const navigate = useNavigate();
  const session = getSession();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <ShellHeader user={session?.user ?? session} onLogout={handleLogout} />
      <div className="flex min-h-0 flex-1">
        <Sidebar pendingCount={pendingCount} />
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
