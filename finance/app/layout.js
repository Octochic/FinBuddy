import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/header.jsx";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster as Sonner } from "sonner";


const inter = Inter({ subsets : ["latin"]});

export const metadata = {
  title: "FinBuddy",
  description: "One stop Finance Platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${inter.className} bg-blue-50`}
      >
        {/* {header} */}
        <Header />       
        <main className="min-h-screen">{children}</main>
        
        <Sonner richColors />
        {/* {footer} */}
        <footer className="bg-blue-100 py-12">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>Finance Solution </p>
        </div>
        </footer>
      </body>
    </html>
    </ClerkProvider> 
  );
}
