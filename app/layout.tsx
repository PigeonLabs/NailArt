import type { Metadata } from "next";

import { AuthProvider } from "@/components/auth/auth-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "NailArt",
  description: "Thumbnail Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
