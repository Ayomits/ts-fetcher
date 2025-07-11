import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ts fetcher",
  description: "Documentation for ts-fetcher package",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
