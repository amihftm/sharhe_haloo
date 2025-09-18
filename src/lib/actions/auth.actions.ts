'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

/**
 * A server action to sign the user in with Google.
 * It redirects the user to the dashboard upon completion.
 */
export async function signInWithGoogle() {
  try {
    await signIn('google', { redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      // You can handle specific authentication errors here
      console.error('Google Sign-In Error:', error.type, error.cause?.err?.message);
      // Depending on the error, you might want to return a message
      // return { error: 'Authentication failed.' };
    }
    // For any other errors, re-throw them
    throw error;
  }
}

/**
 * A server action to sign the user out.
 * It redirects the user to the login page upon completion.
 */
export async function signOutAction() {
  await signOut({ redirectTo: '/auth/login' });
}
