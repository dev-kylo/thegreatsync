import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import { signIn } from '../../../services/signIn';

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'Sign in with Email',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, _) {
                /**
                 * This function is used to define if the user is authenticated or not.
                 * If authenticated, the function should return an object contains the user data.
                 * If not, the function should return `null`.
                 */
                if (credentials === null || !credentials?.email || !credentials?.password) return null;
                try {
                    const { user, jwt } = await signIn({
                        email: credentials.email,
                        password: credentials.password,
                    });
                    return { ...user, jwt } as unknown as User;
                } catch (error) {
                    console.log('SIGN IN FAIL', error);
                    return null;
                }
            },
        }),
    ],
    // secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session: async ({ session, token }) => {
            session.id = token.id as string;
            session.jwt = token.jwt as string;
            return Promise.resolve(session);
        },
        jwt: async ({ token, user }) => {
            const isSignIn = !!user;
            const userWithType = user as User & { jwt: string };
            if (userWithType && isSignIn) {
                token.id = userWithType.id;
                token.jwt = userWithType.jwt;
            }
            return Promise.resolve(token);
        },
    },
};

export default NextAuth(authOptions);
