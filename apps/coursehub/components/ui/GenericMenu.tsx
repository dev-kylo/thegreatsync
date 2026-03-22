/**
 * Generic Menu Component
 * Reusable hierarchical menu that matches Menu.tsx styling but is domain-agnostic
 */

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import type { GenericMenuItem } from '../../types';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

interface GenericMenuProps<T = any> {
    items: GenericMenuItem<T>[];
    onItemClick: (item: GenericMenuItem<T>) => void;
    activeItemId?: string | number;
    onClose?: () => void;
}

function GenericMenuItemComponent<T>({
    item,
    onItemClick,
    activeItemId,
    onClose,
}: {
    item: GenericMenuItem<T>;
    onItemClick: (item: GenericMenuItem<T>) => void;
    activeItemId?: string | number;
    onClose?: () => void;
}) {
    const hasChildren = item.children && item.children.length > 0;

    // Check if this item is active, OR if any of its children are active
    const isActive = activeItemId === item.id ||
        (hasChildren && item.children!.some(child => child.id === activeItemId));

    // Disabled item (non-clickable)
    if (item.isDisabled) {
        return (
            <div
                className={classNames(
                    'py-3 bg-transparent text-gray-500 cursor-not-allowed',
                    'group w-full flex items-center pl-2 pr-1 py-2 text-left text-md font-medium rounded-md',
                    item.level === 2 ? 'pl-8' : item.level === 3 ? 'pl-20' : 'pl-4'
                )}
            >
                {item.icon && <div className="mr-4">{item.icon}</div>}
                <span className="flex-1">{item.name}</span>
            </div>
        );
    }

    // Parent item with children (Disclosure)
    if (hasChildren) {
        return (
            <Disclosure as="div" key={item.id} className="space-y-1" defaultOpen={isActive}>
                {({ open }) => (
                    <div>
                        <DisclosureButton
                            className={classNames(
                                isActive
                                    ? 'py-3 bg-gray-100 text-black'
                                    : 'py-3 bg-transparent text-white hover:bg-gray-50 hover:text-gray-900',
                                'group w-full flex items-center pl-2 pr-1 py-2 text-left text-md font-medium rounded-md',
                                'focus:outline-none focus:ring-2 focus:ring-indigo-500',
                                item.level === 2 ? 'pl-8' : item.level === 3 ? 'pl-20' : 'pl-4'
                            )}
                        >
                            {item.icon && <div className="mr-4">{item.icon}</div>}
                            <span className="flex-1">{item.name}</span>
                            <ChevronRightIcon
                                className={classNames(
                                    open ? 'text-white rotate-90' : 'text-gray-300',
                                    'ml-3 mr-4 h-6 w-6 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400'
                                )}
                            />
                        </DisclosureButton>
                        <DisclosurePanel className="space-y-1">
                            {item.children!.map((child) => (
                                <GenericMenuItemComponent
                                    key={child.id}
                                    item={child}
                                    onItemClick={onItemClick}
                                    activeItemId={activeItemId}
                                    onClose={onClose}
                                />
                            ))}
                        </DisclosurePanel>
                    </div>
                )}
            </Disclosure>
        );
    }

    // Leaf item (clickable)
    return (
        <button
            type="button"
            onClick={() => {
                onItemClick(item);
                onClose?.();
            }}
            className={classNames(
                isActive ? 'bg-gray-50 text-black' : 'text-white hover:bg-gray-50 hover:text-gray-900',
                'group flex w-full items-center rounded-md py-3 pr-2 text-md font-medium',
                item.level === 2 ? 'pl-8' : item.level === 3 ? 'pl-12 sm:pl-20' : 'pl-4'
            )}
        >
            {item.icon && <div className="mr-4">{item.icon}</div>}
            <span className="flex-1 text-left">{item.name}</span>
        </button>
    );
}

export default function GenericMenu<T = any>({
    items,
    onItemClick,
    activeItemId,
    onClose,
}: GenericMenuProps<T>) {
    return (
        <div>
            {items.map((item) => (
                <GenericMenuItemComponent
                    key={item.id}
                    item={item}
                    onItemClick={onItemClick}
                    activeItemId={activeItemId}
                    onClose={onClose}
                />
            ))}
        </div>
    );
}
