import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { purchaseOrders, purchaseOrderItems, products, suppliers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        id: purchaseOrders.id,
        orderNumber: purchaseOrders.orderNumber,
        supplierId: purchaseOrders.supplierId,
        status: purchaseOrders.status,
        totalAmount: purchaseOrders.totalAmount,
        notes: purchaseOrders.notes,
        orderDate: purchaseOrders.orderDate,
        createdAt: purchaseOrders.createdAt,
        supplierName: suppliers.name,
      })
      .from(purchaseOrders)
      .leftJoin(suppliers, eq(purchaseOrders.supplierId, suppliers.id))
      .orderBy(sql`${purchaseOrders.createdAt} DESC`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate order number
    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(purchaseOrders);
    const orderNumber = `PO-${String(countResult.count + 1).padStart(5, "0")}`;

    // Calculate total
    const totalAmount = (body.items || []).reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );

    const [order] = await db.insert(purchaseOrders).values({
      orderNumber,
      supplierId: body.supplierId || null,
      status: body.status || "draft",
      totalAmount: totalAmount.toString(),
      notes: body.notes || null,
    }).returning();

    // Insert items
    if (body.items && body.items.length > 0) {
      for (const item of body.items) {
        await db.insert(purchaseOrderItems).values({
          purchaseOrderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice.toString(),
          total: (item.quantity * item.unitPrice).toString(),
        });

        // Update stock if confirmed
        if (body.status === "confirmed" || body.status === "delivered") {
          await db.update(products)
            .set({
              stockQuantity: sql`stock_quantity + ${item.quantity}`,
              updatedAt: new Date(),
            })
            .where(eq(products.id, item.productId));
        }
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating purchase order:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.update(purchaseOrders)
      .set({
        status: body.status,
        notes: body.notes || null,
      })
      .where(eq(purchaseOrders.id, body.id))
      .returning();

    // If status changed to confirmed/delivered, update stock
    if (body.status === "confirmed" || body.status === "delivered") {
      const items = await db.select().from(purchaseOrderItems)
        .where(eq(purchaseOrderItems.purchaseOrderId, body.id));
      
      for (const item of items) {
        await db.update(products)
          .set({
            stockQuantity: sql`stock_quantity + ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId));
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating purchase order:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(purchaseOrders).where(eq(purchaseOrders.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
