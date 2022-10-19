import { CheckIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { ImageStep } from '../../types'
import Step from './Step'

const stepsD: ImageStep[] = [
    { name: 'Step 1', id: 1, status: 'complete' },
    { name: 'Step 2', id: 2, status: 'complete' },
    { name: 'Step 3', id: 3, status: 'current' },
    { name: 'Step 4', id: 4, status: 'default' },
    { name: 'Step 5', id: 5, status: 'default' },
    { name: 'Step 4', id: 6, status: 'default' },
    { name: 'Step 5', id: 7, status: 'default' },
    { name: 'Step 4', id: 8, status: 'default' },
    { name: 'Step 5', id: 9, status: 'default' },
    { name: 'Step 4', id: 10, status: 'default' },
    { name: 'Step 5', id: 11, status: 'default' },
    { name: 'Step 5', id: 12, status: 'default' },
    { name: 'Step 4', id: 13, status: 'default' },
    { name: 'Step 5', id: 14, status: 'default' },
    { name: 'Step 4', id: 15, status: 'default' },
    { name: 'Step 5', id: 16, status: 'default' },
]

const completed = [0, 1, 2, 3, 4];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Steps() {

    const [current, setCurrent] = useState(stepsD[0].id);
    const nextIndex = 0;

    const handleClick = (id: number) => {
        console.log(`The current ID is ${id}`)
        setCurrent(id);
    }

    const isLastStep = current === stepsD[stepsD.length - 1].id;

    return (
        <nav aria-label="Progress" className='max-w-lg overflow-hidden scrollbar-thin scrollbar-none relative z-50'>
            <ol role="list" className="flex items-center">
                {stepsD.map((step: ImageStep, stepIdx: number) => (
                    <li key={step.id} className={classNames(stepIdx !== stepsD.length - 1 ? 'pr-8 sm:pr-10' : '', 'relative')}>
                        <Step {...step} setCurrent={handleClick} status={step.id === current ? 'current' : completed.includes(step.id) ? 'complete' : 'default'} />
                    </li>
                ))}
            </ol>
            {((current !== stepsD[stepsD.length - 2].id) || !isLastStep) && <div className='fixed w-12 h-full bg-[#021e44e3] right-[-5px] top-0 blur-sm scale-y-150 '></div>}
        </nav>
    )
}
