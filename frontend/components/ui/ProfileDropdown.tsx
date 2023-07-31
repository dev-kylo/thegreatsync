/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment, useContext } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { NavContext } from '../../context/nav';

const ProfileDropDown = ({ mobile }: { mobile?: boolean }) => {
    const { courseId } = useContext(NavContext);
    if (mobile)
        return (
            <div className="block md:hidden">
                <Link passHref href="/courses">
                    <a href="#" className={` block px-4 py-3 text-[1rem] text-white`}>
                        All Courses
                    </a>
                </Link>
                <a href="#" className={` block px-4 py-3 text-[1rem] text-white`}>
                    Dashboard
                </a>
                <Link href="/user/account">
                    <a href="#" className={` block px-4 py-3 text-[1rem] text-white`}>
                        Account
                    </a>
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
                <Menu.Button className="flex rounded-full bg-indigo-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
                    <span className="sr-only">Open user menu</span>
                    <Image
                        src="https://res.cloudinary.com/the-great-sync/image/upload/c_fit,w_50/v1684818397/Scope_Sphere_rrzm5s.png"
                        alt="profile"
                        width="50"
                        height="50"
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
                    {courseId && (
                        <Link passHref href={`/courses/${courseId}`}>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={`${
                                            active ? 'bg-gray-100' : ''
                                        } block px-4 py-2 text-sm text-gray-700`}
                                    >
                                        Dashboard
                                    </a>
                                )}
                            </Menu.Item>
                        </Link>
                    )}

                    <Menu.Item>
                        {({ active }) => (
                            <Link passHref href="/courses">
                                <a
                                    href="#"
                                    className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                >
                                    All Courses
                                </a>
                            </Link>
                        )}
                    </Menu.Item>

                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href={`${process.env.NEXT_PUBLIC_DISCORD_INVITE}`}
                                className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Syncer Community
                            </a>
                        )}
                    </Menu.Item>

                    <Menu.Item>
                        {({ active }) => (
                            <Link passHref href="/user/account">
                                <a
                                    href="#"
                                    className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}
                                >
                                    Account
                                </a>
                            </Link>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                type="button"
                                onClick={() => signOut()}
                                className={`${
                                    active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700 hover:cursor-pointer`}
                            >
                                Logout
                            </a>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default ProfileDropDown;
