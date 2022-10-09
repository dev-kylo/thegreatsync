import { Disclosure } from '@headlessui/react'
import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/24/outline'

type MenuItem = {
    name: string;
    current?: boolean;
    level: number,
    href?: string;
    children?: MenuItem[]
}


const navigation: MenuItem[] = [
    { name: 'Course Structure and Setup', current: false, href: '#', level: 1, children: [{ name: 'The Environment', href: '#', level: 2 }] },
    {
        name: 'Step Inside a Program',
        level: 1,
        current: false,
        children: [
            {
                name: 'Investigation',
                level: 2,
                children: [
                    {
                        name: 'Investigation Video',
                        href: '#',
                        level: 3,
                    },
                ]
            },
            { name: 'The Environment', href: '#', level: 2 },
            { name: 'Variables and Declarations', href: '#', level: 2 },
            { name: 'Operating on Values', href: '#', level: 2 },
        ],
    },
    {
        name: 'The Secret to Objects',
        current: false,
        level: 1,
        children: [
            {
                name: 'Investigation', href: '#', level: 2, children: [
                    {
                        name: 'Investigation Video',
                        href: '#',
                        level: 3,
                    },
                ]
            },
            { name: 'Objects are Ships', href: '#', level: 2 },
            { name: 'Pass by Reference vs Value', href: '#', level: 2 },
            { name: 'What cloning really is', href: '#', level: 2 },
            { name: 'Put to Practice', href: '#', level: 2 },
        ],
    },
    {
        name: 'Mysterious Functions',
        level: 1,
        current: false,
        children: [
            {
                name: 'Investigation', href: '#', level: 2, children: [
                    {
                        name: 'Investigation Video',
                        href: '#',
                        level: 3,
                    },
                ]
            },
            { name: 'A Function Model', href: '#', level: 2 },
            { name: 'Declaring and Executing Functions', href: '#', level: 2 },
            { name: 'Methods', href: '#', level: 2 },
            { name: 'Senior vs Junior Functions', href: '#', level: 2 },
            { name: 'Callbacks and Higer Order Functions', href: '#', level: 2 },
            { name: 'Put to Practice', href: '#', level: 2 },
        ],
    },
    {
        name: 'In Scope and Out of Scope',
        current: false,
        level: 1,
        children: [
            {
                name: 'Investigation', href: '#', level: 2, children: [
                    {
                        name: 'Investigation Video',
                        href: '#',
                        level: 3,
                    },
                ]
            },
            { name: 'The Creation Phase', href: '#', level: 2 },
            { name: 'Global Scope vs Global Object', href: '#', level: 2 },
            { name: 'Function Scope', href: '#', level: 2 },
            { name: 'Block Scope', href: '#', level: 2 },
            { name: 'Closures', href: '#', level: 2 },
            { name: 'IFFEs', href: '#', level: 2 },
            { name: 'Put To Practice', href: '#', level: 2 },
        ],
    },
    {
        name: 'Loops and Higher Order Function Loops',
        level: 1,
        current: false,
        children: [
            {
                name: 'Investigation', href: '#', level: 2, children: [
                    {
                        name: 'Investigation Video',
                        href: '#',
                        level: 3,
                    },
                ]
            },
            { name: 'Loops Visualised', href: '#', level: 2 },
            { name: 'Array Method Loops', href: '#', level: 2 },
            { name: 'Put To Ptactice', href: '#', level: 2 },
        ],
    },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

function createMenuLink(item: MenuItem) {
    <div key={item.name}>
        <a
            href="#"
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
}

function createMenuDropDownLink(children: MenuItem[]) {
    return children.map((subItem) => {
        if (!subItem.children) {
            return (
                <Disclosure.Button
                    key={subItem.name}
                    as="a"
                    href={subItem.href}
                    className={`group flex w-full items-center rounded-md py-2 ${subItem.level === 2 ? 'pl-8' : subItem.level === 3 ? 'pl-16' : 'pl-1'} pr-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
                >
                    {subItem.name}
                </Disclosure.Button>
            )
        }
        return createMenuDropDown(subItem)
    })
}

function createMenuDropDown(item: MenuItem) {
    return (
        <Disclosure as="div" key={item.name} className="space-y-1 ">
            {({ open }) => (
                <>
                    <Disclosure.Button
                        className={classNames(
                            item.current
                                ? `bg-gray-100 text-gray-900 pl-[${item.level}rem]`
                                : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                            'group w-full flex items-center pl-2 pr-1 py-2 text-left text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
                            , `${item.level === 2 ? 'pl-8' : item.level === 3 ? 'pl-16' : 'pl-1'}`)}
                    >
                        Icon.
                        <span className="flex-1">{item.name}</span>
                        <svg
                            className={classNames(
                                open ? 'text-gray-400 rotate-90' : 'text-gray-300',
                                'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400'
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
    )
}

export default function Menu() {
    return navigation.map((item) =>
        !item.children ? createMenuLink(item) : createMenuDropDown(item)
    )
}
