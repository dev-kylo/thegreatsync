import NextAuth, { User } from 'next-auth';

/** Example on how to extend the built-in session types */
declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        /** This is an example. You can find me in types/next-auth.d.ts */
        id?: string;
        jwt?: string;
        user?: User
    }
}