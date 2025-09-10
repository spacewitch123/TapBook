import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TapBook - Link in Bio for Local Services",
  description: "Create a professional page for your local service business in 30 seconds",
  keywords: ["link in bio", "local business", "services", "whatsapp", "booking"],
  authors: [{ name: "TapBook" }],
  creator: "TapBook",
  publisher: "TapBook",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}