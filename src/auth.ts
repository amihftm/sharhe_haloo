import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import { UserRole } from "@prisma/client"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
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
  ...authConfig,
})