import { Disclosure } from '@headlessui/react';
import Link from 'next/link';
// import { mockMenu } from '../../mocks/MockMenu'
import type { MenuItem } from '../../types';
import MenuIcon from './MenuIcon';
import ProgressIcon from './ProgressIcon';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

function createMenuLink(item: MenuItem) {
    return (
        <Link href={item.href!} passHref>
            <div key={item.name}>
                <a
                    className={classNames(
                        item.current
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group w-full flex items-center pl-2 py-2 text-sm font-medium rounded-md'
                    )}
                >
                    Icon
                    {item.name}
                </a>
            </div>
        </Link>
    );
}

function createMenuDropDown(item: MenuItem) {
    return (
        <Disclosure as="div" key={item.name} className="space-y-1">
            {({ open }) => (
                <>
                    <Disclosure.Button
                        className={classNames(
                            item.current
                                ? `py-3 bg-gray-100 text-white pl-[${item.level}rem]`
                                : 'py-3 bg-transparent text-white hover:bg-gray-50 hover:text-gray-900',
                            'group w-full flex items-center pl-2 pr-1 py-2 text-left text-md font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500',
                            `${item.level === 2 ? 'pl-8' : item.level === 3 ? 'pl-20' : 'pl-4'}`
                        )}
                    >
                        <div className="pl-2 mr-8 w-6">
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
                        {item.children && createMenuDropDownLink(item.children)}
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}

function createMenuDropDownLink(menuChildren: MenuItem[]) {
    return menuChildren.map((subItem) => {
        const { level, type, name, completed, children, href, current } = subItem;
        if (!children) {
            return (
                <Disclosure.Button
                    key={name}
                    as="a"
                    href={href}
                    className={`group flex w-full items-center rounded-md py-3 ${
                        level === 2 ? 'pl-8' : level === 3 ? 'pl-20' : 'pl-4'
                    } pr-2 text-md font-medium text-white hover:bg-gray-50 hover:text-gray-900`}
                >
                    {type && <MenuIcon type={type} completed={!!completed} active={!!current} />}
                    {name}
                </Disclosure.Button>
            );
        }
        return createMenuDropDown(subItem);
    });
}

export default function Menu({ menuData }: { menuData: MenuItem[] }): JSX.Element[] {
    const menuLinks = menuData.map((item) => (!item.children ? createMenuLink(item) : createMenuDropDown(item)));
    return menuLinks;
}
