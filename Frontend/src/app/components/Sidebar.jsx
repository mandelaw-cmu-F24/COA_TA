"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  FileText,
  PieChart,
  Bell,
  Wallet,
  FolderTree,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Budgets", href: "/budgets", icon: PieChart },
    { name: "Categories", href: "/categories", icon: FolderTree },
  ];

  return (
    <div className="flex flex-col w-64 border-r bg-white h-full min-h-screen">
      {/* Logo */}
      <div className="p-4">
        <Link href="/" className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-[#1677FF]" />
          <span className="text-xl font-medium text-gray-900">MyWallet</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#EBF3FF] text-[#1677FF]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
