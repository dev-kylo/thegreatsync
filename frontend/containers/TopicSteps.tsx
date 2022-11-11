// @refresh reset
import Text_Image_Code from '../components/layout/screens/Text_Image_Code';
import Navbar from '../components/ui/Navbar';
import type { TopicStepT } from '../types'
import { useRef, useState } from 'react';
import Step from '../components/ui/Step';
import ControlBar from './ControlBar';
import { ChevronDoubleRightIcon } from '@heroicons/react/20/solid'
import { ChevronDoubleLeftIcon } from '@heroicons/react/20/solid'
import Layout from '../components/layout';

type TopicStepsProps = {
    topicSteps: TopicStepT[],
    completeStep: (id: number) => void;
    title: string,
    showNextButton: boolean
}

function nextStepAfterLastCompleted(ar: TopicStepT[] = []): number {
    const filtered = ar.filter((stp => stp.status === 'complete'));
    if (filtered.length < 1) return 1;
    if (filtered.length === ar.length) return filtered[filtered.length - 1].orderNumber;
    return filtered[filtered.length - 1].orderNumber + 1
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

const TopicSteps = ({ topicSteps, title, completeStep, showNextButton }: TopicStepsProps) => {
    const [current, setCurrent] = useState(nextStepAfterLastCompleted(topicSteps)); // Keeps Track of current Order Number
    const stepsContainer = useRef<HTMLOListElement>(null);

    // REFACTOR INTO SINGLY LINKED LIST

    function getNextIndex(index: number, max: number, direction: 'left' | 'right', amount = 3) {
        let target = direction === 'right' ? index + amount : index - amount;
        if (target > max) target = max;
        else if (target < 0) target = 0;
        return target;
    }

    const handleClick = (id: number) => {
        const clickedStepIndex = topicSteps.findIndex(stp => stp.id === id);
        const currentStep = topicSteps.find(stp => stp.id === current);
        completeStep(current);
        setCurrent(id);
        const isForwards = topicSteps[clickedStepIndex]!.orderNumber > currentStep!.orderNumber;
        scrollIntoView(clickedStepIndex, isForwards ? 'right' : 'left')
    }

    const handleNext = (direction: 'left' | 'right') => {
        let currentIndex = topicSteps.findIndex(stp => stp.id === current);
        const nextStepIndex = getNextIndex(currentIndex, topicSteps.length - 1, direction, 1);
        completeStep(current);
        setCurrent(topicSteps[nextStepIndex].id);
        scrollIntoView(nextStepIndex, direction);
    }

    function scrollIntoView(indx: number, direction: 'left' | 'right', amount?: number) {
        const indexToScrollIntoView = getNextIndex(indx, topicSteps.length - 1, direction, amount);
        if (stepsContainer.current) stepsContainer.current.querySelector(`#step_${indexToScrollIntoView}`)!.scrollIntoView({ behavior: "smooth" })
    }


    const isLastStep = current === topicSteps[topicSteps.length - 1].id;
    const isSecondLastStep = current === topicSteps[topicSteps.length - 2].id;
    const currentTopicStep = topicSteps.find(stp => stp.id === current);

    return (
        <>
            <Layout>
                <Navbar title={title} />
                {/* <Video /> */}
                {currentTopicStep && <Text_Image_Code code={currentTopicStep?.code!} id={+currentTopicStep.id!} text={currentTopicStep?.text!} image={currentTopicStep?.image!} />}
                {/* <TextCode_Image md={md} /> */}
                {/* <Text_Image md={md} /> */}
                <ControlBar showNext={showNextButton}>
                    <nav aria-label="Progress" className='flex scrollbar-thin scrollbar-none relative z-50  '>
                        <button className="text-white px-4 hover:text-primary_green" onClick={() => handleNext('left')}>
                            <ChevronDoubleLeftIcon className="m-auto h-8 w-8" aria-hidden="true" />
                        </button>
                        <div className='max-w-md overflow-hidden relative'>
                            {topicSteps.length > 6 && current > 3 && <div className='fixed w-12 h-full bg-[#021e44bc] left-[3em] top-0 blur-sm scale-y-150 z-[100]'></div>}
                            <ol role="list" ref={stepsContainer} className="flex items-center ">
                                {topicSteps.map((step: TopicStepT, stepIdx: number) => (
                                    <li key={step.id} id={`step_${stepIdx}`} className={classNames(stepIdx !== topicSteps.length - 1 ? 'pr-8 sm:pr-10' : '', 'relative')}>
                                        <Step  {...step} setCurrent={handleClick} status={step.id === current ? 'current' : step.status} />
                                    </li>
                                ))}
                            </ol>
                            {!isSecondLastStep && !isLastStep && topicSteps.length > 6 && <div className='fixed w-12 h-full bg-[#021e44e3] right-[3em] top-0 blur-sm scale-y-150 '></div>}
                        </div>
                        <button className="text-white px-4 hover:text-primary_green" onClick={() => handleNext('right')}>
                            <ChevronDoubleRightIcon className="m-auto h-8 w-8" aria-hidden="true" />
                        </button>
                    </nav>
                </ControlBar>
            </Layout>
        </>
    );
}

export default TopicSteps


