import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import React from 'react';



const ControlBar = ({ children, showNext = true }: { children?: React.ReactNode, showNext?: boolean }) => {

    let stepsControls = (<></>)
    if (children) stepsControls = (
        <div className="absolute left-1/2 transform -translate-x-1/2">
            {children}
        </div>

    );

    return (
        <div className="relative h-full bg-[#03143f] flex flex-col justify-center">

            {stepsControls}

            <div className="flex items-center w-full mr-30 justify-between">

                <button
                    type="button"
                    className="w-32 mx-8 inline-flex items-center justify-center rounded-md border border-secondary_lightblue bg-primary_blue  px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
                >
                    <ChevronLeftIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                    Previous
                </button>
                {showNext && (<button
                    type="button"
                    className="w-32 mx-8 inline-flex items-center justify-center rounded-md border border-secondary_lightblue bg-primary_blue  px-4 py-1 text-base font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
                >
                    Next
                    <ChevronRightIcon className="-mr-1 ml-3 h-5 w-5" aria-hidden="true" />
                </button>)}
            </div>
        </div>
    )
};

export default ControlBar;