import type { ImageStep } from "../../types";
import { CheckIcon } from '@heroicons/react/20/solid'

type StepProps = ImageStep & {
    completed: boolean,
    setCurrent: (id: number) => void
}

const Step = ({ name, status, id, setCurrent }: StepProps) => {

    const linkStyles = {
        default: "group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:border-gray-400",
        current: "relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-secondary_red bg-white",
        complete: "relative flex h-7 w-7 items-center justify-center rounded-full bg-secondary_red hover:bg-indigo-900",
    };

    return (
        <>
            <div className="absolute inset-0 flex items-center flex-wrap" aria-hidden="true">
                <div className={`h-0.5 w-full ${status === 'complete' ? "bg-secondary_red" : "bg-gray-200"}`} />
            </div>
            <div
                onClick={() => setCurrent(id)}
                className={linkStyles[status]}
            >
                {status === 'current' && <span className="h-2.5 w-2.5 rounded-full bg-secondary_red" aria-hidden="true" />}
                {status === 'complete' && < CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />}
                {status === 'default' && <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" aria-hidden="true" />}
                <span className="sr-only">{name}</span>
            </div>
        </>
    )
}

export default Step;