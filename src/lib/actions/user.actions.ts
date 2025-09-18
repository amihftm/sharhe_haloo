"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

/**
 * A server action to fetch the full data for the currently authenticated user.
 * This is a secure way to get user details on the client without bloating the JWT.
 * @returns The user object without sensitive fields, or null if not authenticated.
 */
export const getCurrentUser = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    // Not authenticated
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) return null;

    // Return the user object, omitting any sensitive fields like the password hash.
    const { ...userSafeData } = user;
    return userSafeData;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};
