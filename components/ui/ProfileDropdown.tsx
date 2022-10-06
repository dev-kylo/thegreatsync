import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Disclosure } from '@headlessui/react'

const ProfileDropDown = ({ mobile }: { mobile?: boolean }) => {

    if (mobile) return (
        <>
            <Disclosure.Button
                as="a"
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-indigo-200 hover:bg-indigo-600 hover:text-indigo-100"
            >
                Your Profile
            </Disclosure.Button>
            <Disclosure.Button
                as="a"
                href="#"
                className="mt-1 block rounded-md px-3 py-2 text-base font-medium text-indigo-200 hover:bg-indigo-600 hover:text-indigo-100"
            >
                Settings
            </Disclosure.Button>
            <Disclosure.Button
                as="a"
                href="#"
                className="mt-1 block rounded-md px-3 py-2 text-base font-medium text-indigo-200 hover:bg-indigo-600 hover:text-indigo-100"
            >
                Sign out
            </Disclosure.Button>
        </>
    )

    return (
        <Menu as="div" className="relative flex-shrink-0">
            <div>
                <Menu.Button className="flex rounded-full bg-indigo-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
                    <span className="sr-only">Open user menu</span>
                    <img
                        className="h-8 w-8 xl:h-10 xl:w-10 rounded-full"
                        src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80"
                        alt=""
                    />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="#"
                                className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                            >
                                View Profile
                            </a>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="#"
                                className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                            >
                                Settings
                            </a>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="#"
                                className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                            >
                                Logout
                            </a>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

export default ProfileDropDown;