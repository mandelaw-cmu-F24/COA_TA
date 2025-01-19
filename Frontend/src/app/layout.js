import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Bell } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E-Wallet",
  description: "Personal Electronic Wallet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen relative">
          {/* Fixed Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-64">
            <header className="fixed top-0 right-0 left-64 bg-white border-b z-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end h-16">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Bell className="w-5 h-5 text-gray-600" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                        2
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-[#EBF3FF] flex items-center justify-center">
                      <span className="text-sm font-medium text-[#1677FF]">
                        EK
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main className="pt-16 bg-gray-50 min-h-screen">
              <div className="p-6">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
