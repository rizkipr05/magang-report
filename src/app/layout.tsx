import "./globals.css";

export const metadata = {
  title: "Sistem Pelaporan Magang",
  description: "Next.js + Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
