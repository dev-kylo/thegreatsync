/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import Image from 'next/image';
import Logo from '../../assets/logo.webp';
import Alert from '../../components/ui/Alert';
import { forgotPassword } from '../../services/password';
import useHoneypot from '../../hooks/useHoneypot';

export default function ForgottenPassword() {
    const [formState, setFormState] = useState({ loading: false, error: false, message: '' });
    const [emailVal, setEmailVal] = useState('');
    const { checkForHoney, honeypot } = useHoneypot();

    const sendCredentials = async (email: string) => {
        const errorMessage = 'Failed to send reset email. Please try again';
        try {
            const result = await forgotPassword({ email });

            if (!result?.ok) throw new Error(errorMessage);

            setFormState({
                loading: false,
                error: false,
                message: 'A password reset link has been sent to your email.',
            });
            setEmailVal('');
        } catch (er) {
            setFormState({ loading: false, error: true, message: errorMessage });
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (checkForHoney()) return;
        setFormState({ error: false, loading: true, message: '' });
        console.log({ emailVal });
        if (!emailVal) return setFormState({ error: true, loading: false, message: 'Missing email address' });

        sendCredentials(emailVal);
    };

    console.log(emailVal);

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
                            Forgotten your password? Reset it here.
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
                                                value={emailVal}
                                                onChange={(e) => setEmailVal(e.target.value)}
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {honeypot}

                                    <button
                                        type="submit"
                                        disabled={formState.loading}
                                        className="w-full py-2 text-sm md:py-1 md:text-base inline-flex items-center justify-center border border-secondary_lightblue bg-primary_blue  rounded-md font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2 disabled:bg-[#03143f] disabled:text-neutral-500"
                                    >
                                        Submit
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
