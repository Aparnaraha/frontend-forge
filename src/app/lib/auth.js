// Session stub. Replace with real auth.
// Returns a fake admin so the UI can be exercised end-to-end.

const FAKE_SESSION = {
  user: {
    ID: "00000000-0000-0000-0000-000000000001",
    firstName: "Demo",
    lastName: "User",
    role: "Admin",
    username: "demo.user",
    email: "demo@example.com",
  },
};

export function getSession() {
  return FAKE_SESSION;
}

export function logout() {
  // no-op stub
}
