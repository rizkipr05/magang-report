export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: 420,
          padding: 20,
          border: "1px solid #eee",
          borderRadius: 12,
        }}
      >
        {children}
      </div>
    </div>
  );
}
