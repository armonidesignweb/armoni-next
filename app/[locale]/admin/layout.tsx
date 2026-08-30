/**
 * Admin Layout - completely isolated from public site Header/Footer/TopBar.
 * This layout wraps ALL /admin routes (login + protected dashboard).
 * It renders ONLY {children} with no public site chrome.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
