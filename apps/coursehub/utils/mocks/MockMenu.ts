// import type { MenuItem } from "../../types"
export const mockMenu = [
    {
        name: 'Course Structure and Setup',
        current: false,
        href: '#', level: 1,
        progress: 100,
        completed: true,
        children: [
            {
                name: 'Learning Strategy',
                completed: true,
                level: 2,
                children: [
                    {
                        name: 'Cultivate a learning strategy',
                        completed: true,
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'Mnemonics applied to programming',
                        completed: true,
                        href: '#',
                        level: 3,
                        type: 'read'
                    },
                    {
                        name: 'The benefits of testing',
                        completed: true,
                        href: '#',
                        level: 3,
                        type: 'read'
                    },
                    {
                        name: 'What to memorise',
                        completed: true,
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                ]
            },
            {
                name: 'Your Learning Process',
                completed: true,
                href: '#',
                level: 2,
                type: 'watch',
                children: [
                    {
                        name: 'Step by step learning process',
                        completed: true,
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'Process summary',
                        completed: true,
                        href: '#',
                        level: 3,
                        type: 'read'
                    },
                    {
                        name: 'How to use Anki',
                        completed: true,
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'Anki step by step',
                        completed: true,
                        href: '#',
                        level: 3,
                        type: 'read'
                    },
                    {
                        name: 'Coding and running snippets',
                        completed: true,
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                ]
            },
        ]
    },
    {
        name: 'Step Inside a Program',
        level: 1,
        progress: 10,
        current: false,
        children: [
            {
                name: 'Investigation',
                progress: 40,
                level: 2,
                children: [
                    {
                        name: 'Time to investigate',
                        href: '#',
                        level: 3,
                        type: 'play'
                    },
                    {
                        name: 'Investigation Resources',
                        href: '#',
                        level: 3,
                        type: 'read'
                    },
                ]
            },
            {
                name: 'The Environment',
                href: '#',
                level: 2,
                children: [
                    {
                        name: 'Where javascript lives',
                        completed: false,
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'Values: what javascript is made of',
                        href: '#',
                        level: 3,
                        type: 'imagine'
                    },
                    {
                        name: 'Expressions: genies find values',
                        href: '#',
                        level: 3,
                        type: 'imagine'
                    },
                    {
                        name: 'Primitives - the natural ones',
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'You can always find undefined',
                        href: '#',
                        level: 3,
                        type: 'imagine'
                    },
                    {
                        name: 'Equality of primitives',
                        href: '#',
                        level: 3,
                        type: 'read'
                    },
                ]
            },
            {
                name: 'Variables and Declarations',
                href: '#',
                level: 2,
                children: [
                    {
                        name: 'Variables and Declarations',
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'ASS..ignment',
                        href: '#',
                        level: 3,
                        type: 'imagine'
                    },
                    {
                        name: 'Const vs Let vs Var',
                        href: '#',
                        level: 3,
                        type: 'imagine'
                    },
                    {
                        name: 'Hoisting - the beginning',
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'Declarations, statements and annoying politicians',
                        href: '#',
                        level: 3,
                        type: 'imagine'
                    },
                ]
            },
            {
                name: 'Operating on Values',
                href: '#',
                level: 2,
                children: [
                    {
                        name: 'Operations - the genetic scientists',
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'Visualise ++',
                        href: '#',
                        level: 3,
                        type: 'imagine'
                    },

                ]
            },
            {
                name: 'Synchronous Flow',
                href: '#',
                level: 2,
                children: [
                    {
                        name: 'Down the sink - running synchronously',
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'Visualise conditionals',
                        href: '#',
                        level: 3,
                        type: 'imagine'
                    },
                    {
                        name: 'Use expressions and variables like a senior',
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },

                ]
            },
            {
                name: 'Put to Practice',
                href: '#',
                level: 2,
                children: [
                    {
                        name: 'Write this pseudocode',
                        href: '#',
                        level: 3,
                        type: 'code'
                    },
                    {
                        name: 'Conditional flow',
                        href: '#',
                        level: 3,
                        type: 'draw'
                    },
                    {
                        name: 'Challenge',
                        href: '#',
                        level: 3,
                        type: 'watch'
                    },
                    {
                        name: 'Q&A',
                        href: '#',
                        level: 3,
                        type: 'read'
                    },

                ]
            },
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
