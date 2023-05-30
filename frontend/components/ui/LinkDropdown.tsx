/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import ExternalLink from './ExternalLink';
import { ResourceLink } from '../../types';

const ResourceDropDown = ({ links }: { links: ResourceLink[] }) => {
    return (
        <Menu as="div" className="relative flex-shrink-0">
            <div className="hover:scale-105">
                <Menu.Button className="flex rounded-full bg-primary_blue px-4 py-0.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-700">
                    <span className="sr-only">Open user menu</span>
                    Resources
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
                <Menu.Items className="absolute left-1/2 transform -translate-x-1/2 z-10 mt-2 w-80 xl:w-96 origin-top-right rounded-md bg-[#80808063] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {links.map((link) => (
                        <Menu.Item>
                            <div className="flex w-full items-center justify-between py-1 pr-5 text-sm ">
                                <ExternalLink
                                    type={link.type}
                                    title={link.title}
                                    subtitle={link.subtitle}
                                    link={link.external_url || link.file.data?.attributes.url || ''}
                                />
                            </div>
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default ResourceDropDown;
