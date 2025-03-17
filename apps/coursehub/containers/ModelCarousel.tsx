// @refresh reset
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/20/solid';

import type { ImageData, PageContent } from '../types';
import Step from '../components/ui/Step';

import BlurEdge from '../components/ui/BlurEdge';

import ImageBlock from '../components/layout/blocks/ImageBlock';
import ContentBlock from '../components/layout/ContentBlock';
import TitleStrip from '../components/ui/TitleStrip';
import Blocks from '../components/layout/screens/Blocks';

type ModelStepsProps = {
    currIndex: number;
    modelSteps: PageContent[];
    heading?: string;
    loadingPage: boolean;
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const ModelCarousel = ({ modelSteps }: ModelStepsProps) => {
    const stepsContainer = useRef<HTMLOListElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [direction, setDirection] = useState('next');

    const currentTopicStep = modelSteps[activeIndex];
    const isLastStep = activeIndex === modelSteps.length - 1;
    const isSecondLastStep = activeIndex === modelSteps.length - 2;

    useEffect(() => {
        function scrollIntoView(indx: number) {
            if (stepsContainer.current && direction === 'prev' && indx > 0)
                stepsContainer.current.querySelector(`#step_${indx - 1}`)!.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
            if (stepsContainer.current && direction === 'next' && !isLastStep)
                stepsContainer.current.querySelector(`#step_${indx + 1}`)!.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center',
                });
        }

        scrollIntoView(activeIndex);
    }, [activeIndex, isLastStep, direction]);

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft' && activeIndex > 0) {
                setActiveIndex(activeIndex - 1);
            } else if (e.key === 'ArrowRight' && !isLastStep) {
                setActiveIndex(activeIndex + 1);
            }
        }

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [activeIndex, isLastStep]);

    const handleNext = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDirection('next');
        setActiveIndex(activeIndex + 1);
    };

    const handlePrev = (e: SyntheticEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDirection('prev');
        setActiveIndex(activeIndex - 1);
    };

    const handleGoToStep = (index: number) => {
        setActiveIndex(index);
    };

    console.log({ activeIndex, isLastStep });

    return (
        <div className="relative">
            <nav
                aria-label="Progress"
                className="flex items-center justify-center relative z-50 py-2 w-full max-w-4xl mx-auto"
            >
                <button
                    type="button"
                    className="text-white px-0 enabled:hover:text-primary_green disabled:hover:text-gray-400 shrink-0 h-[4rem] bg-primary_green hover:bg-secondary_pink"
                    onClick={handlePrev}
                    aria-label="Previous Slide"
                    disabled={activeIndex === 0}
                >
                    <ChevronDoubleLeftIcon className="m-auto h-8 w-8" aria-hidden="true" />
                </button>
                <div className=" relative  overflow-x-auto scrollbar-none">
                    {modelSteps.length > 4 && activeIndex > 2 && <BlurEdge position="left" />}
                    <ol ref={stepsContainer} className="flex items-center ">
                        {modelSteps.map((step: PageContent, stepIdx: number) => (
                            <li
                                key={`step_${step.id}`}
                                id={`step_${stepIdx}`}
                                className={classNames(
                                    stepIdx !== modelSteps.length - 1 ? 'pr-8 sm:pr-10' : '',
                                    'relative',
                                    'cursor-pointer'
                                )}
                            >
                                <Step
                                    {...step}
                                    orderNumber={stepIdx + 1}
                                    setCurrent={() => handleGoToStep(stepIdx)}
                                    status={stepIdx === activeIndex ? 'current' : 'default'}
                                    image={step?.image}
                                    size="large"
                                />
                            </li>
                        ))}
                    </ol>
                    {!isSecondLastStep && !isLastStep && modelSteps.length > 4 && <BlurEdge position="right" />}
                </div>
                <button
                    type="button"
                    className="text-white px-0 enabled:hover:text-primary_green disabled:hover:text-gray-400 h-[4rem] bg-primary_green hover:bg-secondary_pink"
                    onClick={handleNext}
                    aria-label="Next Slide"
                    disabled={isLastStep}
                >
                    <ChevronDoubleRightIcon className="m-auto h-8 w-8" aria-hidden="true" />
                </button>
            </nav>

            <div className="px-8 ">
                <div className="max-w-[16rem] relative md:max-w-[28rem] mx-auto overflow-x-auto scrollbar-none">
                    <div className="mt-4">
                        <TitleStrip primaryTitle="The Layer Title " secondaryTitle="The Summary Title" />
                    </div>
                    <ImageBlock
                        image={currentTopicStep?.image?.data as ImageData}
                        id={currentTopicStep?.id}
                        imageAlt={currentTopicStep?.image_alt}
                    />
                </div>
                <ContentBlock id={currentTopicStep?.id} md={currentTopicStep?.text} />
                <Blocks blocks={currentTopicStep} id={id} links={links} heading={title} />
            </div>
            {/* To preload images */}
            {/* <div style={{ visibility: 'hidden', position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
                {modelSteps.map((step) => {
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
                })}
            </div> */}
        </div>
    );
};

export default ModelCarousel;
