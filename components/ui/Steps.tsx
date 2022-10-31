import { CheckIcon } from '@heroicons/react/20/solid'
import { useEffect, useRef, useState } from 'react'
import { TopicStepT } from '../../types'
import Step from './Step'


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type StepsProps = {
    updateTopicStep: (id: number) => void;
    scroll
}



export default function Steps({ updateTopicStep }: StepsProps) {

    const stepsContainer = useRef<HTMLOListElement>(null);


    const handleClick = (id: number) => {
        if (stepsContainer.current) stepsContainer.current.querySelector(`#step_${indexToScrollIntoView}`)!.scrollIntoView({ behavior: "smooth" })
    }


    return (
        <nav aria-label="Progress" className='w-lg overflow-hidden scrollbar-thin scrollbar-none relative z-50  '>
            <ol role="list" ref={stepsContainer} className="flex items-center">
                {subTopic.map((step: TopicStepT, stepIdx: number) => (
                    <li key={step.id} id={`step_${stepIdx}`} className={classNames(stepIdx !== subTopic.length - 1 ? 'pr-8 sm:pr-10' : '', 'relative')}>
                        <Step  {...step} setCurrent={handleClick} status={step.id === current ? 'current' : step.status} />
                    </li>
                ))}
            </ol>
            {!isSecondLastStep && !isLastStep && <div className='fixed w-12 h-full bg-[#021e44e3] right-[-5px] top-0 blur-sm scale-y-150 '></div>}
        </nav>
    )
}
