import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

type SlideOverProps = {
    children: React.ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
    title?: string;
};

function SlideOver({ children, open, setOpen, title = 'Course Outline' }: SlideOverProps) {
    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10 " onClose={() => setOpen(false)}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
                            <TransitionChild
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <DialogPanel className="pointer-events-auto w-screen max-w-xl ">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-primary_blue pt-6 shadow-xl pb-24">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <DialogTitle className="text-lg font-medium  bg-green-400 text-primary_blue px-[2rem] py-[0.1rem]">
                                                    {title}
                                                </DialogTitle>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative mt-6 flex-1">
                                            {/* slide content */}
                                            <div className="absolute inset-0 bg-primary_blue">
                                                {children}
                                                <div className="h-48" />
                                            </div>
                                            {/* /End slide content */}
                                        </div>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default SlideOver;
