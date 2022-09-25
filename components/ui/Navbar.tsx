
import { Disclosure } from '@headlessui/react'
import { useState } from 'react'
import Burger from './Burger'
import ProfileDropDown from './ProfileDropdown'
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline'


export default function Navbar() {

    const [openMenu, setOpenMenu] = useState(false);


    return (
        <>
            <Disclosure as="nav" className="flex-shrink-0 bg-indigo-600">
                {({ open }: { open: boolean }) => (
                    <>
                        {/* Desktop */}
                        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">

                                {/* Course Menu Button */}
                                <Bars3CenterLeftIcon onClick={() => setOpenMenu(true)} className="block h-6 w-6" aria-hidden="true" />

                                <div className="hidden lg:block lg:w-80">
                                    <div className="flex items-center justify-end">
                                        <ProfileDropDown />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile */}
                        <Disclosure.Panel className="lg:hidden">
                            {/* Mobile menu button */}
                            <Burger open={open} />
                            <div className="px-2 pt-2 pb-3">
                                <Disclosure.Button
                                    as="a"
                                    href="#"
                                    className="block rounded-md bg-indigo-800 px-3 py-2 text-base font-medium text-white"
                                >
                                    Dashboard
                                    {/* Course Menu */}
                                </Disclosure.Button>
                            </div>
                            <div className="border-t border-indigo-800 pt-4 pb-3">
                                <div className="px-2">
                                    <ProfileDropDown mobile />
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </>
    )
}
