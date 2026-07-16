"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Package,
  AlertTriangle,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  categoryId: number | null;
  costPrice: string;
  sellingPrice: string;
  stockQuantity: number;
  lowStockThreshold: number;
  unit: string | null;
  categoryName: string | null;
}

interface Category {
  id: number;
  name: string;
}

const emptyProduct = {
  name: "",
  sku: "",
  description: "",
  categoryId: "",
  costPrice: "",
  sellingPrice: "",
  stockQuantity: "0",
  lowStockThreshold: "10",
  unit: "pcs",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const fetchProducts = useCallback(async () => {
    const params = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await fetch(`/api/products${params}`);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchProducts();
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, [fetchProducts]);

  const openNew = () => {
    setForm(emptyProduct);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      sku: p.sku,
      description: p.description || "",
      categoryId: p.categoryId?.toString() || "",
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      stockQuantity: p.stockQuantity.toString(),
      lowStockThreshold: p.lowStockThreshold.toString(),
      unit: p.unit || "pcs",
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      ...form,
      id: editingId,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      costPrice: parseFloat(form.costPrice) || 0,
      sellingPrice: parseFloat(form.sellingPrice) || 0,
      stockQuantity: parseInt(form.stockQuantity) || 0,
      lowStockThreshold: parseInt(form.lowStockThreshold) || 10,
    };

    const res = await fetch("/api/products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowModal(false);
      fetchProducts();
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই পণ্যটি মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchProducts();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">পণ্যসমূহ</h1>
          <p className="text-gray-500 text-sm mt-1">
            আপনার সকল পণ্যের তালিকা ও স্টক ব্যবস্থাপনা
          </p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus className="w-4 h-4" /> নতুন পণ্য
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="পণ্যের নাম বা SKU দিয়ে খুঁজুন..."
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">লোড হচ্ছে...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">কোনো পণ্য পাওয়া যায়নি</p>
            <button onClick={openNew} className="btn-primary mt-4">
              <Plus className="w-4 h-4" /> প্রথম পণ্য যোগ করুন
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="table-header">পণ্যের নাম</th>
                  <th className="table-header">SKU</th>
                  <th className="table-header">ক্যাটাগরি</th>
                  <th className="table-header">ক্রয়মূল্য</th>
                  <th className="table-header">বিক্রয়মূল্য</th>
                  <th className="table-header">স্টক</th>
                  <th className="table-header">একক</th>
                  <th className="table-header text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="table-cell font-medium text-gray-900">
                      {p.name}
                    </td>
                    <td className="table-cell font-mono text-xs">{p.sku}</td>
                    <td className="table-cell">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {p.categoryName || "—"}
                      </span>
                    </td>
                    <td className="table-cell">৳{parseFloat(p.costPrice).toLocaleString()}</td>
                    <td className="table-cell">৳{parseFloat(p.sellingPrice).toLocaleString()}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-1">
                        {p.stockQuantity <= p.lowStockThreshold && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span
                          className={`font-semibold ${
                            p.stockQuantity === 0
                              ? "text-red-600"
                              : p.stockQuantity <= p.lowStockThreshold
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {p.stockQuantity}
                        </span>
                      </div>
                    </td>
                    <td className="table-cell">{p.unit}</td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">
                {editingId ? "পণ্য সম্পাদনা" : "নতুন পণ্য"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    পণ্যের নাম *
                  </label>
                  <input
                    required
                    className="input-field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    required
                    className="input-field"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    className="input-field"
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm({ ...form, categoryId: e.target.value })
                    }
                  >
                    <option value="">নির্বাচন করুন</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ক্রয়মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={form.costPrice}
                    onChange={(e) =>
                      setForm({ ...form, costPrice: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    বিক্রয়মূল্য (৳)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input-field"
                    value={form.sellingPrice}
                    onChange={(e) =>
                      setForm({ ...form, sellingPrice: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    স্টক পরিমাণ
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.stockQuantity}
                    onChange={(e) =>
                      setForm({ ...form, stockQuantity: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    কম স্টক সীমা
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={form.lowStockThreshold}
                    onChange={(e) =>
                      setForm({ ...form, lowStockThreshold: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    একক
                  </label>
                  <select
                    className="input-field"
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  >
                    <option value="pcs">পিস</option>
                    <option value="kg">কেজি</option>
                    <option value="ltr">লিটার</option>
                    <option value="mtr">মিটার</option>
                    <option value="box">বক্স</option>
                    <option value="dozen">ডজন</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    বিবরণ
                  </label>
                  <textarea
                    rows={2}
                    className="input-field"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  বাতিল
                </button>
                <button type="submit" className="btn-primary">
                  {editingId ? "আপডেট করুন" : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
