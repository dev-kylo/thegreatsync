import { StopCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

const ProgressIcon = ({ amount, completed }: { amount?: number | string, completed?: boolean }) => {
    if (!amount && !completed) return <></>
    if (completed) return (
        <ShieldCheckIcon
            className={'text-primary_green group-hover:text-gray-500 mr-3 h-6 w-6'}
            aria-hidden="true"
        />
    )
    return (
        <StopCircleIcon
            className={'text-gray-400 group-hover:text-gray-500 mr-3 h-6 w-6'}
            aria-hidden="true"
        />
    )
};

export default ProgressIcon;