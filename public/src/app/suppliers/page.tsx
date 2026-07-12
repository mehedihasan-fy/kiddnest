"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Truck, Mail, Phone, MapPin, Building } from "lucide-react";

interface Supplier {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
  createdAt: string;
}

const emptyForm = { name: "", email: "", phone: "", address: "", company: "" };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    const res = await fetch("/api/suppliers");
    setSuppliers(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (s: Supplier) => {
    setForm({ name: s.name, email: s.email || "", phone: s.phone || "", address: s.address || "", company: s.company || "" });
    setEditingId(s.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/suppliers", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: editingId }),
    });
    if (res.ok) { setShowModal(false); fetchData(); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই সরবরাহকারী মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/suppliers?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">সরবরাহকারী</h1>
          <p className="text-gray-500 text-sm mt-1">সরবরাহকারীদের তথ্য ব্যবস্থাপনা</p>
        </div>
        <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" /> নতুন সরবরাহকারী</button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">লোড হচ্ছে...</div>
        ) : suppliers.length === 0 ? (
          <div className="p-12 text-center">
            <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">কোনো সরবরাহকারী নেই</p>
            <button onClick={openNew} className="btn-primary mt-4"><Plus className="w-4 h-4" /> যোগ করুন</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="table-header">নাম</th>
                  <th className="table-header">কোম্পানি</th>
                  <th className="table-header">ইমেইল</th>
                  <th className="table-header">ফোন</th>
                  <th className="table-header">ঠিকানা</th>
                  <th className="table-header text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="table-cell font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {s.name[0]}
                        </div>
                        {s.name}
                      </div>
                    </td>
                    <td className="table-cell">{s.company || "—"}</td>
                    <td className="table-cell text-gray-500">{s.email || "—"}</td>
                    <td className="table-cell text-gray-500">{s.phone || "—"}</td>
                    <td className="table-cell text-gray-500 max-w-[200px] truncate">{s.address || "—"}</td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editingId ? "সরবরাহকারী সম্পাদনা" : "নতুন সরবরাহকারী"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">নাম *</label>
                  <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">কোম্পানি</label>
                  <input className="input-field" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                  <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ফোন</label>
                  <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ঠিকানা</label>
                  <textarea rows={2} className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">বাতিল</button>
                <button type="submit" className="btn-primary">{editingId ? "আপডেট" : "সংরক্ষণ"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
