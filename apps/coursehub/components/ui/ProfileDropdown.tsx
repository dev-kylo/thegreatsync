/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useContext } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { NavContext } from '../../context/nav';

const ProfileDropDown = ({ mobile }: { mobile?: boolean }) => {
    const { courseId } = useContext(NavContext);
    if (mobile)
        return (
            <div className="block md:hidden">
                <Link href="/courses" className="block px-4 py-3 text-[1rem] text-white">
                    All Courses
                </Link>
                <a href="#" className="block px-4 py-3 text-[1rem] text-white">
                    Dashboard
                </a>
                <Link href="/user/account" className={` block px-4 py-3 text-[1rem] text-white`}>
                    Account
                </Link>
                <a
                    type="button"
                    onClick={() => signOut()}
                    className={` block px-4 py-3 text-[1rem] text-white hover:cursor-pointer`}
                >
                    Logout
                </a>
                <div className="w-[90%] mx-auto my-2 border-b-2 text-slate-500" />
            </div>
        );

    return (
        <Menu as="div" className="relative flex-shrink-0">
            <div className="hover:scale-110">
                <MenuButton className="flex rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
                    <span className="sr-only">Open user menu</span>
                    <div className="w-10 p-1 pt-2">
                        <Image
                            src="https://res.cloudinary.com/the-great-sync/image/upload/c_fit,w_50/v1684818397/Scope_Sphere_rrzm5s.png"
                            alt="profile"
                            width="50"
                            height="50"
                        />
                    </div>
                </MenuButton>
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
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {courseId && (
                        <Link href={`/courses/${courseId}`}>
                            <MenuItem>
                                {({ focus }) => (
                                    <span
                                        className={`${
                                            focus ? 'bg-gray-100' : ''
                                        } block px-4 py-2 text-sm text-gray-700`}
                                    >
                                        Dashboard
                                    </span>
                                )}
                            </MenuItem>
                        </Link>
                    )}

                    {courseId && (
                        <Link href={`/courses/${courseId}/reflections`}>
                            <MenuItem>
                                {({ focus }) => (
                                    <span
                                        className={`${
                                            focus ? 'bg-gray-100' : ''
                                        } block px-4 py-2 text-sm text-gray-700`}
                                    >
                                        Reflections
                                    </span>
                                )}
                            </MenuItem>
                        </Link>
                    )}

                    <MenuItem>
                        {({ focus }) => (
                            <Link
                                passHref
                                href="/courses"
                                className={`${focus ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                            >
                                All Courses
                            </Link>
                        )}
                    </MenuItem>

                    <MenuItem>
                        {({ focus }) => (
                            <a
                                href={`${process.env.NEXT_PUBLIC_DISCORD_INVITE}`}
                                className={`${focus ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Syncer Community
                            </a>
                        )}
                    </MenuItem>

                    <MenuItem>
                        {({ focus }) => (
                            <Link
                                href="/user/account"
                                className={`${focus ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                            >
                                Account
                            </Link>
                        )}
                    </MenuItem>
                    <MenuItem>
                        {({ focus }) => (
                            <a
                                type="button"
                                onClick={() => signOut()}
                                className={`${
                                    focus ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700 hover:cursor-pointer`}
                            >
                                Logout
                            </a>
                        )}
                    </MenuItem>
                </MenuItems>
            </Transition>
        </Menu>
    );
};

export default ProfileDropDown;
