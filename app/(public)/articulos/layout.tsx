// This layout is intentionally minimal to allow dynamic metadata handling
// Metadata is managed at the page level with client-side updates
export default function ArticulosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
