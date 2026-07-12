import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { suppliers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select().from(suppliers).orderBy(sql`${suppliers.createdAt} DESC`);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.insert(suppliers).values({
      name: body.name,
      email: body.email || null,
      phone: body.phone || null,
      address: body.address || null,
      company: body.company || null,
    }).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating supplier:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const [result] = await db.update(suppliers)
      .set({
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        company: body.company || null,
      })
      .where(eq(suppliers.id, body.id))
      .returning();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating supplier:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(suppliers).where(eq(suppliers.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
