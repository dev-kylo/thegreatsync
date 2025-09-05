/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import axios from 'axios';
import Link from 'next/link';
import Logo from '../assets/logo.webp';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import { RegisterPayload, register } from '../services/register';
import { checkEmailForOrder, registerAuthenticatedUser } from '../services/customer';
import type { RegisterResponse, ServerResponse } from '../types';
import useHoneypot from '../hooks/useHoneypot';

interface Submission {
    email: string;
    password: string;
}

type ValidationError = {
    name: 'ValidationError';
    message: string;
    details: any;
};

function getErrorMessage(result: RegisterResponse | ValidationError) {
    if (!result) return;
    if (axios.isAxiosError(result)) {
        console.log('si axios');
        const error = result.response?.data as ServerResponse<RegisterResponse>;
        return error?.error?.message;
    }
    if ('error' in result) return result.error?.message;
    if ('details' in result) return result.message;
}

export default function Enrollment() {
    const [formState, setFormState] = useState({ loading: false, error: false, message: '' });
    const [createNewAccount, setCreateNewAccount] = useState(true);
    const [orderEmail, setOrderEmail] = useState('');
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [processingAuth, setProcessingAuth] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const { orderid } = router.query as { orderid: string };
    const { checkForHoney, honeypot } = useHoneypot();

    // Check if user is authenticated and auto-register
    useEffect(() => {
        const handleAuthenticatedRegistration = async () => {
            if (!session?.jwt || !orderid || processingAuth) return;
            
            setProcessingAuth(true);
            setFormState({ loading: true, error: false, message: 'Setting up your course access...' });
            
            try {
                const result = await registerAuthenticatedUser(orderid, session.jwt as string);
                if (result.success) {
                    setFormState({ 
                        loading: false, 
                        error: false, 
                        message: result.message + ' Redirecting to your courses...' 
                    });
                    setTimeout(() => {
                        router.push('/courses');
                    }, 2000);
                }
            } catch (err) {
                const error = err as any;
                const message = error?.response?.data?.error?.message || 
                               error?.response?.data?.message || 
                               'Failed to register course';
                setFormState({ loading: false, error: true, message });
                setProcessingAuth(false);
            }
        };

        handleAuthenticatedRegistration();
    }, [session, orderid, processingAuth, router]);

    // Check order email for non-authenticated users
    useEffect(() => {
        const checkOrderEmail = async () => {
            if (!orderid || session || checkingEmail) return;
            
            setCheckingEmail(true);
            try {
                const result = await checkEmailForOrder(orderid);
                setOrderEmail(result.email);
                setCreateNewAccount(!result.hasAccount);
            } catch (err) {
                console.error('Failed to check order email:', err);
            } finally {
                setCheckingEmail(false);
            }
        };

        checkOrderEmail();
    }, [orderid, session, checkingEmail]);

    const sendCredentials = async (payload: RegisterPayload) => {
        try {
            const result = await register(payload);

            if (!result?.success) {
                console.log(getErrorMessage(result));
                throw new Error(getErrorMessage(result) || 'Error');
            } else setFormState({ loading: false, error: false, message: result.message });
        } catch (er) {
            const erObj = er as { message: string };
            let erMsg = erObj?.message;
            if (typeof erMsg !== 'string') erMsg = 'Error';
            setFormState({ loading: false, error: true, message: erMsg });
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (checkForHoney()) return;
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
        sendCredentials(payload);
    };

    // Show loading state if checking auth or processing
    if (processingAuth || (session && orderid)) {
        return (
            <div className="bg-primary_blue h-screen px-8 md:px-0">
                <div className="flex min-h-full items-center justify-center">
                    <div className="text-center">
                        <div className="relative w-full h-32 mb-8">
                            <Image
                                alt="The Great Sync Logo"
                                src={Logo}
                                fill
                                className="aspect-square object-contain h-auto w-full top-0 left-1/2"
                            />
                        </div>
                        {formState.message ? (
                            <Alert type={formState.error ? 'error' : 'success'} text={formState.message} />
                        ) : (
                            <>
                                <Spinner />
                                <p className="text-white mt-4">Setting up your course access...</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary_blue h-screen px-8 md:px-0">
            <div className="flex min-h-full ">
                <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 ">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div className="relative w-full h-32">
                            <Image
                                alt="The Great Sync Logo"
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                src={Logo}
                                fill
                                className="aspect-square object-contain h-auto w-full top-0 left-1/2"
                            />
                        </div>
                        <h2 className="mt-6 text-xl font-bold tracking-tight text-white text-center">
                            Set up your account
                        </h2>
                        <p className="text-md text-center mt-4 text-white font-bold">
                            Already have an account?{' '}
                            <Link href="/" className="text-green-400">
                                Login
                            </Link>
                        </p>

                        <div className="mt-8">
                            <div className="mt-6">
                                {/* Account type selection */}
                                {orderEmail && (
                                    <div className="mb-6 p-4 bg-blue-900 rounded-md">
                                        <p className="text-sm text-white mb-3">
                                            {!createNewAccount ? 
                                                "Welcome back! Use your existing password to link this course" :
                                                "Create a new account to access your course"
                                            }
                                        </p>
                                        <div className="flex items-center">
                                            <input
                                                id="use-existing"
                                                name="use-existing"
                                                type="checkbox"
                                                checked={!createNewAccount}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                onChange={() => setCreateNewAccount(!createNewAccount)}
                                            />
                                            <label htmlFor="use-existing" className="ml-2 block text-sm text-white">
                                                I already have an account
                                            </label>
                                        </div>
                                    </div>
                                )}

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
                                                defaultValue={orderEmail}
                                                readOnly={!createNewAccount && orderEmail !== ''}
                                                className={`block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${
                                                    !createNewAccount && orderEmail ? 'bg-gray-100' : ''
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    {honeypot}

                                    <div className="space-y-1">
                                        <label htmlFor="password" className="block text-sm font-medium text-white">
                                            {createNewAccount ? 'Create Password' : 'Enter Your Password'}
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete={createNewAccount ? 'new-password' : 'current-password'}
                                                required
                                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        {!createNewAccount && (
                                            <div className="text-sm text-right mt-2">
                                                <Link href="/user/forgottenpassword" className="text-green-400 hover:text-green-300">
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                        )}
                                    </div>


                                    {!formState.message && (
                                        <button
                                            type="submit"
                                            disabled={formState.loading || !orderid}
                                            className="w-full  py-0.5 text-sm md:py-1 md:text-base inline-flex items-center justify-center border border-secondary_lightblue bg-primary_blue  rounded-md font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2 disabled:bg-[#03143f] disabled:text-neutral-500"
                                        >
                                            {formState.loading ? (
                                                <Spinner />
                                            ) : createNewAccount ? (
                                                'Create my account'
                                            ) : (
                                                'Link to my existing account'
                                            )}
                                        </button>
                                    )}
                                </form>
                                {(formState.message || formState.error) && (
                                    <div className="mt-4">
                                        <Alert type={formState.error ? 'error' : 'success'} text={formState.message} />
                                        {!formState.error && (
                                            <div className="flex justify-center mt-4">
                                                <Link href="/">
                                                    <button
                                                        type="button"
                                                        className="w-32 mx-8 px-2 md:px-4 py-0.5 text-sm md:py-1 md:text-base inline-flex items-center justify-center rounded-md border border-secondary_lightblue bg-primary_blue   font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
                                                    >
                                                        Login
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
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
