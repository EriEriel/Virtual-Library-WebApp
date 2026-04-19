"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  // ASCII only regex
  const asciiRegex = /^[\x00-\x7F]*$/;

  if (name && (name.length > 20 || !asciiRegex.test(name))) {
    return { error: "Name must be 20 characters or less and contain only ASCII characters." }
  }

  if (password.length > 20 || !asciiRegex.test(password)) {
    return { error: "Password must be 20 characters or less and contain only ASCII characters." }
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    return { error: "An account with this email already exists." }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  })

  return { success: true }
}
