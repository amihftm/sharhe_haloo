import { db } from "@/lib/db";

/**
 * Fetches a user from the database by their ID.
 * @param id - The ID of the user to fetch.
 * @returns The user object or null if not found.
 */
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch {
    return null;
  }
};
