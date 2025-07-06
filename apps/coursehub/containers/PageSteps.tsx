// @refresh reset
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Text_Image_Code from '../components/layout/screens/Text_Image_Code';
import type { ImageData, PageStep, PageType, ResourceLink } from '../types';
import Step from '../components/ui/Step';
import ControlBar from './ControlBar';
import Text_Image from '../components/layout/screens/Text_Image';
import BlurEdge from '../components/ui/BlurEdge';
import Text_Code from '../components/layout/screens/Text_Code';

type PageStepsProps = {
    currIndex: number;
    pageSteps: PageStep[];
    showNextButton: boolean;
    type: PageType;
    heading?: string;
    links: ResourceLink[];
    loadingPage: boolean;
    showNext: boolean;
    showPrev: boolean;
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
    links,
    loadingPage,
    showPrev,
    showNext,
    nextPage,
    prevPage,
    nextStep,
    prevStep,
    goToStep,
}: PageStepsProps) => {
    const stepsContainer = useRef<HTMLOListElement>(null);

    const [shownKeysMsg, setShownKeysMsg] = useState(false);
    const [direction, setDirection] = useState('next');

    const currentTopicStep = pageSteps[currIndex];
    const isLastStep = currIndex === pageSteps.length - 1;
    const isSecondLastStep = currIndex === pageSteps.length - 2;

    useEffect(() => {
        if (!localStorage.getItem('tgs-keys-msg')) {
            localStorage.setItem('tgs-keys-msg', 'true');
        } else setShownKeysMsg(true);
    }, []);

    useEffect(() => {
        function scrollIntoView(indx: number) {
            if (stepsContainer.current && direction === 'prev' && indx > 0)
                stepsContainer.current.querySelector(`#step_${indx - 1}`)!.scrollIntoView({ behavior: 'smooth' });
            if (stepsContainer.current && direction === 'next' && !isLastStep)
                stepsContainer.current.querySelector(`#step_${indx + 1}`)!.scrollIntoView({ behavior: 'smooth' });
        }

        scrollIntoView(currIndex);
    }, [currIndex, isLastStep, direction]);

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') prevStep();
            else if (e.key === 'ArrowRight') nextStep();
        }

        document.addEventListener('keydown', handleKeyPress);

        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [prevStep, nextStep]);

    const handleNext = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        nextStep();
        setDirection('next');
    };

    const handlePrev = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        prevStep();
        setDirection('prev');
    };

    return (
        <>
            {type === 'text_image_code' && (
                <Text_Image_Code
                    heading={currIndex === 0 ? heading : undefined}
                    code={currentTopicStep?.code || ''}
                    id={currentTopicStep?.id}
                    text={currentTopicStep?.text}
                    image={currentTopicStep?.image}
                    links={isLastStep ? links : []}
                    imageAlt={currentTopicStep?.image_alt}
                />
            )}
            {type === 'text_image' && (
                <Text_Image
                    heading={currIndex === 0 ? heading : undefined}
                    id={+currentTopicStep.id}
                    text={currentTopicStep?.text}
                    image={currentTopicStep?.image}
                    links={isLastStep ? links : []}
                    imageAlt={currentTopicStep?.image_alt}
                />
            )}

            {type === 'text_code' && (
                <Text_Code
                    heading={currIndex === 0 ? heading : undefined}
                    id={+currentTopicStep.id}
                    text={currentTopicStep?.text}
                    code={currentTopicStep?.code || ''}
                    links={isLastStep ? links : []}
                />
            )}

            <div className="relative">
                <div className="hidden xl:block absolute xl:top-[-1rem] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 my-1 p-0 text-white mx-auto text-center text-sm">
                    {!shownKeysMsg && <span>Use your arrow keys</span>}
                </div>
                <ControlBar
                    showPrev={showPrev}
                    showNext={showNext && showNextButton}
                    loadingPage={loadingPage}
                    nextPage={nextPage}
                    prevPage={prevPage}
                >
                    {!loadingPage && (
                        <nav aria-label="Progress" className="flex items-center justify-center relative z-50 py-2">
                            <button
                                type="button"
                                className="text-white px-4 enabled:hover:text-primary_green disabled:hover:text-gray-400"
                                onClick={handlePrev}
                                aria-label="Previous Slide"
                                disabled={currIndex === 0}
                            >
                                <ChevronDoubleLeftIcon className="m-auto h-8 w-8" aria-hidden="true" />
                            </button>
                            <div className="max-w-[16rem] relative overflow-x-hidden md:max-w-[28rem]">
                                {pageSteps.length > 6 && currIndex > 2 && <BlurEdge position="left" />}
                                <ol ref={stepsContainer} className="flex items-center ">
                                    {pageSteps.map((step: PageStep, stepIdx: number) => (
                                        <li
                                            key={`step_${step.id}`}
                                            id={`step_${stepIdx}`}
                                            className={classNames(
                                                stepIdx !== pageSteps.length - 1 ? 'pr-8 sm:pr-6' : '',
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
                                {!isSecondLastStep && !isLastStep && pageSteps.length > 6 && (
                                    <BlurEdge position="right" />
                                )}
                            </div>
                            <button
                                type="button"
                                className="text-white px-4 enabled:hover:text-primary_green disabled:hover:text-gray-400"
                                onClick={handleNext}
                                aria-label="Next Slide"
                                disabled={isLastStep}
                            >
                                <ChevronDoubleRightIcon className="m-auto h-8 w-8" aria-hidden="true" />
                            </button>
                        </nav>
                    )}
                </ControlBar>
                {/* To preload images */}
                <div style={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
                    {pageSteps.map((step) => {
                        if (type === 'text_image_code' || type === 'text_image') {
                            const imageData = step?.image?.data as ImageData;
                            if (!imageData) return null;
                            return (
                                <Image
                                    key={`preload-${imageData.id}`}
                                    src={imageData.attributes.url}
                                    alt={step.image_alt}
                                    fill
                                    placeholder="blur"
                                    blurDataURL={imageData.attributes.placeholder}
                                    loading="lazy"
                                />
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </>
    );
};

export default PageSteps;
