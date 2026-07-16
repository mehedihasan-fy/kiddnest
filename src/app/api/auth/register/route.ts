import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, companyName } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "নাম, ইমেইল ও পাসওয়ার্ড প্রদান করা বাধ্যতামূলক" },
        { status: 400 }
      );
    }

    // Check existing user
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে" },
        { status: 409 }
      );
    }

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password, // For full simplicity in quick inventory setup
        role: "admin",
        phone: phone || "01700000000",
        companyName: companyName || "Kiddnest Enterprise",
      })
      .returning();

    // Remove password from response
    const { password: _, ...userWithoutPass } = newUser;

    return NextResponse.json({ user: userWithoutPass }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
