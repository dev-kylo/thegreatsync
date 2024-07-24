/* eslint-disable @typescript-eslint/no-use-before-define */
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import Link from 'next/link';
import type { CurrentLocation, MenuItem } from '../../types';
import MenuIcon from './MenuIcon';
import ProgressIcon from './ProgressIcon';
import HoverAction from './HoverAction';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

function MenuDropDown({
    item,
    callback,
    current,
    markPage,
}: {
    item: MenuItem;
    callback: () => void;
    current: CurrentLocation;
    markPage?: (page: string | number, unMark?: boolean) => Promise<void>;
}) {
    // check if submenu should be open
    const isActive =
        (current?.chapterId && item.level === 1 && +current.chapterId === +item.id) ||
        (current?.subchapterId && item.level === 2 && +current.subchapterId === +item.id);

    return (
        <Disclosure as="div" key={item.name} className="space-y-1" defaultOpen={!!isActive}>
            {({ open }) => (
                <div>
                    <DisclosureButton
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
                    </DisclosureButton>
                    <DisclosurePanel className="space-y-1">
                        {item.children && (
                            <MenuDropDownLink
                                menuChildren={item.children}
                                callback={callback}
                                currentLocation={current}
                                markPage={markPage}
                            />
                        )}
                    </DisclosurePanel>
                </div>
            )}
        </Disclosure>
    );
}

function MenuDropDownLink({
    menuChildren,
    callback,
    currentLocation,
    markPage,
}: {
    menuChildren: MenuItem[];
    callback: () => void;
    currentLocation: CurrentLocation;
    markPage?: (page: string | number, unMark?: boolean) => Promise<void>;
}) {
    const links = menuChildren.map((subItem) => {
        const { level, type, name, completed, children, href, current, id } = subItem;
        if (!children) {
            const isActive = !!current || +currentLocation.pageId === +id;
            return (
                <Link href={href || '/'} passHref key={`menu-${level}-${id}`}>
                    <DisclosureButton
                        onClick={() => callback()}
                        key={name}
                        as="span"
                        className={`group flex w-full items-center rounded-md py-3 ${
                            level === 2 ? 'pl-8' : level === 3 ? 'pl-12 sm:pl-20' : 'pl-4'
                        } pr-2 text-md font-medium hover:bg-gray-50 hover:text-gray-900 ${
                            isActive ? 'bg-gray-50 text-black' : 'text-white'
                        }`}
                    >
                        <button type="button" id={`menu-${level}-${id}`} onClick={() => console.log('menu opened')}>
                            {type && markPage && (
                                <HoverAction pageId={id} action={markPage} unMark={!!completed}>
                                    <MenuIcon type={type} completed={!!completed} active={isActive} />
                                </HoverAction>
                            )}
                        </button>
                        {name}
                    </DisclosureButton>
                </Link>
            );
        }
        return (
            <MenuDropDown
                key={`menu-${level}-${id}`}
                item={subItem}
                callback={callback}
                current={currentLocation}
                markPage={markPage}
            />
        );
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
    markPage?: (page: string | number, unMark?: boolean) => Promise<void>;
    current: CurrentLocation;
}) => {
    const menuLinks = menuData.map((item) => (
        <MenuDropDown key={`${item.id}-1`} item={item} callback={closeMenu} current={current} markPage={markPage} />
    ));
    return <div>{menuLinks}</div>;
};

export default Menu;
