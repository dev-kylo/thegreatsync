/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import Image from 'next/image';
import Logo from '../../assets/logo.webp';
import Alert from '../../components/ui/Alert';

export default function PasswordReset() {
    const [formState, setFormState] = useState({ loading: false, error: false, message: '' });

    const sendCredentials = (email: string) => {
        console.log(email);
        // try {
        //     const result = await register(payload);
        //     console.log('------REGISTER RESULT------', result);
        //     if (!result?.success) throw new Error(result?.error?.message);
        //     else setFormState({ loading: false, error: false, message: result.message });
        // } catch (er) {
        //     if (axios.isAxiosError(er)) {
        //         const error = er.response?.data as ServerResponse<RegisterResponse>;
        //         setFormState({ loading: false, error: true, message: error?.error?.message });
        //     } else if (typeof er === 'string') setFormState({ loading: false, error: true, message: er });
        //     else setFormState({ loading: false, error: true, message: 'Error' });
        // }
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormState({ error: false, loading: true, message: '' });
        const form = e.target as HTMLFormElement;
        const data = Object.fromEntries(new FormData(form)) as unknown as { email?: string };
        if (!data?.email) return setFormState({ error: true, loading: false, message: 'Missing email address' });

        sendCredentials(data.email);
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
                            Forgotten your password? Reset it here.
                        </h2>

                        <div className="mt-8">
                            <div className="mt-6">
                                <form action="#" method="POST" className="space-y-6" onSubmit={onSubmit}>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white">
                                            New Password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                required
                                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formState.loading}
                                        className="w-full  py-0.5 text-sm md:py-1 md:text-base inline-flex items-center justify-center border border-secondary_lightblue bg-primary_blue  rounded-md font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2 disabled:bg-[#03143f] disabled:text-neutral-500"
                                    >
                                        Reset Password
                                    </button>
                                </form>
                                {(formState.message || formState.error) && (
                                    <div className="mt-4">
                                        <Alert type={formState.error ? 'error' : 'success'} text={formState.message} />
                                        {!formState.error && (
                                            <div className="flex justify-center mt-4">
                                                Your password has successfully been updated.
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
