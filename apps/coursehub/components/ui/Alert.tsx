import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

type AlertProps = {
    text: string | React.ReactNode;
    type?: 'error' | 'success';
};

export default function Alert({ text, type = 'error' }: AlertProps) {
    return (
        <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    {type === 'error' ? (
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    ) : (
                        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                    )}
                </div>
                <div className="ml-3">
                    <h3 className={`text-sm font-medium${type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
                        {text}
                    </h3>
                </div>
            </div>
        </div>
    );
}
