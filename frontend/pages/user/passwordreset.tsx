/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Logo from '../../assets/logo.webp';
import Alert from '../../components/ui/Alert';
import { resetLostPassword } from '../../services/password';
import useHoneypot from '../../hooks/useHoneypot';

export default function PasswordReset() {
    const [formState, setFormState] = useState({ loading: false, error: false, message: '' });
    const router = useRouter();
    const { code } = router.query as { code: string };
    const [passwordVal, setPasswordVal] = useState('');
    const [confirmedVal, setConfirmedVal] = useState('');
    const { checkForHoney, honeypot } = useHoneypot();

    const sendCredentials = async (password: string, passwordConfirmation: string) => {
        const errorMessage = 'Unable to reset your password. Please go back to the login page and restart the process.';
        try {
            const result = await resetLostPassword({ code, password, passwordConfirmation });
            if (!result?.jwt) throw new Error(errorMessage);

            setFormState({
                loading: false,
                error: false,
                message: 'Your password has successfully been reset. Please proceed to login.',
            });

            setConfirmedVal('');
            setPasswordVal('');
        } catch (er) {
            setFormState({ loading: false, error: true, message: errorMessage });
        }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (checkForHoney()) return;
        setFormState({ error: false, loading: true, message: '' });

        if (!passwordVal || !confirmedVal || passwordVal !== confirmedVal)
            return setFormState({ error: true, loading: false, message: 'Your passwords do not match' });

        sendCredentials(passwordVal, confirmedVal);
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
                            Reset your password
                        </h2>

                        <div className="mt-8">
                            <div className="mt-6">
                                <form action="#" method="POST" className="space-y-6" onSubmit={onSubmit}>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white">
                                            New password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                value={passwordVal}
                                                onChange={(e) => setPasswordVal(e.target.value)}
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white">
                                            Confirm new password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                value={confirmedVal}
                                                onChange={(e) => setConfirmedVal(e.target.value)}
                                                id="repeatPassword"
                                                name="repeatPassword"
                                                type="password"
                                                required
                                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    {honeypot}

                                    <button
                                        type="submit"
                                        disabled={formState.loading}
                                        className="w-full py-2  text-sm md:py-1 md:text-base inline-flex items-center justify-center border border-secondary_lightblue bg-primary_blue  rounded-md font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2 disabled:bg-[#03143f] disabled:text-neutral-500"
                                    >
                                        Reset Password
                                    </button>
                                </form>
                                {(formState.message || formState.error) && (
                                    <div className="mt-4">
                                        <Alert type={formState.error ? 'error' : 'success'} text={formState.message} />
                                        {!formState.error && (
                                            <div className="flex justify-center mt-4">
                                                <Link href="/" passHref>
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
