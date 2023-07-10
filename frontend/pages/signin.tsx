/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../assets/logo.webp';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import Img from '../assets/Creation_Phase.jpg';
import useHoneypot from '../hooks/useHoneypot';

interface Submission {
    email: string;
    password: string;
}

export default function SignIn() {
    const router = useRouter();
    const [formState, setFormState] = useState({ loading: false, error: false });
    const { checkForHoney, honeypot } = useHoneypot();

    const sendCredentials = async ({ email, password }: Submission) => {
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });
        const redirectUrl = router.query.redirect as string;
        if (result?.ok) return router.replace(redirectUrl);
        setFormState({ loading: false, error: true });
    };

    const onSubmit = (e: SyntheticEvent) => {
        e.preventDefault();
        if (checkForHoney()) return;
        setFormState({ error: false, loading: true });
        const form = e.target as HTMLFormElement;
        if (!form) return;
        const data = Object.fromEntries(new FormData(form)) as unknown as Submission;
        if (!data?.email || !data?.password) setFormState({ error: false, loading: false });
        sendCredentials(data);
    };

    return (
        <div className="bg-primary_blue h-screen px-8 md:px-0">
            <div className="flex min-h-full ">
                <div className="flex flex-1 flex-col justify-center  sm:py-12 spx-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="relative w-full h-32">
                            <Image
                                priority
                                alt="Mountains"
                                src={Logo}
                                layout="fill"
                                objectFit="contain"
                                className="aspect-square h-auto w-full top-0 left-1/2"
                            />
                        </div>
                        <h2 className="mt-6 text-xl font-bold tracking-tight text-white text-center">
                            Sign in to your account
                        </h2>

                        <div className="mt-8">
                            <div className="mt-6">
                                <form action="#" method="POST" className="space-y-6" onSubmit={onSubmit}>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white">
                                            Email address
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label htmlFor="password" className="block text-sm font-medium text-white">
                                            Password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                required
                                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                                                Remember me
                                            </label>
                                        </div>

                                        {honeypot}

                                        <div className="text-sm">
                                            <Link passHref href="/user/forgottenpassword">
                                                <a className="font-medium text-white hover:text-indigo-500">
                                                    Forgot your password?
                                                </a>
                                            </Link>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={formState.loading}
                                            className="flex w-full justify-center rounded-md border border-transparent bg-secondary_red py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            {formState.loading ? <Spinner /> : 'Signin'}
                                        </button>
                                    </div>
                                </form>
                                <div className="my-4">
                                    {formState.error && <Alert text="There was an error signing you in" />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative hidden w-0 flex-1 lg:block hover:brightness-125">
                    <Image
                        alt=""
                        src={Img}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="center"
                        placeholder="blur"
                    />
                </div>
            </div>
        </div>
    );
}
