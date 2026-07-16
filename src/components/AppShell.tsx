"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LogIn,
  Home,
  UserPlus,
  Heart,
} from "lucide-react";

const mainMenuItems = [
  { href: "/", label: "ড্যাশবোর্ড", icon: LayoutDashboard, tint: "coral" },
  { href: "/products", label: "পণ্যসমূহ", icon: Package, tint: "sky" },
  { href: "/categories", label: "ক্যাটাগরি", icon: Tags, tint: "giraffe" },
  { href: "/suppliers", label: "সরবরাহকারী", icon: Truck, tint: "koala" },
  { href: "/customers", label: "গ্রাহক", icon: Users, tint: "sky" },
  { href: "/purchases", label: "ক্রয় আদেশ", icon: ShoppingCart, tint: "giraffe" },
  { href: "/sales", label: "বিক্রয় আদেশ", icon: Receipt, tint: "coral" },
  { href: "/profile", label: "প্রোফাইল ও সেটিংস", icon: UserIcon, tint: "koala" },
] as const;

const tintMap: Record<string, string> = {
  coral: "bg-kn-coral/10 text-kn-coral",
  sky: "bg-kn-sky/10 text-kn-sky-deep",
  giraffe: "bg-kn-giraffe/15 text-[#C97A2E]",
  koala: "bg-kn-koala/15 text-[#4F8B6B]",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("kiddnest_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { setUser(null); }
    }
  }, [pathname, isAuthPage]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("kiddnest_user");
    document.cookie = "kiddnest_user=; Max-Age=0; path=/;";
    setUser(null);
    router.push("/login");
  };

  if (!mounted) return <div className="min-h-screen bg-kn-bg">{children}</div>;

  // AUTH LAYOUT
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-kn-bg">
        {/* ambient blobs that match the logo palette */}
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-kn-pigpink/40 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-kn-sky/25 rounded-full blur-3xl pointer-events-none animate-float-slower" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-kn-giraffe/20 rounded-full blur-3xl pointer-events-none animate-float-slow" />

        <header className="relative z-30 h-20 px-4 sm:px-8 flex items-center justify-between border-b border-kn-border/70 bg-white/60 backdrop-blur-md">
          <Link href="/" className="group flex items-center">
            <div className="relative h-14 w-48 sm:w-56 transition-transform duration-300 group-hover:scale-[1.04]">
              <Image src="/logo.png" alt="Kiddnest — small things, happy feelings!" fill className="object-contain object-left" priority />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-full bg-white hover:bg-kn-bg text-kn-ink text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 border border-kn-border shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Home className="w-4 h-4 text-kn-sky-deep" />
              <span className="hidden sm:inline">ড্যাশবোর্ড</span>
            </Link>
            {pathname === "/login" ? (
              <Link href="/register" className="px-3.5 py-2 rounded-full bg-kn-coral hover:bg-kn-coral-deep text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-md shadow-kn-coral/30 hover:-translate-y-0.5">
                <UserPlus className="w-4 h-4" /><span>রেজিস্ট্রেশন</span>
              </Link>
            ) : (
              <Link href="/login" className="px-3.5 py-2 rounded-full bg-kn-coral hover:bg-kn-coral-deep text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shadow-md shadow-kn-coral/30 hover:-translate-y-0.5">
                <LogIn className="w-4 h-4" /><span>লগইন</span>
              </Link>
            )}
          </div>
        </header>
        <main className="relative z-10 flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  // APP LAYOUT
  return (
    <div className="min-h-screen flex flex-col relative bg-kn-bg">
      {/* ambient floating blobs, pulled from logo colors */}
      <div className="fixed -top-20 right-0 w-[32rem] h-[32rem] bg-kn-sky/20 rounded-full blur-3xl pointer-events-none -z-0 animate-float-slower" />
      <div className="fixed bottom-0 left-1/4 w-[28rem] h-[28rem] bg-kn-pigpink/30 rounded-full blur-3xl pointer-events-none -z-0 animate-float-slow" />
      <div className="fixed top-1/2 right-1/3 w-80 h-80 bg-kn-giraffe/15 rounded-full blur-3xl pointer-events-none -z-0 animate-float-slower" />

      {/* MOBILE TOP NAVBAR — transparent frosted, logo blends with bg */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 z-40 px-3 flex items-center justify-between bg-kn-bg/80 backdrop-blur-md border-b border-kn-border/70">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-1.5 bg-white hover:bg-kn-sky/10 border border-kn-border text-kn-ink px-3 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <Menu className="w-4 h-4 shrink-0 text-kn-coral" />
            <span>মেনু</span>
          </button>
          <Link href="/" className="flex items-center ml-1">
            <div className="relative h-10 w-32 sm:w-36 transition-transform duration-300 hover:scale-[1.04]">
              <Image src="/logo.png" alt="Kiddnest" fill className="object-contain object-left" priority />
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-1.5 bg-white hover:bg-kn-bg px-3 py-1.5 rounded-full border border-kn-border text-xs font-bold text-kn-ink transition-all max-w-[110px] shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <div className="w-5 h-5 bg-kn-coral text-white rounded-full flex items-center justify-center font-extrabold text-[10px] shrink-0">
                  {user.name?.[0] || "U"}
                </div>
                <span className="truncate">{user.name}</span>
              </Link>
              <button onClick={handleLogout} title="লগআউট" className="p-1.5 bg-white text-kn-coral hover:bg-kn-coral hover:text-white rounded-full transition-all border border-kn-border shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 bg-kn-coral hover:bg-kn-coral-deep text-white px-3 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-md shadow-kn-coral/30 hover:-translate-y-0.5">
              <LogIn className="w-4 h-4" /><span>লগইন</span>
            </Link>
          )}
        </div>
      </header>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 bg-kn-ink/40 backdrop-blur-sm z-50 transition-opacity" />
      )}

      {/* SIDEBAR — white surface, logo flush on bg-matching strip */}
      <aside
        className={`fixed top-0 bottom-0 left-0 transition-all duration-300 z-50 flex flex-col bg-kn-surface border-r border-kn-border shadow-xl lg:shadow-none ${
          mobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-[80px]" : "lg:w-[260px]"}`}
      >
        {/* Logo strip — uses same bg color as the logo so it appears seamless */}
        <div className="flex items-center justify-between px-4 py-4 shrink-0 bg-kn-bg">
          <Link href="/" className="flex items-center gap-2 group">
            {!collapsed ? (
              <div className="relative h-12 w-44 transition-transform duration-300 group-hover:scale-[1.04]">
                <Image src="/logo.png" alt="Kiddnest" fill className="object-contain object-left" priority />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-kn-bg border border-kn-border flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
                🦒
              </div>
            )}
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 text-kn-muted hover:text-kn-coral hover:bg-kn-bg rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        {!collapsed && (
          <div className="mx-3 mt-2 p-3 bg-white rounded-2xl border border-kn-border shrink-0 shadow-[0_1px_2px_rgba(46,58,77,0.04)]">
            {user ? (
              <div className="space-y-3">
                <Link href="/profile" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-kn-coral text-white rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md shadow-kn-coral/30 group-hover:scale-105 transition-transform">
                    {user.name?.[0] || "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold truncate text-kn-ink group-hover:text-kn-coral transition-colors">{user.name}</p>
                    <p className="text-[11px] text-kn-muted truncate mt-0.5">{user.companyName || user.email}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 pt-2 border-t border-kn-border">
                  <Link href="/profile" className="flex-1 bg-kn-bg hover:bg-kn-sky/10 text-kn-ink hover:text-kn-sky-deep py-1.5 px-2.5 rounded-xl text-xs font-extrabold text-center transition-colors border border-kn-border">
                    প্রোফাইল
                  </Link>
                  <button onClick={handleLogout} className="flex items-center justify-center gap-1.5 bg-kn-coral/10 hover:bg-kn-coral text-kn-coral hover:text-white py-1.5 px-2.5 rounded-xl text-xs font-extrabold transition-all border border-kn-coral/20 hover:border-kn-coral">
                    <LogOut className="w-3.5 h-3.5" /><span>লগআউট</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-1 space-y-2.5">
                <p className="text-xs text-kn-muted font-bold flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 text-kn-coral fill-kn-coral" />
                  স্বাগতম! গেস্ট হিসেবে আছেন
                </p>
                <div className="flex gap-2">
                  <Link href="/login" className="flex-1 bg-kn-coral hover:bg-kn-coral-deep text-white py-2 px-3 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-kn-coral/30 hover:-translate-y-0.5 flex items-center justify-center gap-1.5">
                    <LogIn className="w-3.5 h-3.5" /><span>লগইন</span>
                  </Link>
                  <Link href="/register" className="flex-1 bg-white hover:bg-kn-koala/10 text-kn-ink hover:text-[#4F8B6B] py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center border border-kn-border">
                    রেজিস্টার
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu header */}
        <div className="px-4 py-2 text-[10px] font-extrabold text-kn-muted uppercase tracking-[0.12em] mt-3 shrink-0">
          {!collapsed && "নেভিগেশন"}
        </div>

        {/* Menu */}
        <nav className="flex-1 pb-4 px-3 space-y-1 overflow-y-auto">
          {mainMenuItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-bold ${
                  isActive
                    ? "bg-kn-ink text-white shadow-lg shadow-kn-ink/20"
                    : "text-kn-ink hover:bg-kn-bg"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                  isActive ? "bg-white/15 text-white" : `${tintMap[item.tint]} group-hover:scale-110`
                }`}>
                  <Icon className="w-[18px] h-[18px]" />
                </span>
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {isActive && !collapsed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-kn-coral animate-pulse" />
                )}
              </Link>
            );
          })}

          {!collapsed && (
            <div className="pt-3 mt-3 border-t border-kn-border space-y-1">
              {user ? (
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-extrabold text-kn-coral hover:bg-kn-coral/10 transition-colors text-left group">
                  <span className="w-8 h-8 rounded-lg bg-kn-coral/10 text-kn-coral group-hover:bg-kn-coral group-hover:text-white transition-colors flex items-center justify-center">
                    <LogOut className="w-[18px] h-[18px]" />
                  </span>
                  <span>লগআউট করুন</span>
                </button>
              ) : (
                <>
                  <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-extrabold text-kn-sky-deep hover:bg-kn-sky/10 transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-kn-sky/10 text-kn-sky-deep group-hover:bg-kn-sky group-hover:text-white transition-colors flex items-center justify-center">
                      <LogIn className="w-[18px] h-[18px]" />
                    </span>
                    <span>লগইন করুন</span>
                  </Link>
                  <Link href="/register" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-extrabold text-[#4F8B6B] hover:bg-kn-koala/15 transition-colors group">
                    <span className="w-8 h-8 rounded-lg bg-kn-koala/15 text-[#4F8B6B] group-hover:bg-kn-koala group-hover:text-white transition-colors flex items-center justify-center">
                      <UserPlus className="w-[18px] h-[18px]" />
                    </span>
                    <span>নতুন অ্যাকাউন্ট</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center py-3 border-t border-kn-border text-kn-muted hover:text-kn-coral hover:bg-kn-bg transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </aside>

      {/* Main content */}
      <main className="relative z-10 flex-1 transition-all duration-300 pt-16 lg:pt-0 lg:ml-[260px] flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
