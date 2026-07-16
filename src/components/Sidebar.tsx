"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  Users,
  Truck,
  ShoppingCart,
  Receipt,
  ChevronLeft,
  ChevronRight,
  BoxesIcon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { href: "/", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/products", label: "পণ্যসমূহ", icon: Package },
  { href: "/categories", label: "ক্যাটাগরি", icon: Tags },
  { href: "/suppliers", label: "সরবরাহকারী", icon: Truck },
  { href: "/customers", label: "গ্রাহক", icon: Users },
  { href: "/purchases", label: "ক্রয় আদেশ", icon: ShoppingCart },
  { href: "/sales", label: "বিক্রয় আদেশ", icon: Receipt },
  { href: "/profile", label: "প্রোফাইল ও সেটিংস", icon: UserIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // If on login/register page, do not show sidebar
  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const saved = localStorage.getItem("kiddnest_user");
    if (saved) {
      setUser(JSON.parse(saved));
    } else if (!isAuthPage) {
      router.push("/login");
    }
  }, [pathname, isAuthPage, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isAuthPage) return null;

  const handleLogout = () => {
    localStorage.removeItem("kiddnest_user");
    document.cookie = "kiddnest_user=; Max-Age=0; path=/;";
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Top Navbar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white z-40 px-4 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="p-2 -ml-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BoxesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-blue-400">Kiddnest</span>
          </div>
        </div>

        {/* Mobile User Short Profile & Logout */}
        {user && (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-slate-700 transition-colors"
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                {user.name?.[0] || "U"}
              </div>
              <span className="max-w-[100px] truncate">{user.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              title="লগআউট"
              className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </header>

      {/* Mobile Backdrop Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 bg-slate-900 text-white transition-all duration-300 z-50 flex flex-col shadow-2xl lg:shadow-none ${
          mobileOpen
            ? "translate-x-0 w-[260px]"
            : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-[72px]" : "lg:w-[260px]"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-blue-600 rounded-lg shrink-0 shadow-lg shadow-blue-600/30">
              <BoxesIcon className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold tracking-tight text-blue-400">Kiddnest</h1>
                <p className="text-[10px] text-slate-400 -mt-0.5">ইনভেন্টরি ম্যানেজমেন্ট</p>
              </div>
            )}
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Card inside sidebar */}
        {!collapsed && user && (
          <div className="mx-3 mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/50 flex items-center justify-between">
            <Link href="/profile" className="flex items-center gap-3 min-w-0 flex-1 group">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-blue-600/20">
                {user.name?.[0] || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate text-slate-100 group-hover:text-blue-400 transition-colors">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate -mt-0.5">{user.companyName || user.email}</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              title="লগআউট"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/50 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Bottom item when collapsed */}
        {collapsed && (
          <div className="px-3 py-2">
            <button
              onClick={handleLogout}
              title="লগআউট করুন"
              className="w-full flex items-center justify-center p-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Collapse Button (Desktop Only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center py-4 border-t border-slate-700/50 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </aside>
    </>
  );
}
