"use client";

import { User } from "@prisma/client";
import { createContext, useContext } from "react";

// Define the shape of the data we want in our context.
// We use a partial User type as the data might not be available initially.
export type UserContextType = {
  user: Omit<User, 'password' | 'emailVerified'> | null;
};

// Create the context with a default null value.
export const UserContext = createContext<UserContextType>({
  user: null,
});

/**
 * Custom hook to easily access the current user's data from the context.
 * Throws an error if used outside of a UserProvider to ensure correctness.
 * @returns The current user's data.
 */
export const useCurrentUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  return context;
};
