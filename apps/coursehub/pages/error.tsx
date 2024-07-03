import Image from 'next/image';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';

const Error = () => {
    const router = useRouter();
    const { error } = router.query as { error: string };

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="h-screen w-screen relative">
            <div className="h-full w-full absolute">
                <Image
                    alt=""
                    src="https://res.cloudinary.com/the-great-sync/image/upload/v1673003212/2000x2000/volcanic_landscape_k02d6p.png"
                    fill
                    className='object-cover object-top'
                />
            </div>
            <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-[#ffffffbd]  p-4">
                    <div className="mb-4 flex justify-center">
                        <ExclamationCircleIcon className="h-24 w-24 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="opacity-100">
                        <h4 className="text-2xl font-bold text-red-600 text-center ">Oh no! We have an error...</h4>
                        <p className="mt-4 text-center text-sm">{error}. If the problem persists, contact Kylo. </p>

                        <div className="flex justify-center mt-4">
                            <button
                                type="button"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleGoBack}
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Error;
