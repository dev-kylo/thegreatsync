
import { Disclosure } from '@headlessui/react'
import Burger from './Burger'
import ProfileDropDown from './ProfileDropdown'


export default function Example() {
    return (
        <>
            <Disclosure as="nav" className="flex-shrink-0 bg-indigo-600">
                {({ open }: { open: boolean }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <Burger open={open} />

                                <div className="hidden lg:block lg:w-80">
                                    <div className="flex items-center justify-end">
                                        <ProfileDropDown />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="lg:hidden">
                            <div className="px-2 pt-2 pb-3">
                                <Disclosure.Button
                                    as="a"
                                    href="#"
                                    className="block rounded-md bg-indigo-800 px-3 py-2 text-base font-medium text-white"
                                >
                                    Dashboard
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
