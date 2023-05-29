// @refresh reset
import { SyntheticEvent, useEffect, useRef } from 'react';
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/20/solid';
import Text_Image_Code from '../components/layout/screens/Text_Image_Code';
import type { PageStep, PageType } from '../types';
import Step from '../components/ui/Step';
import ControlBar from './ControlBar';
import Text_Image from '../components/layout/screens/Text_Image';
import BlurEdge from '../components/ui/BlurEdge';

type PageStepsProps = {
    currIndex: number;
    pageSteps: PageStep[];
    showNextButton: boolean;
    type: PageType;
    heading?: string;
    nextPage: () => void;
    prevPage: () => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (ind: number) => void;
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const PageSteps = ({
    currIndex,
    pageSteps,
    showNextButton,
    type,
    heading,
    nextPage,
    prevPage,
    nextStep,
    prevStep,
    goToStep,
}: PageStepsProps) => {
    const stepsContainer = useRef<HTMLOListElement>(null);

    useEffect(() => {
        function scrollIntoView(indx: number) {
            if (stepsContainer.current)
                stepsContainer.current.querySelector(`#step_${indx}`)!.scrollIntoView({ behavior: 'smooth' });
        }
        scrollIntoView(currIndex);
    }, [currIndex]);

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            console.log('KEYDOWN');
            if (e.key === 'ArrowLeft') prevStep();
            else if (e.key === 'ArrowRight') nextStep();
        }

        document.addEventListener('keydown', handleKeyPress);

        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [prevStep, nextStep]);

    const handleNext = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        nextStep();
    };

    const handlePrev = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        prevStep();
    };

    const currentTopicStep = pageSteps[currIndex];
    const isLastStep = currIndex === pageSteps.length - 1;
    const isSecondLastStep = currIndex === pageSteps.length - 2;

    return (
        <>
            {type === 'text_image_code' && (
                <Text_Image_Code
                    heading={currIndex === 0 ? heading : undefined}
                    code={currentTopicStep.code!}
                    id={+currentTopicStep.id}
                    text={currentTopicStep?.text}
                    image={currentTopicStep?.image}
                    showImageBorder={currentTopicStep?.transparent_image}
                />
            )}
            {type === 'text_image' && (
                <Text_Image id={+currentTopicStep.id} text={currentTopicStep?.text} image={currentTopicStep?.image} />
            )}

            <div className="relative">
                <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 my-1 p-0 text-white mx-auto text-center text-sm">
                    <span>Use your arrow keys</span>
                </div>
                <ControlBar showNext={showNextButton} nextPage={nextPage} prevPage={prevPage}>
                    <nav aria-label="Progress" className="flex items-center relative z-50  ">
                        <button type="button" className="text-white px-4 hover:text-primary_green" onClick={handlePrev}>
                            <ChevronDoubleLeftIcon className="m-auto h-8 w-8" aria-hidden="true" />
                        </button>
                        <div className="max-w-md relative">
                            {pageSteps.length > 6 && currIndex > 2 && <BlurEdge position="left" />}
                            <ol ref={stepsContainer} className="flex items-center ">
                                {pageSteps.map((step: PageStep, stepIdx: number) => (
                                    <li
                                        key={step.id}
                                        id={`step_${stepIdx}`}
                                        className={classNames(
                                            stepIdx !== pageSteps.length - 1 ? 'pr-8 sm:pr-10' : '',
                                            'relative',
                                            'cursor-pointer'
                                        )}
                                    >
                                        <Step
                                            {...step}
                                            orderNumber={stepIdx + 1}
                                            setCurrent={() => goToStep(stepIdx)}
                                            status={stepIdx === currIndex ? 'current' : step?.status}
                                        />
                                    </li>
                                ))}
                            </ol>
                            {!isSecondLastStep && !isLastStep && pageSteps.length > 6 && <BlurEdge position="right" />}
                        </div>
                        <button type="button" className="text-white px-4 hover:text-primary_green" onClick={handleNext}>
                            <ChevronDoubleRightIcon className="m-auto h-8 w-8" aria-hidden="true" />
                        </button>
                    </nav>
                </ControlBar>
            </div>
        </>
    );
};

export default PageSteps;
