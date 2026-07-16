import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password: _, ...userWithoutPass } = user;
    return NextResponse.json(userWithoutPass);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, companyName, address, newPassword, oldPassword } = body;

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(id)))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If trying to change password
    if (newPassword) {
      if (user.password !== oldPassword) {
        return NextResponse.json(
          { error: "বর্তমান পাসওয়ার্ড সঠিক নয়" },
          { status: 400 }
        );
      }
    }

    const [updated] = await db
      .update(users)
      .set({
        name: name || user.name,
        phone: phone || user.phone,
        companyName: companyName || user.companyName,
        address: address || user.address,
        password: newPassword || user.password,
        updatedAt: new Date(),
      })
      .where(eq(users.id, parseInt(id)))
      .returning();

    const { password: _, ...userWithoutPass } = updated;
    return NextResponse.json(userWithoutPass);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
