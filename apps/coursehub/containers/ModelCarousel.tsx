// @refresh reset
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { ChevronDoubleRightIcon, ChevronDoubleLeftIcon } from '@heroicons/react/20/solid';

import type { Summary } from '../types';
import Step from '../components/ui/Step';

import BlurEdge from '../components/ui/BlurEdge';

import ContentBlock from '../components/layout/ContentBlock';
import TitleStrip from '../components/ui/TitleStrip';
import BlockRenderer from '../components/layout/blocks/BlockRenderer';

type ModelStepsProps = {
    layerSummaries: Summary[];
    layerTitle: string;
    layerId: string | number;
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

// Clicking on the step image with existing id should set activeIndex to null
// If no activeIndex, then show the list of summaries
// If activeIndex, then show the current summary

const ModelCarousel = ({ layerSummaries, layerTitle, layerId }: ModelStepsProps) => {
    const stepsContainer = useRef<HTMLOListElement>(null);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [direction, setDirection] = useState('next');

    const currentTopicStep = layerSummaries[activeIndex] ?? null;
    const isLastStep = activeIndex === (layerSummaries?.length ?? 0) - 1;
    const isSecondLastStep = activeIndex === (layerSummaries?.length ?? 0) - 2;

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

        if (layerSummaries && layerSummaries.length > 0) scrollIntoView(activeIndex);
    }, [activeIndex, isLastStep, direction, layerSummaries]);

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

    return (
        <div className="relative">
            {layerSummaries && layerSummaries.length > 0 && (
                <nav
                    aria-label="Progress"
                    className="flex items-center justify-center relative z-50 py-2 w-full max-w-4xl mx-auto mb-6"
                >
                    {layerSummaries.length > 1 && (
                        <button
                            type="button"
                            className="text-white px-0 enabled:hover:text-primary_green disabled:hover:text-gray-400 shrink-0 h-[4rem] bg-primary_green hover:bg-secondary_pink"
                            onClick={handlePrev}
                            aria-label="Previous Slide"
                            disabled={activeIndex === 0}
                        >
                            <ChevronDoubleLeftIcon className="m-auto h-8 w-8" aria-hidden="true" />
                        </button>
                    )}
                    <div className=" relative  overflow-x-auto scrollbar-none">
                        {layerSummaries.length > 4 && activeIndex > 2 && <BlurEdge position="left" />}
                        <ol ref={stepsContainer} className="flex items-center ">
                            {layerSummaries?.length > 0 &&
                                layerSummaries.map((summary: Summary, stepIdx: number) => (
                                    <li
                                        key={`step_${summary.id}`}
                                        id={`step_${stepIdx}`}
                                        className={classNames(
                                            stepIdx !== layerSummaries.length - 1 ? 'pr-8 sm:pr-10' : '',
                                            'relative',
                                            'cursor-pointer'
                                        )}
                                    >
                                        <Step
                                            id={Number(summary.id)}
                                            text=""
                                            image_alt={summary.attributes.title}
                                            __component="media.text"
                                            orderNumber={stepIdx + 1}
                                            setCurrent={() => handleGoToStep(stepIdx)}
                                            status={stepIdx === activeIndex ? 'current' : 'default'}
                                            image={summary?.attributes.image}
                                            size="large"
                                        />
                                    </li>
                                ))}
                        </ol>
                        {!isSecondLastStep && !isLastStep && layerSummaries.length > 4 && <BlurEdge position="right" />}
                    </div>
                    {layerSummaries.length > 1 && (
                        <button
                            type="button"
                            className="text-white px-0 enabled:hover:text-primary_green disabled:hover:text-gray-400 h-[4rem] bg-primary_green hover:bg-secondary_pink"
                            onClick={handleNext}
                            aria-label="Next Slide"
                            disabled={isLastStep}
                        >
                            <ChevronDoubleRightIcon className="m-auto h-8 w-8" aria-hidden="true" />
                        </button>
                    )}
                </nav>
            )}

            <div className="px-16">
                <div className="relative  mx-auto overflow-x-auto scrollbar-none">
                    <div className="mt-4">
                        <TitleStrip primaryTitle="The Great Sync Imagimodel" secondaryTitle={layerTitle} />
                        <ContentBlock id={Number(layerId)} heading={layerTitle} className="[&>h1]:text-center" />
                    </div>
                    {/* {!currentTopicStep && (
                        <div className="mx-auto mt-8">
                            <ContentBlock
                                id={Number(layerId)}
                                heading=""
                                md={layerDescription}
                                className="[&>h1]:text-center"
                            />
                        </div>
                    )} */}
                </div>

                {currentTopicStep && (
                    <div className="mt-8">
                        <h3 className="text-2xl font-bold text-white">{currentTopicStep.attributes.title}</h3>
                        <BlockRenderer
                            blocks={currentTopicStep.attributes.content}
                            id={Number(currentTopicStep?.id)}
                            links={[]}
                            heading=""
                        />
                    </div>
                )}
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
