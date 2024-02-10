import Image from 'next/image';
import { HandRaisedIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import Ocean from '../assets/Ocean.png';

const Custom403 = () => {
    const router = useRouter();
    const { error } = router.query as { error: string };

    return (
        <div className="h-screen w-screen relative">
            <div className="h-full w-full absolute">
                <Image alt="" src={Ocean} placeholder="blur" layout="fill" objectFit="cover" objectPosition="top" />
            </div>
            <div className="flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-[#ffffffbd]  p-4">
                    <div className="mb-4 flex justify-center">
                        <HandRaisedIcon className="h-24 w-24 text-primary_blue" aria-hidden="true" />
                    </div>
                    <div className="opacity-100 text-center">
                        <h4 className="text-2xl font-bold text-primary_blue text-center ">
                            Oh no! You do not have the correct permissions.
                        </h4>
                        <small className="text-red-500 text-center text-sm"> {error || ''}</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Custom403;
