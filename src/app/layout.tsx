'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { FirebaseProvider } from "@/firebase/provider";
import { LayoutProvider } from "./layout-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>EchoLive</title>
        <meta name="description" content="The ultimate livestream entertainment application." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "font-body antialiased overflow-x-hidden",
          inter.variable
        )}
      >
        <FirebaseProvider>
          <LayoutProvider>{children}</LayoutProvider>
           <Toaster />
        </FirebaseProvider>
      </body>
    </html>
  );
}
