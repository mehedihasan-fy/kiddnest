"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, Phone, Building, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", companyName: "Kiddnest Enterprise",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "অ্যাকাউন্ট তৈরি করা সম্ভব হয়নি"); setLoading(false); return; }

      const loginRes = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const loginData = await loginRes.json();
      if (loginRes.ok && loginData.user) {
        localStorage.setItem("kiddnest_user", JSON.stringify(loginData.user));
        window.location.href = "/";
      } else router.push("/login");
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।"); setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-kn-ink tracking-tight">
          আমাদের পরিবারে যোগ দিন <span className="inline-block animate-float-slow">💕</span>
        </h2>
        <p className="text-sm text-kn-muted mt-2 font-semibold">নতুন অ্যাকাউন্ট খুলুন — small things, happy feelings</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-[0_4px_24px_rgba(46,58,77,0.08)] rounded-3xl border border-kn-border hover:shadow-[0_8px_32px_rgba(46,58,77,0.10)] transition-shadow">
          {error && (
            <div className="mb-4 bg-kn-coral/10 border border-kn-coral/30 rounded-xl p-3 flex items-center gap-2.5 text-kn-coral-deep text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" /><span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            {[
              { key: "name", label: "আপনার পুরো নাম *", type: "text", icon: User, placeholder: "যেমন: তানভীর আহমেদ", required: true },
              { key: "companyName", label: "কোম্পানির নাম", type: "text", icon: Building, placeholder: "Kiddnest Enterprise" },
              { key: "phone", label: "মোবাইল নম্বর", type: "text", icon: Phone, placeholder: "017xxxxxxxx" },
              { key: "email", label: "ইমেইল অ্যাড্রেস *", type: "email", icon: Mail, placeholder: "user@kiddnest.com", required: true },
              { key: "password", label: "পাসওয়ার্ড *", type: "password", icon: Lock, placeholder: "কমপক্ষে ৬ অক্ষর", required: true, min: 6 },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.key}>
                  <label className="block text-xs font-extrabold text-kn-ink mb-1 uppercase tracking-wider">{f.label}</label>
                  <div className="relative">
                    <Icon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-kn-sky-deep" />
                    <input
                      type={f.type} required={f.required} minLength={f.min}
                      value={(form as any)[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full bg-kn-bg border border-kn-border rounded-xl pl-11 pr-4 py-2 text-sm text-kn-ink placeholder:text-kn-muted/70 focus:outline-none focus:border-kn-coral focus:ring-4 focus:ring-kn-coral/15 transition-all"
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full bg-kn-coral hover:bg-kn-coral-deep text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-kn-coral/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer hover:-translate-y-0.5 active:translate-y-0">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><span>রেজিস্ট্রেশন সম্পন্ন করুন</span><ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-kn-border">
            <p className="text-sm text-kn-muted text-center font-semibold">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link href="/login" className="font-extrabold text-kn-coral hover:text-kn-coral-deep transition-colors underline decoration-kn-coral/30 decoration-2 underline-offset-2">লগইন করুন</Link>
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
