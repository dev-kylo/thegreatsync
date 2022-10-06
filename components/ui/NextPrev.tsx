import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { ChevronRightIcon } from '@heroicons/react/20/solid'

const NextPrev = () => (
    <div className="relative bg-[#03143fad] flex flex-col justify-center">
        <div className="flex items-center justify-end z-10 mr-8">
            <button
                type="button"
                className="w-32 mx-4 inline-flex items-center justify-center rounded-md border border-secondary_lightblue bg-primary_blue  px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
            >
                <ChevronLeftIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                Previous
            </button>
            <button
                type="button"
                className="w-32 mx-4 inline-flex items-center justify-center rounded-md border border-secondary_lightblue bg-primary_blue  px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
            >
                Next
                <ChevronRightIcon className="-mr-1 ml-3 h-5 w-5" aria-hidden="true" />
            </button>
        </div>
    </div>
);

export default NextPrev;