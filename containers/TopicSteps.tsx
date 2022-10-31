
import Text_Image_Code from '../components/layout/screens/Text_Image_Code';
import Navbar from '../components/ui/Navbar';
import type { TopicStepT } from '../types'
import { useRef, useState } from 'react';
import Step from '../components/ui/Step';
import ControlBar from './ControlBar';


type TopicStepsProps = {
    topicSteps: TopicStepT[],
    title: string,
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



const TopicSteps = ({ topicSteps, title }: TopicStepsProps) => {
    const [current, setCurrent] = useState(nextStepAfterLastCompleted(topicSteps));
    const stepsContainer = useRef<HTMLOListElement>(null);

    function getNextIndex(index: number, max: number, direction: 'left' | 'right') {
        let target = direction === 'right' ? index + 3 : index - 3;
        if (target > max) target = max;
        else if (target < 0) target = 0;
        return target;
    }

    const handleClick = (id: number) => {
        const clickedStepIndex = topicSteps.findIndex(stp => stp.id === id);
        const currentStep = topicSteps.find(stp => stp.id === current);
        setCurrent(id);
        const isForwards = topicSteps[clickedStepIndex]!.orderNumber > currentStep!.orderNumber;
        const indexToScrollIntoView = getNextIndex(clickedStepIndex, topicSteps.length - 1, isForwards ? 'right' : 'left');
        if (stepsContainer.current) stepsContainer.current.querySelector(`#step_${indexToScrollIntoView}`)!.scrollIntoView({ behavior: "smooth" })
    }


    const isLastStep = current === topicSteps[topicSteps.length - 1].id;
    const isSecondLastStep = current === topicSteps[topicSteps.length - 2].id;

    const currentTopicStep = topicSteps.find(stp => stp.id === current);

    return (
        <>
            <Navbar title={title} />
            {/* <Video /> */}
            {currentTopicStep && <Text_Image_Code code={currentTopicStep?.code!} id={+currentTopicStep.id!} text={currentTopicStep?.text!} image={currentTopicStep?.image!} />}
            {/* <TextCode_Image md={md} /> */}
            {/* <Text_Image md={md} /> */}
            <ControlBar>
                <nav aria-label="Progress" className='w-lg overflow-hidden scrollbar-thin scrollbar-none relative z-50  '>
                    <ol role="list" ref={stepsContainer} className="flex items-center">
                        {topicSteps.map((step: TopicStepT, stepIdx: number) => (
                            <li key={step.id} id={`step_${stepIdx}`} className={classNames(stepIdx !== topicSteps.length - 1 ? 'pr-8 sm:pr-10' : '', 'relative')}>
                                <Step  {...step} setCurrent={handleClick} status={step.id === current ? 'current' : step.status} />
                            </li>
                        ))}
                    </ol>
                    {!isSecondLastStep && !isLastStep && <div className='fixed w-6 h-full bg-[#021e44e3] right-[-5px] top-0 blur-sm scale-y-150 '></div>}
                </nav>
            </ControlBar>
        </>
    );
}

export default TopicSteps


