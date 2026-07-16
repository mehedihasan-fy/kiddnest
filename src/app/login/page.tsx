"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@kiddnest.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "লগইন ব্যর্থ হয়েছে"); setLoading(false); return; }

      localStorage.setItem("kiddnest_user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-kn-ink tracking-tight">
          আবার স্বাগতম! <span className="inline-block animate-float-slow">🎉</span>
        </h2>
        <p className="text-sm text-kn-muted mt-2 font-semibold">
          small things, happy feelings — আপনার অ্যাকাউন্টে প্রবেশ করুন
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-[0_4px_24px_rgba(46,58,77,0.08)] rounded-3xl border border-kn-border hover:shadow-[0_8px_32px_rgba(46,58,77,0.10)] transition-shadow">
          {error && (
            <div className="mb-4 bg-kn-coral/10 border border-kn-coral/30 rounded-xl p-3 flex items-center gap-2.5 text-kn-coral-deep text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" /><span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-extrabold text-kn-ink mb-1.5 uppercase tracking-wider">ইমেইল</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-kn-sky-deep" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kiddnest.com"
                  className="w-full bg-kn-bg border border-kn-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-kn-ink placeholder:text-kn-muted/70 focus:outline-none focus:border-kn-coral focus:ring-4 focus:ring-kn-coral/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-kn-ink mb-1.5 uppercase tracking-wider">পাসওয়ার্ড</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-kn-sky-deep" />
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-kn-bg border border-kn-border rounded-xl pl-11 pr-4 py-2.5 text-sm text-kn-ink placeholder:text-kn-muted/70 focus:outline-none focus:border-kn-coral focus:ring-4 focus:ring-kn-coral/15 transition-all"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-kn-coral hover:bg-kn-coral-deep text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-kn-coral/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><span>প্রবেশ করুন</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-kn-border">
            <div className="bg-kn-bg border border-kn-border rounded-xl p-3 text-xs text-kn-ink flex items-center justify-center gap-2 font-bold">
              <Sparkles className="w-4 h-4 text-kn-giraffe shrink-0" />
              <span>ডিফল্ট: <strong className="text-kn-coral">admin@kiddnest.com</strong> / <strong className="text-kn-sky-deep">123456</strong></span>
            </div>

            <p className="mt-4 text-sm text-kn-muted text-center font-semibold">
              অ্যাকাউন্ট নেই?{" "}
              <Link href="/register" className="font-extrabold text-kn-coral hover:text-kn-coral-deep transition-colors underline decoration-kn-coral/30 decoration-2 underline-offset-2">
                নতুন অ্যাকাউন্ট খুলুন
              </Link>
            </p>

            <Link href="/" className="mt-3 flex items-center justify-center gap-1.5 text-xs text-kn-muted hover:text-kn-sky-deep font-bold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /><span>লগইন ছাড়াই ড্যাশবোর্ডে যান</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
