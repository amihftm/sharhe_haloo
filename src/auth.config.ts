import { UserRole } from "@prisma/client";
import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
 
// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [Google],
  callbacks: {
    /**
     * This callback is used to control access to pages.
     * It runs before a request is completed.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard');

      if (isProtectedRoute) {
        if (isLoggedIn) {
          return true; // Allow access if logged in
        }
        return false; // Redirect unauthenticated users to login page
      }

      // Allow access to all other public pages by default
      return true;
    },
    async jwt({ token, user }) {
      // The 'sub' property is the user's ID from the database.
      if (!token.sub) {
        return token;
      }

      // If the user doesn't exist, invalidate the token.
      if (!user) {
        return null;
      }

      // Add the role from the database to the token.
      // This ensures the role is always fresh.
      token.role = user.role;
      token.id = user.id;
      delete token.name
      delete token.email
      delete token.picture
      delete token.sub
      
      return token;
    },

    /**
     * This callback is invoked whenever a session is checked.
     * It uses the data from the token to build the client-side session object.
     */
    async session({ session, token }) {
      if (session.user) {
        // The token is the source of truth here.
        // We assign the properties from the token to the session object.
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
} satisfies NextAuthConfig