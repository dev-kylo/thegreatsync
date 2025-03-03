import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ModelCarousel from '../../containers/ModelCarousel';

type SlideOverProps = {
    children: React.ReactNode;
    open: boolean;
    setOpen: (open: boolean) => void;
    hideExitBtn?: boolean;
};

function Modal({ children, open = true, setOpen, hideExitBtn = false }: SlideOverProps) {
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
                    <div className="fixed inset-0 bg-gray-500/25 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <TransitionChild
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <DialogPanel className="pointer-events-auto w-screen max-w-2xl ">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-primary_blue pt-6 shadow-xl pb-24">
                                        {!hideExitBtn && (
                                            <div className="px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
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
                                        )}
                                        <div className="relative flex-1">
                                            {/* slide content */}
                                            <div className="absolute inset-0 bg-primary_blue">
                                                <ModelCarousel
                                                    heading="Imagimodel"
                                                    pageSteps={[
                                                        {
                                                            id: 123323,
                                                            __component: 'media.text_image',
                                                            text: 'Welcome to Imagimodel!',
                                                            image_alt: 'Introduction image',
                                                            orderNumber: 1,
                                                            image: {
                                                                data: {
                                                                    id: 1,
                                                                    attributes: {
                                                                        width: 800,
                                                                        height: 600,
                                                                        url: 'https://the-great-sync.s3.amazonaws.com/4_Full_ic82lf_a3a6d2eebe.png',
                                                                        title: 'Introduction Image',
                                                                        placeholder: 'Introduction Image',
                                                                        size: 123456,
                                                                        hash: 'intro_hash',
                                                                    },
                                                                },
                                                            },
                                                            status: 'current',
                                                        },
                                                        {
                                                            id: 232321312,
                                                            __component: 'media.text_image',
                                                            text: 'Learn the fundamentals',
                                                            image_alt: 'Basic concepts image',
                                                            orderNumber: 23,
                                                            image: {
                                                                data: {
                                                                    id: 2,
                                                                    attributes: {
                                                                        width: 800,
                                                                        height: 600,
                                                                        url: 'https://the-great-sync.s3.amazonaws.com/Operator_Cinematic_q1sfux_6e9a57d592.png',
                                                                        title: 'Basic Concepts Image',
                                                                        placeholder: 'Basic Concepts Image',
                                                                        size: 123456,
                                                                        hash: 'basics_hash',
                                                                    },
                                                                },
                                                            },
                                                            status: 'default',
                                                        },
                                                        {
                                                            id: 3231231,
                                                            __component: 'media.text_image',
                                                            text: 'Ice Island',
                                                            image_alt: 'Ice Island',
                                                            orderNumber: 2,
                                                            image: {
                                                                data: {
                                                                    id: 3,
                                                                    attributes: {
                                                                        width: 800,
                                                                        height: 600,
                                                                        url: 'https://the-great-sync.s3.amazonaws.com/Captain_Pointing_oclmki_a6af5cb6ac.jpg',
                                                                        title: 'Basic Concepts Image',
                                                                        placeholder: 'Basic Concepts Image',
                                                                        size: 123456,
                                                                        hash: 'basics_hash',
                                                                    },
                                                                },
                                                            },
                                                            status: 'default',
                                                        },
                                                        {
                                                            id: 4321321334,
                                                            __component: 'media.text_image',
                                                            text: 'Pointing at island',
                                                            image_alt: 'Pointing',
                                                            orderNumber: 4,
                                                            image: {
                                                                data: {
                                                                    id: 4,
                                                                    attributes: {
                                                                        width: 800,
                                                                        height: 600,
                                                                        url: 'https://the-great-sync.s3.amazonaws.com/Ship_Pointing_2_nnrnkg_5b95eb8565.png',
                                                                        title: 'Pointing',
                                                                        placeholder: 'Pointing',
                                                                        size: 123456,
                                                                        hash: 'basics_hash',
                                                                    },
                                                                },
                                                            },
                                                            status: 'default',
                                                        },
                                                        {
                                                            id: 324325,
                                                            __component: 'media.text_image',
                                                            text: 'Captain Pointing',
                                                            image_alt: 'Basic concepts image',
                                                            orderNumber: 5,
                                                            image: {
                                                                data: {
                                                                    id: 5,
                                                                    attributes: {
                                                                        width: 800,
                                                                        height: 600,
                                                                        url: 'https://the-great-sync.s3.amazonaws.com/Captain_Pointing_oclmki_a6af5cb6ac.jpg',
                                                                        title: 'Basic Concepts Image',
                                                                        placeholder: 'Basic Concepts Image',
                                                                        size: 123456,
                                                                        hash: 'basics_hash',
                                                                    },
                                                                },
                                                            },
                                                            status: 'default',
                                                        },
                                                        {
                                                            id: 32432416,
                                                            __component: 'media.text_image',
                                                            text: 'Complex Scene',
                                                            image_alt: 'Basic concepts image',
                                                            orderNumber: 2,
                                                            image: {
                                                                data: {
                                                                    id: 2,
                                                                    attributes: {
                                                                        width: 800,
                                                                        height: 600,
                                                                        url: 'https://the-great-sync.s3.amazonaws.com/Object_Chained_Pointing_szth0k_3217254874.jpg',
                                                                        title: 'Complex Scene',
                                                                        placeholder: 'Basic Concepts Image',
                                                                        size: 123456,
                                                                        hash: 'basics_hash',
                                                                    },
                                                                },
                                                            },
                                                            status: 'default',
                                                        },
                                                    ]}
                                                    links={[]}
                                                    nextStep={() => {}}
                                                    prevStep={() => {}}
                                                    showNextButton={false}
                                                    type="text_image"
                                                    loadingPage={false}
                                                    showNext={false}
                                                    showPrev={false}
                                                    nextPage={() => {}}
                                                    prevPage={() => {}}
                                                    goToStep={() => {}}
                                                />

                                                {children}
                                                {/* <div className="h-48" /> */}
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

export default Modal;
