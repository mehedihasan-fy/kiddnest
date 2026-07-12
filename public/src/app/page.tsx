"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Tags,
  Truck,
  Users,
  DollarSign,
  ShoppingCart,
  Receipt,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalSuppliers: number;
    totalCustomers: number;
    stockValue: string;
    totalPurchases: number;
    purchaseAmount: string;
    totalSales: number;
    salesAmount: string;
  };
  lowStockProducts: Array<{
    id: number;
    name: string;
    sku: string;
    stockQuantity: number;
    lowStockThreshold: number;
  }>;
  recentSales: Array<{
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: string;
    orderDate: string;
    customerName: string | null;
  }>;
  recentPurchases: Array<{
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: string;
    orderDate: string;
    supplierName: string | null;
  }>;
}

function formatCurrency(value: string | number) {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(num);
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-yellow-100 text-yellow-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    draft: "খসড়া",
    confirmed: "নিশ্চিত",
    shipped: "প্রেরিত",
    delivered: "ডেলিভারি",
    cancelled: "বাতিল",
  };

  return (
    <span className={`status-badge ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-red-500">ডেটা লোড করতে ব্যর্থ হয়েছে</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "মোট পণ্য",
      value: data.stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      link: "/products",
    },
    {
      label: "ক্যাটাগরি",
      value: data.stats.totalCategories,
      icon: Tags,
      color: "bg-purple-500",
      link: "/categories",
    },
    {
      label: "সরবরাহকারী",
      value: data.stats.totalSuppliers,
      icon: Truck,
      color: "bg-orange-500",
      link: "/suppliers",
    },
    {
      label: "গ্রাহক",
      value: data.stats.totalCustomers,
      icon: Users,
      color: "bg-green-500",
      link: "/customers",
    },
    {
      label: "স্টক মূল্য",
      value: formatCurrency(data.stats.stockValue),
      icon: DollarSign,
      color: "bg-emerald-500",
      link: "/products",
    },
    {
      label: "মোট ক্রয়",
      value: data.stats.totalPurchases,
      subtitle: formatCurrency(data.stats.purchaseAmount),
      icon: ShoppingCart,
      color: "bg-cyan-500",
      link: "/purchases",
    },
    {
      label: "মোট বিক্রয়",
      value: data.stats.totalSales,
      subtitle: formatCurrency(data.stats.salesAmount),
      icon: Receipt,
      color: "bg-pink-500",
      link: "/sales",
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kiddnest ড্যাশবোর্ড</h1>
        <p className="text-gray-500 text-sm mt-1">Kiddnest ইনভেন্টরির সারসংক্ষেপ ও রিয়েলটাইম আপডেট</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              href={stat.link}
              className="card hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
                  {stat.subtitle && (
                    <p className="text-xs text-gray-400 mt-0.5">{stat.subtitle}</p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-xl text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-gray-900">কম স্টকের পণ্য</h2>
            </div>
            <Link
              href="/products"
              className="text-blue-600 text-sm hover:underline flex items-center gap-1"
            >
              সব দেখুন <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">
              কোনো কম স্টকের পণ্য নেই ✅
            </p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-400">SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-sm font-bold ${
                        product.stockQuantity === 0
                          ? "text-red-600"
                          : "text-amber-600"
                      }`}
                    >
                      {product.stockQuantity}
                    </span>
                    <span className="text-xs text-gray-400">
                      {" "}
                      / {product.lowStockThreshold}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Sales */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="font-semibold text-gray-900">সাম্প্রতিক বিক্রয়</h2>
            </div>
            <Link
              href="/sales"
              className="text-blue-600 text-sm hover:underline flex items-center gap-1"
            >
              সব দেখুন <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.recentSales.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">
              কোনো বিক্রয় নেই
            </p>
          ) : (
            <div className="space-y-3">
              {data.recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{sale.orderNumber}</p>
                    <p className="text-xs text-gray-400">
                      {sale.customerName || "অজানা গ্রাহক"}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold">
                      {formatCurrency(sale.totalAmount)}
                    </span>
                    <StatusBadge status={sale.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900">সাম্প্রতিক ক্রয়</h2>
            </div>
            <Link
              href="/purchases"
              className="text-blue-600 text-sm hover:underline flex items-center gap-1"
            >
              সব দেখুন <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {data.recentPurchases.length === 0 ? (
            <p className="text-gray-400 text-sm py-4 text-center">
              কোনো ক্রয় আদেশ নেই
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="table-header">অর্ডার নং</th>
                    <th className="table-header">সরবরাহকারী</th>
                    <th className="table-header">মোট</th>
                    <th className="table-header">স্ট্যাটাস</th>
                    <th className="table-header">তারিখ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentPurchases.map((purchase) => (
                    <tr key={purchase.id} className="border-b border-gray-100">
                      <td className="table-cell font-medium">
                        {purchase.orderNumber}
                      </td>
                      <td className="table-cell">
                        {purchase.supplierName || "—"}
                      </td>
                      <td className="table-cell font-semibold">
                        {formatCurrency(purchase.totalAmount)}
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={purchase.status} />
                      </td>
                      <td className="table-cell text-gray-400">
                        {new Date(purchase.orderDate).toLocaleDateString("bn-BD")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
