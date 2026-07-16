import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, sql, like } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = db
      .select({
        id: products.id,
        name: products.name,
        sku: products.sku,
        description: products.description,
        categoryId: products.categoryId,
        costPrice: products.costPrice,
        sellingPrice: products.sellingPrice,
        stockQuantity: products.stockQuantity,
        lowStockThreshold: products.lowStockThreshold,
        unit: products.unit,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .orderBy(sql`${products.createdAt} DESC`);

    if (search) {
      query = query.where(
        sql`${products.name} ILIKE ${'%' + search + '%'} OR ${products.sku} ILIKE ${'%' + search + '%'}`
      ) as typeof query;
    }

    const result = await query;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.insert(products).values({
      name: body.name,
      sku: body.sku,
      description: body.description || null,
      categoryId: body.categoryId || null,
      costPrice: body.costPrice?.toString() || "0",
      sellingPrice: body.sellingPrice?.toString() || "0",
      stockQuantity: body.stockQuantity || 0,
      lowStockThreshold: body.lowStockThreshold || 10,
      unit: body.unit || "pcs",
    }).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.update(products)
      .set({
        name: body.name,
        sku: body.sku,
        description: body.description || null,
        categoryId: body.categoryId || null,
        costPrice: body.costPrice?.toString() || "0",
        sellingPrice: body.sellingPrice?.toString() || "0",
        stockQuantity: body.stockQuantity || 0,
        lowStockThreshold: body.lowStockThreshold || 10,
        unit: body.unit || "pcs",
        updatedAt: new Date(),
      })
      .where(eq(products.id, body.id))
      .returning();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(products).where(eq(products.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
