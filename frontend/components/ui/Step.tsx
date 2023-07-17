/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CheckIcon } from '@heroicons/react/20/solid';
import type { PageStep } from '../../types';

type StepProps = PageStep & {
    currentNumber: number;
    setCurrent: (id: number) => void;
};

const Step = ({ status, id, orderNumber, currentNumber, setCurrent }: StepProps) => {
    const linkStyles = {
        default:
            'group h-6 w-6 border-2 border-gray-300 bg-white hover:border-gray-400  hover:bg-primary_green  hover:text-white hover:scale-110',
        current: 'h-9 w-9 border-2 border-green-400 bg-white',
        complete:
            currentNumber > (orderNumber ?? 0)
                ? 'h-7 w-7 bg-green-400 hover:bg-primary_green'
                : 'group h-6 w-6 border-2 border-gray-300 bg-white hover:border-gray-400  hover:bg-primary_green  hover:text-white hover:scale-110',
    };

    return (
        <>
            <div className="absolute inset-0 flex items-center flex-wrap" aria-hidden="true">
                <div
                    className={`h-0.5 w-full ${
                        status === 'complete' && currentNumber > (orderNumber ?? 0) ? 'bg-green-400' : 'bg-gray-200'
                    }`}
                />
            </div>
            <div
                onClick={() => setCurrent(id)}
                className={`relative flex items-center justify-center rounded-full  hover:cursor-pointer ${linkStyles[status]}`}
            >
                {status === 'current' && (
                    <div className="h-8 w-8 rounded-full flex justify-center items-center p-0 m-0" aria-hidden="true">
                        {orderNumber}
                    </div>
                )}
                {status === 'complete' && currentNumber > (orderNumber ?? 0) && (
                    <CheckIcon className="h-5 w-5 text-black" aria-hidden="true" />
                )}
                {status === 'default' ||
                    (currentNumber < (orderNumber ?? 0) && (
                        <div
                            className="h-5 w-5 rounded-full flex justify-center items-center p-0 m-0"
                            aria-hidden="true"
                        >
                            {orderNumber}
                        </div>
                    ))}
                {/* <span className="sr-only">{name}</span> */}
            </div>
        </>
    );
};

<span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />;

export default Step;
