import { Disclosure } from '@headlessui/react';
import { Bars3CenterLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

const Burger = ({ open }: { open: boolean }) => (
    <div className="flex">
        {/* Mobile menu button */}
        <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-400 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
            <span className="sr-only">Open main menu</span>
            {open ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
                <Bars3CenterLeftIcon className="block h-6 w-6" aria-hidden="true" />
            )}
        </Disclosure.Button>
    </div>
);

export default Burger;