import { CheckIcon } from '@heroicons/react/20/solid'
import { useEffect, useRef, useState } from 'react'
import { ImageStep } from '../../types'
import Step from './Step'

const stepsD: ImageStep[] = [
    { name: 'Step 1', orderNumber: 1, id: 1, status: 'complete' },
    { name: 'Step 2', orderNumber: 2, id: 2, status: 'complete' },
    { name: 'Step 3', orderNumber: 3, id: 3, status: 'current' },
    { name: 'Step 4', orderNumber: 4, id: 4, status: 'default' },
    { name: 'Step 5', orderNumber: 5, id: 5, status: 'default' },
    { name: 'Step 4', orderNumber: 6, id: 6, status: 'default' },
    { name: 'Step 5', orderNumber: 7, id: 7, status: 'default' },
    { name: 'Step 4', orderNumber: 8, id: 8, status: 'default' },
    { name: 'Step 5', orderNumber: 9, id: 9, status: 'default' },
    { name: 'Step 4', orderNumber: 10, id: 10, status: 'default' },
    { name: 'Step 5', orderNumber: 11, id: 11, status: 'default' },
    { name: 'Step 5', orderNumber: 12, id: 12, status: 'default' },
    { name: 'Step 4', orderNumber: 13, id: 13, status: 'default' },
    { name: 'Step 5', orderNumber: 14, id: 14, status: 'default' },
    { name: 'Step 4', orderNumber: 15, id: 15, status: 'default' },
    { name: 'Step 5', orderNumber: 16, id: 16, status: 'default' },
]

const completed = [0, 1, 2, 3, 4];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Steps() {

    const [current, setCurrent] = useState(1);
    const stepsContainer = useRef<HTMLOListElement>(null);

    function getNextIndex(index: number, max: number, direction: 'left' | 'right') {
        let target = direction === 'right' ? index + 3 : index - 3;
        if (target > max) target = max;
        else if (target < 0) target = 0;
        return target;
    }

    const handleClick = (id: number) => {
        const clickedStepIndex = stepsD.findIndex(stp => stp.id === id);
        const currentStep = stepsD.find(stp => stp.id === current);
        setCurrent(id);
        const isForwards = stepsD[clickedStepIndex]!.orderNumber > currentStep!.orderNumber;
        const indexToScrollIntoView = getNextIndex(clickedStepIndex, stepsD.length - 1, isForwards ? 'right' : 'left');
        if (stepsContainer.current) stepsContainer.current.querySelector(`#step_${indexToScrollIntoView}`)!.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {

    }, [current])

    const isLastStep = current === stepsD[stepsD.length - 1].id;
    const isSecondLastStep = current === stepsD[stepsD.length - 2].id;

    return (
        <nav aria-label="Progress" className='max-w-lg overflow-hidden scrollbar-thin scrollbar-none relative z-50  '>
            <ol role="list" ref={stepsContainer} className="flex items-center">
                {stepsD.map((step: ImageStep, stepIdx: number) => (
                    <li key={step.id} id={`step_${stepIdx}`} className={classNames(stepIdx !== stepsD.length - 1 ? 'pr-8 sm:pr-10' : '', 'relative')}>
                        <Step  {...step} setCurrent={handleClick} status={step.id === current ? 'current' : completed.includes(step.id) ? 'complete' : 'default'} />
                    </li>
                ))}
            </ol>
            {!isSecondLastStep && !isLastStep && <div className='fixed w-12 h-full bg-[#021e44e3] right-[-5px] top-0 blur-sm scale-y-150 '></div>}
        </nav>
    )
}
