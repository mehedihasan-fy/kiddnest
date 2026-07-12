"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Tags } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchData = async () => {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNew = () => {
    setForm({ name: "", description: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setForm({ name: c.name, description: c.description || "" });
    setEditingId(c.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/categories", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: editingId }),
    });
    if (res.ok) {
      setShowModal(false);
      fetchData();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই ক্যাটাগরি মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ক্যাটাগরি</h1>
          <p className="text-gray-500 text-sm mt-1">পণ্যের ক্যাটাগরি ব্যবস্থাপনা</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="w-4 h-4" /> নতুন ক্যাটাগরি
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">লোড হচ্ছে...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <Tags className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">কোনো ক্যাটাগরি নেই</p>
            <button onClick={openNew} className="btn-primary mt-4">
              <Plus className="w-4 h-4" /> প্রথম ক্যাটাগরি যোগ করুন
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="table-header">নাম</th>
                  <th className="table-header">বিবরণ</th>
                  <th className="table-header">তারিখ</th>
                  <th className="table-header text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="table-cell font-medium text-gray-900">{c.name}</td>
                    <td className="table-cell text-gray-500">{c.description || "—"}</td>
                    <td className="table-cell text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString("bn-BD")}
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">
                {editingId ? "ক্যাটাগরি সম্পাদনা" : "নতুন ক্যাটাগরি"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">নাম *</label>
                <input required className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ</label>
                <textarea rows={3} className="input-field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
