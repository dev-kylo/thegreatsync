import { StopCircleIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const ProgressIcon = ({ amount, completed }: { amount?: number | string, completed?: boolean }) => {
    if (!amount && !completed) return <></>
    if (completed) return (
        <CheckCircleIcon
            className={'text-green-400 mr-3 h-6 w-6'}
            aria-hidden="true"
        />
    )

    const radius = 9;

    return (
        <>
            <div className="rotate-[270deg] w-7 h-7">
                <svg className="p-0 m-0" viewBox="0 0 30 30">
                    <circle
                        className="text-gray-300 w-full h-auto"
                        strokeWidth="4"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50%"
                        cy="50%"
                    />
                    <circle
                        className="text-green-400"
                        strokeWidth="4"
                        strokeDasharray={(radius * 2 * Math.PI)}
                        strokeDashoffset={(radius * 2 * Math.PI) - ((50 / 100) * (radius * 2 * Math.PI))}
                        strokeLinecap='round'
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50%"
                        cy="50%"
                    />
                </svg>
            </div>


        </>
    )
};

export default ProgressIcon;