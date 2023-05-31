/* eslint-disable react/jsx-no-useless-fragment */
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import React from 'react';
import Spinner from '../components/ui/Spinner';

type ControlBarProps = {
    children?: React.ReactNode;
    showNext?: boolean;
    nextPage: () => void;
    prevPage: () => void;
    loadingPage: boolean;
};

// bottom: 50px;
//     background: #03143f;

const ControlBar = ({ children, loadingPage, showNext = true, nextPage, prevPage }: ControlBarProps) => {
    let stepsControls = <></>;
    if (children)
        stepsControls = (
            <div className="absolute bottom-14 sm:bottom-5 bg-primary_blue left-1/2 transform -translate-x-1/2">
                {children}
            </div>
        );

    const nextPageHandler = () => {
        nextPage();
    };
    const prevPageHandler = () => {
        prevPage();
    };
    return (
        <div className="relative h-full bg-[#03143f] flex flex-col justify-center">
            {stepsControls}

            <div className="flex items-center w-full mr-30 justify-between">
                <button
                    onClick={prevPageHandler}
                    type="button"
                    className="w-32 mx-8 px-2 md:px-4 py-0.5 text-sm md:py-1 md:text-base inline-flex items-center justify-center rounded-md border border-secondary_lightblue bg-primary_blue   font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
                >
                    <ChevronLeftIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                    Previous
                </button>
                {loadingPage && <Spinner />}
                {showNext && (
                    <button
                        type="button"
                        onClick={nextPageHandler}
                        className="w-32 mx-8 px-2 md:px-4 py-0.5 text-sm md:py-1 md:text-base inline-flex items-center justify-center rounded-md border border-secondary_lightblue bg-primary_blue   font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
                    >
                        Next
                        <ChevronRightIcon className="-mr-1 ml-3 h-5 w-5" aria-hidden="true" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ControlBar;
