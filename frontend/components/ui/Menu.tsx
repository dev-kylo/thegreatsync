/* eslint-disable @typescript-eslint/no-use-before-define */
import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
import type { CurrentLocation, MenuItem } from '../../types';
import MenuIcon from './MenuIcon';
import ProgressIcon from './ProgressIcon';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

function MenuDropDown({ item, callback, current }: { item: MenuItem; callback: () => void; current: CurrentLocation }) {
    return (
        <Disclosure as="div" key={item.name} className="space-y-1">
            {({ open }) => (
                <div>
                    <Disclosure.Button
                        className={classNames(
                            item.current
                                ? `py-3 bg-gray-100 text-white pl-[${item.level}rem]`
                                : 'py-3 bg-transparent text-white hover:bg-gray-50 hover:text-gray-900',
                            'group w-full flex items-center pl-2 pr-1 py-2 text-left text-md font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
                            `${item.level === 2 ? 'pl-8' : item.level === 3 ? 'pl-20' : 'pl-4'}`
                        )}
                    >
                        <div className="pl-2 mr-8 w-6" id={`menu-${item.level}-${item.id}`}>
                            <ProgressIcon amount={item.progress} completed={!!item.completed} />
                        </div>
                        <span className="flex-1">{item.name}</span>
                        <svg
                            className={classNames(
                                open ? 'text-white rotate-90' : 'text-gray-300',
                                'ml-3 mr-4 h-6 w-6 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400'
                            )}
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                        </svg>
                    </Disclosure.Button>
                    <Disclosure.Panel className="space-y-1">
                        {/* {item.children && createMenuDropDownLink(item.children, callback, current)} */}
                        {item.children && (
                            <MenuDropDownLink
                                menuChildren={item.children}
                                callback={callback}
                                currentLocation={current}
                            />
                        )}
                    </Disclosure.Panel>
                </div>
            )}
        </Disclosure>
    );
}

function MenuDropDownLink({
    menuChildren,
    callback,
    currentLocation,
}: {
    menuChildren: MenuItem[];
    callback: () => void;
    currentLocation: CurrentLocation;
}) {
    const links = menuChildren.map((subItem) => {
        const { level, type, name, completed, children, href, current, id } = subItem;
        if (!children) {
            return (
                <Link href={href || '/'} passHref key={id}>
                    <Disclosure.Button
                        onClick={() => callback()}
                        key={name}
                        as="a"
                        className={`group flex w-full items-center rounded-md py-3 ${
                            level === 2 ? 'pl-8' : level === 3 ? 'pl-12 sm:pl-20' : 'pl-4'
                        } pr-2 text-md font-medium text-white hover:bg-gray-50 hover:text-gray-900 ${
                            +currentLocation.pageId === +id ? 'bg-gray-50 text-black' : ''
                        }`}
                    >
                        <button type="button" id={`menu-${level}-${id}`} onClick={() => console.log('Clicked')}>
                            {type && (
                                <MenuIcon
                                    type={type}
                                    completed={!!completed}
                                    active={!!current || +currentLocation.pageId === +id}
                                />
                            )}
                        </button>
                        {name}
                    </Disclosure.Button>
                </Link>
            );
        }
        return <MenuDropDown item={subItem} callback={callback} current={currentLocation} />;
    });

    return <div>{links}</div>;
}

const Menu = ({
    menuData,
    closeMenu,
    markPage,
    current,
}: {
    menuData: MenuItem[];
    closeMenu: () => void;
    markPage: (page: string, unMark?: boolean) => void;
    current: CurrentLocation;
}) => {
    const menuLinks = menuData.map((item) => (
        <MenuDropDownLink menuChildren={item.children!} callback={closeMenu} currentLocation={current} />
    ));
    return <div>{menuLinks}</div>;
};

export default Menu;
