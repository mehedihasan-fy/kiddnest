"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Building, MapPin, Lock, CheckCircle2, AlertCircle, Save, Shield } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    companyName: "",
    address: "",
    oldPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("kiddnest_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setForm({
        name: parsed.name || "",
        phone: parsed.phone || "",
        companyName: parsed.companyName || "",
        address: parsed.address || "",
        oldPassword: "",
        newPassword: "",
      });
    } else {
      window.location.href = "/login";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          name: form.name,
          phone: form.phone,
          companyName: form.companyName,
          address: form.address,
          oldPassword: form.oldPassword ? form.oldPassword : undefined,
          newPassword: form.newPassword ? form.newPassword : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "আপডেট ব্যর্থ হয়েছে");
        setLoading(false);
        return;
      }

      setUser(data);
      localStorage.setItem("kiddnest_user", JSON.stringify(data));
      setSuccess("আপনার প্রোফাইল ও তথ্য সফলভাবে আপডেট করা হয়েছে!");
      setForm((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
      setLoading(false);
    } catch (err) {
      setError("সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-600/20">
            {user.name?.[0] || "U"}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>{user.name}</span>
              <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" /> {user.role?.toUpperCase() || "ADMIN"}
              </span>
            </h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900 border-b pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" /> ব্যক্তিগত ও ব্যবসায়িক তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পুরো নাম
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ইমেইল (পরিবর্তনযোগ্য নয়)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="input-field pl-9 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                মোবাইল নম্বর
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="017xxxxxxxx"
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                কোম্পানির নাম
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ঠিকানা
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="আপনার ঠিকানা লিখুন..."
                  className="input-field pl-9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security / Password Change */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <h2 className="text-base font-semibold text-gray-900 border-b pb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" /> পাসওয়ার্ড পরিবর্তন (ঐচ্ছিক)
          </h2>
          <p className="text-xs text-gray-500 -mt-2">
            পাসওয়ার্ড পরিবর্তন করতে না চাইলে নিচের ঘরগুলো ফাঁকা রাখুন।
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                বর্তমান পাসওয়ার্ড
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.oldPassword}
                onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type="password"
                placeholder="কমপক্ষে ৬ অক্ষর"
                minLength={6}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-2.5 px-6 rounded-xl text-base shadow-lg shadow-blue-600/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                সংরক্ষণ হচ্ছে...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" /> পরিবর্তন সংরক্ষণ করুন
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
