import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { salesOrders, salesOrderItems, products, customers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        id: salesOrders.id,
        orderNumber: salesOrders.orderNumber,
        customerId: salesOrders.customerId,
        status: salesOrders.status,
        totalAmount: salesOrders.totalAmount,
        notes: salesOrders.notes,
        orderDate: salesOrders.orderDate,
        createdAt: salesOrders.createdAt,
        customerName: customers.name,
      })
      .from(salesOrders)
      .leftJoin(customers, eq(salesOrders.customerId, customers.id))
      .orderBy(sql`${salesOrders.createdAt} DESC`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching sales orders:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(salesOrders);
    const orderNumber = `SO-${String(countResult.count + 1).padStart(5, "0")}`;

    const totalAmount = (body.items || []).reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );

    const [order] = await db.insert(salesOrders).values({
      orderNumber,
      customerId: body.customerId || null,
      status: body.status || "draft",
      totalAmount: totalAmount.toString(),
      notes: body.notes || null,
    }).returning();

    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        await db.insert(salesOrderItems).values({
          salesOrderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          total: (item.quantity * item.unitPrice).toString(),
        });

        // Reduce stock if confirmed
        if (body.status === "confirmed" || body.status === "shipped" || body.status === "delivered") {
          await db.update(products)
            .set({
              stockQuantity: sql`GREATEST(stock_quantity - ${item.quantity}, 0)`,
              updatedAt: new Date(),
            })
            .where(eq(products.id, item.productId));
        }
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating sales order:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.update(salesOrders)
      .set({
        status: body.status,
        notes: body.notes || null,
      })
      .where(eq(salesOrders.id, body.id))
      .returning();

    if (body.status === "confirmed" || body.status === "shipped" || body.status === "delivered") {
      const items = await db.select().from(salesOrderItems)
        .where(eq(salesOrderItems.salesOrderId, body.id));
      
      for (const item of items) {
        await db.update(products)
          .set({
            stockQuantity: sql`GREATEST(stock_quantity - ${item.quantity}, 0)`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId));
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating sales order:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(salesOrders).where(eq(salesOrders.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sales order:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
