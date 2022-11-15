/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn } from '../../../services/signIn';


export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            name: 'Sign in with Email',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                /**
                 * This function is used to define if the user is authenticated or not.
                 * If authenticated, the function should return an object contains the user data.
                 * If not, the function should return `null`.
                 */
                // console.dir(credentials)
                if (credentials === null || !credentials?.email || !credentials?.password) return null;
                /**
                 * credentials is defined in the config above.
                 * We can expect it contains two properties: `email` and `password`
                 */
                try {
                    const { user, jwt } = await signIn({
                        email: credentials.email,
                        password: credentials.password,
                    });
                    console.log('Made it here')
                    // console.dir(jwt)
                    return { ...user, jwt };
                } catch (error) {
                    console.log('SIGN IN FAIL');
                    // console.dir(error)
                    // Sign In Fail
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        session: async ({ session, token }) => {
            console.log('SESSION CALLBACK')
            session.id = token.id as string;
            session.jwt = token.jwt as string;
            return Promise.resolve(session);
        },
        jwt: async ({ token, user }) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                token.id = user.id;
                token.jwt = user.jwt;
            }
            return Promise.resolve(token);
        },
    },
});