/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CheckIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import type { PageStep, ImageComp } from '../../types';

type StepProps = Omit<PageStep, 'image'> & {
    setCurrent: (id: number) => void;
    size?: 'small' | 'large';
    image?: ImageComp; // Changed to just ImageComp
};

const Step = ({ status, id, orderNumber, setCurrent, image, size = 'small' }: StepProps) => {
    const imageUrl = image?.data
        ? Array.isArray(image.data)
            ? image.data[0]?.attributes?.url
            : image.data?.attributes?.url
        : null;

    console.log('Step render:', { status, imageUrl, image }); // Debug log

    const linkStyles = {
        default: `group ${
            imageUrl && size === 'large' ? 'h-24 w-24' : imageUrl && size === 'small' ? 'h-10 w-10' : 'h-6 w-6'
        } border-2 border-gray-300 bg-white hover:border-gray-400 hover:bg-primary_green hover:text-white hover:scale-110 overflow-hidden`,
        current: `${
            imageUrl && size === 'large' ? 'h-24 w-24' : imageUrl && size === 'small' ? 'h-10 w-10' : 'h-6 w-6'
        } border-2 border-green-400 bg-white overflow-hidden`,
        complete: `${
            imageUrl && size === 'large' ? 'h-24 w-24' : imageUrl && size === 'small' ? 'h-10 w-10' : 'h-5 w-5'
        } bg-green-400 hover:bg-primary_green overflow-hidden`,
    };

    return (
        <>
            <div className="absolute inset-0 flex items-center flex-wrap" aria-hidden="true">
                <div className={`h-0.5 w-full ${status === 'complete' ? 'bg-green-400' : 'bg-gray-200'}`} />
            </div>

            <div
                onClick={() => setCurrent(id)}
                className={`relative flex items-center justify-center rounded-full hover:cursor-pointer hover:scale-110 transition-all duration-300 ${linkStyles[status]}`}
            >
                {status === 'current' &&
                    (imageUrl ? (
                        <div className="w-24 h-24 relative ">
                            <Image
                                src={imageUrl}
                                alt="Step image"
                                fill
                                className="rounded-full object-cover"
                                priority
                            />
                        </div>
                    ) : (
                        <div
                            className="h-8 w-8 rounded-full flex justify-center items-center p-0 m-0"
                            aria-hidden="true"
                        >
                            {orderNumber}
                        </div>
                    ))}
                {status === 'complete' && <CheckIcon className="h-5 w-5 text-black" aria-hidden="true" />}
                {status === 'default' &&
                    (imageUrl ? (
                        <div className="w-24 h-24 relative bg-blue-200">
                            <Image
                                src={imageUrl}
                                alt="Step image"
                                fill
                                className="rounded-full object-cover"
                                priority
                            />
                        </div>
                    ) : (
                        <div
                            className="h-5 w-5 rounded-full flex justify-center items-center p-0 m-0"
                            aria-hidden="true"
                        >
                            {orderNumber}
                        </div>
                    ))}
            </div>
        </>
    );
};

export default Step;
