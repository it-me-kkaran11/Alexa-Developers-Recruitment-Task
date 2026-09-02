import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Workshop Registration Platform",
  description: "Register for professional workshops and events",
  keywords: "workshop, registration, training, events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
