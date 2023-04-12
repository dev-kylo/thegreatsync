// @refresh reset
import Text_Image_Code from '../components/layout/screens/Text_Image_Code';
import type { PageStep, PageType } from '../types'
import { SyntheticEvent, useRef, useState } from 'react';
import Step from '../components/ui/Step';
import ControlBar from './ControlBar';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid'
import { ChevronDoubleLeftIcon } from '@heroicons/react/20/solid'
import Text_Image from '../components/layout/screens/Text_Image';

type PageStepsProps = {
    pageStep: PageStep,
    pageSteps: PageStep[],
    completeStep: (id: number) => void;
    showNextButton: boolean,
    type: PageType,
    nextPage: () => void,
    prevPage: () => void,
    nextStep: () => void
    prevStep: () => void
    goToStep: (ind: number) => void
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const PageSteps = ({ pageStep, pageSteps, completeStep, showNextButton, type, nextPage, prevPage, nextStep, prevStep, goToStep }: PageStepsProps) => {

    const stepsContainer = useRef<HTMLOListElement>(null);

    // REFACTOR INTO SINGLY LINKED LIST

    function getNextIndex(index: number, max: number, direction: 'left' | 'right', amount = 3) {
        let target = direction === 'right' ? index + amount : index - amount;
        if (target > max) target = max;
        else if (target < 0) target = 0;
        return target;
    }

    const handleClick = (ind: number) => {
       // if (ind === ) // check if index is the same
        completeStep(ind);
        goToStep(ind)
        // const isForwards = clickedStepIndex > currentStepIndex!;
        // scrollIntoView(clickedStepIndex, isForwards ? 'right' : 'left')
    }

    const handleNext = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        completeStep(0);
        nextStep();
        // setCurrent(pageSteps[nextStepIndex].id);
        // scrollIntoView(nextStepIndex, direction);
    }

    const handlePrev = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        completeStep(0);
        prevStep();
        // setCurrent(pageSteps[nextStepIndex].id);
        // scrollIntoView(nextStepIndex, direction);
    }

    // function scrollIntoView(indx: number, direction: 'left' | 'right', amount?: number) {
    //     const indexToScrollIntoView = getNextIndex(indx, pageSteps.length - 1, direction, amount);
    //     if (stepsContainer.current) stepsContainer.current.querySelector(`#step_${indexToScrollIntoView}`)!.scrollIntoView({ behavior: "smooth" })
    // }


    // const isLastStep = current === pageSteps[pageSteps.length - 1].id;
    // const isSecondLastStep = current === pageSteps[pageSteps.length - 2].id;
    // const currentTopicStep = pageSteps.find(stp => stp.id === current);

    const currentTopicStep = pageStep;

    return (
        <>

            {type === 'text_image_code' && <Text_Image_Code code={currentTopicStep?.code!} id={+currentTopicStep?.id!} text={currentTopicStep?.text!} image={currentTopicStep?.image!} showImageBorder={currentTopicStep?.transparent_image} />}

            {type === 'text_image' && <Text_Image id={+currentTopicStep?.id!} text={currentTopicStep?.text!} image={currentTopicStep?.image!} />}

            <ControlBar showNext={showNextButton} nextPage={nextPage} prevPage={prevPage}>
                <nav aria-label="Progress" className='flex scrollbar-thin scrollbar-none relative z-50  '>
                    <button className="text-white px-4 hover:text-primary_green" onClick={handlePrev}>
                        <ChevronDoubleLeftIcon className="m-auto h-8 w-8" aria-hidden="true" />
                    </button>
                    <div className='max-w-md overflow-hidden relative'>
                        {/* {pageSteps.length > 6 && current > 3 && <div className='fixed w-12 h-full bg-[#021e44bc] left-[3em] top-0 blur-sm scale-y-150 z-[100]'></div>} */}
                        <ol role="list" ref={stepsContainer} className="flex items-center ">
                            {pageSteps.map((step: PageStep, stepIdx: number) => (
                                <li key={step.id} id={`step_${stepIdx}`} className={classNames(stepIdx !== pageSteps.length - 1 ? 'pr-8 sm:pr-10' : '', 'relative', 'cursor-pointer')}>
                                    {/* <Step  {...step} orderNumber={stepIdx + 1} setCurrent={handleClick} status={step.id === current ? 'current' : step.status} /> */}
                                    <Step  {...step} orderNumber={stepIdx + 1} setCurrent={() =>handleClick(stepIdx)} status='default' />
                                </li>
                            ))}
                        </ol>
                        {/* {!isSecondLastStep && !isLastStep && pageSteps.length > 6 && <div className='fixed w-12 h-full bg-[#021e44e3] right-[3em] top-0 blur-sm scale-y-150 '></div>} */}
                    </div>
                    <button className="text-white px-4 hover:text-primary_green" onClick={handleNext}>
                        <ChevronDoubleRightIcon className="m-auto h-8 w-8" aria-hidden="true" />
                    </button>
                </nav>
            </ControlBar>
        </>
    );
}

export default PageSteps


