"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, X, ShoppingCart, MinusCircle, PlusCircle } from "lucide-react";

interface PurchaseOrder {
  id: number;
  orderNumber: string;
  supplierId: number | null;
  status: string;
  totalAmount: string;
  notes: string | null;
  orderDate: string;
  supplierName: string | null;
}

interface Supplier { id: number; name: string; }
interface Product { id: number; name: string; sku: string; costPrice: string; }
interface OrderItem { productId: string; quantity: string; unitPrice: string; }

function formatCurrency(v: string | number) {
  const n = typeof v === "string" ? parseFloat(v) : v;
  return `৳${n.toLocaleString("bn-BD")}`;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700", confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-yellow-100 text-yellow-700", delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    draft: "খসড়া", confirmed: "নিশ্চিত", shipped: "প্রেরিত",
    delivered: "ডেলিভারি", cancelled: "বাতিল",
  };
  return <span className={`status-badge ${colors[status] || ""}`}>{labels[status] || status}</span>;
}

export default function PurchasesPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ supplierId: "", status: "draft", notes: "" });
  const [items, setItems] = useState<OrderItem[]>([{ productId: "", quantity: "1", unitPrice: "0" }]);

  const fetchData = async () => {
    const [oRes, sRes, pRes] = await Promise.all([
      fetch("/api/purchases"), fetch("/api/suppliers"), fetch("/api/products"),
    ]);
    setOrders(await oRes.json());
    setSuppliers(await sRes.json());
    setProducts(await pRes.json());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = () => setItems([...items, { productId: "", quantity: "1", unitPrice: "0" }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: value };
    if (field === "productId") {
      const product = products.find((p) => p.id === parseInt(value));
      if (product) newItems[idx].unitPrice = product.costPrice;
    }
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items.filter((i) => i.productId && parseInt(i.quantity) > 0);
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplierId: form.supplierId ? parseInt(form.supplierId) : null,
        status: form.status,
        notes: form.notes,
        items: validItems.map((i) => ({
          productId: parseInt(i.productId),
          quantity: parseInt(i.quantity),
          unitPrice: parseFloat(i.unitPrice),
        })),
      }),
    });
    if (res.ok) {
      setShowModal(false);
      setForm({ supplierId: "", status: "draft", notes: "" });
      setItems([{ productId: "", quantity: "1", unitPrice: "0" }]);
      fetchData();
    }
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/purchases", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("এই ক্রয় আদেশ মুছে ফেলতে চান?")) return;
    await fetch(`/api/purchases?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ক্রয় আদেশ</h1>
          <p className="text-gray-500 text-sm mt-1">সরবরাহকারীদের কাছ থেকে পণ্য ক্রয়</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus className="w-4 h-4" /> নতুন ক্রয় আদেশ</button>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">লোড হচ্ছে...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">কোনো ক্রয় আদেশ নেই</p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-4"><Plus className="w-4 h-4" /> প্রথম ক্রয় আদেশ তৈরি করুন</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="table-header">অর্ডার নং</th>
                  <th className="table-header">সরবরাহকারী</th>
                  <th className="table-header">মোট</th>
                  <th className="table-header">স্ট্যাটাস</th>
                  <th className="table-header">তারিখ</th>
                  <th className="table-header text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="table-cell font-medium text-gray-900">{o.orderNumber}</td>
                    <td className="table-cell">{o.supplierName || "—"}</td>
                    <td className="table-cell font-semibold">{formatCurrency(o.totalAmount)}</td>
                    <td className="table-cell"><StatusBadge status={o.status} /></td>
                    <td className="table-cell text-gray-400">{new Date(o.orderDate).toLocaleDateString("bn-BD")}</td>
                    <td className="table-cell text-right">
                      <div className="flex items-center justify-end gap-1">
                        {o.status === "draft" && (
                          <button onClick={() => updateStatus(o.id, "confirmed")} className="btn-success text-xs py-1 px-2">নিশ্চিত</button>
                        )}
                        {o.status === "confirmed" && (
                          <button onClick={() => updateStatus(o.id, "delivered")} className="btn-primary text-xs py-1 px-2">ডেলিভারি</button>
                        )}
                        <button onClick={() => handleDelete(o.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">নতুন ক্রয় আদেশ</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">সরবরাহকারী</label>
                  <select className="input-field" value={form.supplierId} onChange={(e) => setForm({ ...form, supplierId: e.target.value })}>
                    <option value="">নির্বাচন করুন</option>
                    {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">স্ট্যাটাস</label>
                  <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">খসড়া</option>
                    <option value="confirmed">নিশ্চিত</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">পণ্যসমূহ</label>
                  <button type="button" onClick={addItem} className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
                    <PlusCircle className="w-4 h-4" /> পণ্য যোগ
                  </button>
                </div>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <select className="input-field flex-[3]" value={item.productId} onChange={(e) => updateItem(idx, "productId", e.target.value)}>
                        <option value="">পণ্য নির্বাচন</option>
                        {products.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                      </select>
                      <input type="number" min="1" placeholder="পরিমাণ" className="input-field flex-1" value={item.quantity} onChange={(e) => updateItem(idx, "quantity", e.target.value)} />
                      <input type="number" step="0.01" placeholder="মূল্য" className="input-field flex-1" value={item.unitPrice} onChange={(e) => updateItem(idx, "unitPrice", e.target.value)} />
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(idx)} className="p-1 text-red-400 hover:text-red-600">
                          <MinusCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">নোট</label>
                <textarea rows={2} className="input-field" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-lg font-bold">
                  <span>মোট:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">বাতিল</button>
                <button type="submit" className="btn-primary">ক্রয় আদেশ তৈরি করুন</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
