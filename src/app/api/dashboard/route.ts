import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, suppliers, customers, purchaseOrders, salesOrders } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export async function GET() {
  try {
    const [productCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);

    const [categoryCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(categories);

    const [supplierCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(suppliers);

    const [customerCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(customers);

    const [totalStockValue] = await db
      .select({
        value: sql<string>`COALESCE(SUM(stock_quantity * cost_price), 0)::text`,
      })
      .from(products);

    const [purchaseTotal] = await db
      .select({
        count: sql<number>`count(*)::int`,
        total: sql<string>`COALESCE(SUM(total_amount), 0)::text`,
      })
      .from(purchaseOrders);

    const [salesTotal] = await db
      .select({
        count: sql<number>`count(*)::int`,
        total: sql<string>`COALESCE(SUM(total_amount), 0)::text`,
      })
      .from(salesOrders);

    const lowStockProducts = await db
      .select()
      .from(products)
      .where(sql`stock_quantity <= low_stock_threshold`)
      .limit(10);

    const recentSales = await db
      .select({
        id: salesOrders.id,
        orderNumber: salesOrders.orderNumber,
        status: salesOrders.status,
        totalAmount: salesOrders.totalAmount,
        orderDate: salesOrders.orderDate,
        customerName: customers.name,
      })
      .from(salesOrders)
      .leftJoin(customers, eq(salesOrders.customerId, customers.id))
      .orderBy(sql`${salesOrders.createdAt} DESC`)
      .limit(5);

    const recentPurchases = await db
      .select({
        id: purchaseOrders.id,
        orderNumber: purchaseOrders.orderNumber,
        status: purchaseOrders.status,
        totalAmount: purchaseOrders.totalAmount,
        orderDate: purchaseOrders.orderDate,
        supplierName: suppliers.name,
      })
      .from(purchaseOrders)
      .leftJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
      .orderBy(sql`${purchaseOrders.createdAt} DESC`)
      .limit(5);

    return NextResponse.json({
      stats: {
        totalProducts: productCount.count,
        totalCategories: categoryCount.count,
        totalSuppliers: supplierCount.count,
        totalCustomers: customerCount.count,
        stockValue: totalStockValue.value,
        totalPurchases: purchaseTotal.count,
        purchaseAmount: purchaseTotal.total,
        totalSales: salesTotal.count,
        salesAmount: salesTotal.total,
      },
      lowStockProducts,
      recentSales,
      recentPurchases,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
