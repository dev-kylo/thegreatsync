import Image from 'next/image';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

const Error = () => (
    <div className="h-screen w-screen relative">
        <div className="h-full w-full absolute">
            <Image
                alt=""
                src="https://res.cloudinary.com/the-great-sync/image/upload/v1673003212/2000x2000/volcanic_landscape_k02d6p.png"
                layout="fill"
                objectFit="cover"
                objectPosition="top"
            />
        </div>
        <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-[#ffffffbd]  p-4">
                <div className="mb-4 flex justify-center">
                    <ExclamationCircleIcon className="h-24 w-24 text-red-600" aria-hidden="true" />
                </div>
                <div className="opacity-100">
                    <h4 className="text-2xl font-bold text-red-600 text-center ">Oh no! We have an error...</h4>
                    <p className="mt-4 text-center text-lg">
                        In javascript, receiving <code className="text-red-600 font-bold">undefined</code> (volcano
                        island) does not cause an error. But lots of other things do! Please try go back and retry.
                    </p>
                    <p className="text-blue-700 font-bold mt-2 text-center">If the problem persists, contact me!</p>
                </div>
            </div>
        </div>
    </div>
);

export default Error;
