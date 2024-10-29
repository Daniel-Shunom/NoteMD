import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientAuthProvider from "./ClientAuthProvider";
import SidebarWrapper from "./SideBarWrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NoteMD",
  description: "Doctor care, at your screen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientAuthProvider>
          <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <SidebarWrapper />
            <div className="flex-1 p-4 md:p-6 h-full overflow-y-auto">
              {children}
            </div>
          </div>
        </ClientAuthProvider>
      </body>
    </html>
  );
}
