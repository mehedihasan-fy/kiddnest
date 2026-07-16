import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select().from(customers).orderBy(sql`${customers.createdAt} DESC`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.insert(customers).values({
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      company: body.company || null,
    }).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.update(customers)
      .set({
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        company: body.company || null,
      })
      .where(eq(customers.id, body.id))
      .returning();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating customer:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(customers).where(eq(customers.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
