"use client";

import { UserContext } from "@/context/user-context";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// This component provides the user data to the rest of the application.
export function UserProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [user, setUser] = useState<Omit<User, 'password' | 'emailVerified'> | null>(null);

  useEffect(() => {
    // Only fetch user data if the session is authenticated.
    if (status === "authenticated") {
      if (!!user) {
        return
      } {
        getCurrentUser().then((userData) => {
          if (userData) {
            setUser(userData);
          }
        });
      }
    } else if (status === "unauthenticated") {
      // Clear user data on sign out.
      setUser(null);
    }
  }, [status]); // Re-run effect when authentication status changes.

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}
