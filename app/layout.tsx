import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Space Booking",
  description: "Book coworking spaces, meeting rooms, and event venues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">Space Booking</Link>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/booking" className="hover:underline">Book</Link>
              <Link href="/dashboard" className="hover:underline">Dashboard</Link>
              <Link href="/signin" className="hover:underline">Sign In</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
