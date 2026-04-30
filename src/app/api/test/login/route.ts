import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";

export async function GET(request: Request) {
  // 1. SAFETY CHECK: Only allow this in development/test
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not Allowed", { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return new NextResponse("Email required", { status: 400 });
  }

  // 2. Find the user in YOUR database
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  // 3. Create a signed JWT token that NextAuth understands
  // We use the same secret your app uses
  const token = await encode({
    token: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.image,
    },
    salt: "authjs.session-token", // Default salt for NextAuth v5/Auth.js
    secret: process.env.AUTH_SECRET!,
  });

  // 4. Set the cookie and redirect to home
  const response = NextResponse.redirect(new URL("/", request.url));
  
  response.cookies.set("authjs.session-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  });

  return response;
}
