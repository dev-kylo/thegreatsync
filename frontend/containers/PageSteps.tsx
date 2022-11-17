// @refresh reset
import Text_Image_Code from '../components/layout/screens/Text_Image_Code';
import type { PageStep, PageType } from '../types'
import { useRef, useState } from 'react';
import Step from '../components/ui/Step';
import ControlBar from './ControlBar';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid'
import { ChevronDoubleLeftIcon } from '@heroicons/react/20/solid'
import Text_Image from '../components/layout/screens/Text_Image';

type PageStepsProps = {
    pageSteps: PageStep[],
    completeStep: (id: number) => void;
    showNextButton: boolean,
    type: PageType
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const PageSteps = ({ pageSteps, completeStep, showNextButton, type }: PageStepsProps) => {
    const [current, setCurrent] = useState(pageSteps[0].id); // Keeps Track of current id
    const stepsContainer = useRef<HTMLOListElement>(null);

    // REFACTOR INTO SINGLY LINKED LIST

    function getNextIndex(index: number, max: number, direction: 'left' | 'right', amount = 3) {
        let target = direction === 'right' ? index + amount : index - amount;
        if (target > max) target = max;
        else if (target < 0) target = 0;
        return target;
    }

    const handleClick = (id: number) => {
        const clickedStepIndex = pageSteps.findIndex(stp => stp.id === id);
        const currentStepIndex = pageSteps.findIndex(stp => stp.id === current);
        completeStep(current);
        setCurrent(id);
        const isForwards = clickedStepIndex > currentStepIndex!;
        scrollIntoView(clickedStepIndex, isForwards ? 'right' : 'left')
    }

    const handleNext = (direction: 'left' | 'right') => {
        let currentIndex = pageSteps.findIndex(stp => stp.id === current);
        const nextStepIndex = getNextIndex(currentIndex, pageSteps.length - 1, direction, 1);
        completeStep(current);
        setCurrent(pageSteps[nextStepIndex].id);
        scrollIntoView(nextStepIndex, direction);
    }

    function scrollIntoView(indx: number, direction: 'left' | 'right', amount?: number) {
        const indexToScrollIntoView = getNextIndex(indx, pageSteps.length - 1, direction, amount);
        if (stepsContainer.current) stepsContainer.current.querySelector(`#step_${indexToScrollIntoView}`)!.scrollIntoView({ behavior: "smooth" })
    }


    const isLastStep = current === pageSteps[pageSteps.length - 1].id;
    const isSecondLastStep = current === pageSteps[pageSteps.length - 2].id;
    const currentTopicStep = pageSteps.find(stp => stp.id === current);

    return (
        <>

            {type === 'text_image_code' && <Text_Image_Code code={currentTopicStep?.code!} id={+currentTopicStep?.id!} text={currentTopicStep?.text!} image={currentTopicStep?.image!} showImageBorder={currentTopicStep?.transparent_image} />}

            {type === 'text_image' && <Text_Image id={+currentTopicStep?.id!} text={currentTopicStep?.text!} image={currentTopicStep?.image!} />}

            <ControlBar showNext={showNextButton}>
                <nav aria-label="Progress" className='flex scrollbar-thin scrollbar-none relative z-50  '>
                    <button className="text-white px-4 hover:text-primary_green" onClick={() => handleNext('left')}>
                        <ChevronDoubleLeftIcon className="m-auto h-8 w-8" aria-hidden="true" />
                    </button>
                    <div className='max-w-md overflow-hidden relative'>
                        {pageSteps.length > 6 && current > 3 && <div className='fixed w-12 h-full bg-[#021e44bc] left-[3em] top-0 blur-sm scale-y-150 z-[100]'></div>}
                        <ol role="list" ref={stepsContainer} className="flex items-center ">
                            {pageSteps.map((step: PageStep, stepIdx: number) => (
                                <li key={step.id} id={`step_${stepIdx}`} className={classNames(stepIdx !== pageSteps.length - 1 ? 'pr-8 sm:pr-10' : '', 'relative')}>
                                    <Step  {...step} orderNumber={stepIdx + 1} setCurrent={handleClick} status={step.id === current ? 'current' : step.status} />
                                </li>
                            ))}
                        </ol>
                        {!isSecondLastStep && !isLastStep && pageSteps.length > 6 && <div className='fixed w-12 h-full bg-[#021e44e3] right-[3em] top-0 blur-sm scale-y-150 '></div>}
                    </div>
                    <button className="text-white px-4 hover:text-primary_green" onClick={() => handleNext('right')}>
                        <ChevronDoubleRightIcon className="m-auto h-8 w-8" aria-hidden="true" />
                    </button>
                </nav>
            </ControlBar>
        </>
    );
}

export default PageSteps


