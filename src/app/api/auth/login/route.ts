import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ইমেইল ও পাসওয়ার্ড প্রদান করুন" },
        { status: 400 }
      );
    }

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Auto seed admin if DB has no users yet and credentials match default
    if (!user) {
      const [countRes] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users);

      if (countRes.count === 0 && email === "admin@kiddnest.com" && password === "123456") {
        const [seeded] = await db
          .insert(users)
          .values({
            name: "Kiddnest Admin",
            email: "admin@kiddnest.com",
            password: "123456",
            role: "admin",
            phone: "01800000000",
            companyName: "Kiddnest Enterprise",
            address: "ঢাকা, বাংলাদেশ",
          })
          .returning();
        user = seeded;
      }
    }

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "ভুল ইমেইল অথবা পাসওয়ার্ড!" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPass } = user;

    const response = NextResponse.json({
      success: true,
      user: userWithoutPass,
    });

    // Set cookie for quick auth
    response.cookies.set("kiddnest_user", JSON.stringify(userWithoutPass), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "লগইন করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
