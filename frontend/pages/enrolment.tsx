/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import Logo from '../assets/logo.webp';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import { RegisterPayload, register } from '../services/register';
import type { RegisterResponse, ServerResponse } from '../types';

interface Submission {
    email: string;
    password: string;
}

export default function Enrollment() {
    const [formState, setFormState] = useState({ loading: false, error: false, message: '' });
    const [createNewAccount, setCreateNewAccount] = useState(true);
    const router = useRouter();
    const { orderid } = router.query as { orderid: string };
    console.log(router.query);

    const sendCredentials = async (payload: RegisterPayload) => {
        try {
            const result = await register(payload);
            console.log('------REGISTER RESULT------', result);
            if (!result?.success) throw new Error(result?.error?.message);
            else setFormState({ loading: false, error: false, message: result.message });
        } catch (er) {
            if (axios.isAxiosError(er)) {
                const error = er.response?.data as ServerResponse<RegisterResponse>;
                setFormState({ loading: false, error: true, message: error?.error?.message });
            } else if (typeof er === 'string') setFormState({ loading: false, error: true, message: er });
            else setFormState({ loading: false, error: true, message: 'Error' });
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState({ error: false, loading: true, message: '' });
        const form = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(form)) as unknown as Submission;
        if (!data?.email) setFormState({ error: false, loading: false, message: '' });

        const payload: RegisterPayload = {
            username: data.email,
            existingAccount: !createNewAccount,
            password: data.password,
            orderId: orderid,
        };

        console.log(payload);
        sendCredentials(payload);
    };

    return (
        <div className="bg-primary_blue h-screen">
            <div className="flex min-h-full ">
                <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 ">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="relative w-full h-32">
                            <Image
                                alt="The Great Sync Logo"
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                src={Logo}
                                layout="fill"
                                objectFit="contain"
                                width={3000}
                                height={2000}
                                className="aspect-square h-auto w-full top-0 left-1/2"
                            />
                        </div>
                        <h2 className="mt-6 text-xl font-bold tracking-tight text-white text-center">
                            Set up your account
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

                                    {createNewAccount && (
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
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                onChange={() => setCreateNewAccount(!createNewAccount)}
                                            />
                                            <label htmlFor="remember-me" className="ml-4 block text-sm text-white">
                                                I already have an account with this email address and would like to use
                                                the same one.
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formState.loading || !orderid}
                                        className="flex w-full justify-center rounded-md border border-transparent bg-secondary_red py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-[#03143f] disabled:text-neutral-500"
                                    >
                                        {formState.loading ? (
                                            <Spinner />
                                        ) : createNewAccount ? (
                                            'Create my account'
                                        ) : (
                                            'Use my existing account'
                                        )}
                                    </button>
                                </form>
                                {(formState.message || formState.error) && (
                                    <div className="mt-4">
                                        <Alert type={formState.error ? 'error' : 'success'} text={formState.message} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
