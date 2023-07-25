import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { PageStep, PageContent } from '../types';
import { TgsLocallyStoredData, retrieveLocallyStoredValue, setLocallyStoredValue } from '../libs/localStorage';

type StepProviderValues = {
    currIndex: number;
    steps?: PageStep[];
    showNextPageButton: boolean;
    setStepData: (contentSteps: PageContent[]) => void;
    nextStep: () => void;
    prevStep: () => void;
    goToStep: (ind: number) => void;
};

export const StepContext = React.createContext<StepProviderValues>({
    currIndex: 0,
    showNextPageButton: false,
    setStepData: () => {},
    nextStep: () => {},
    prevStep: () => {},
    goToStep: () => {},
});

function updateStepParam(stepIndex: number | string) {
    if (!window) return;
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const queryParams = new URLSearchParams(url.search);
    // Update the URL query parameter
    queryParams.set('step', `${stepIndex}`);
    url.search = queryParams.toString();
    // Update the browser URL without navigating to the page
    window.history.pushState({}, '', url.toString());
}

const StepContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
    const [steps, setSteps] = useState<PageStep[]>();
    const router = useRouter();
    const { step = 0, pageId } = router.query as {
        chapter: string;
        subchapter: string;
        pageId: string;
        step: string;
    };
    const [stepIndex, setStepIndex] = useState(step || 0);
    const [viewedSteps, setViewedSteps] = useState<TgsLocallyStoredData | undefined>(
        retrieveLocallyStoredValue<TgsLocallyStoredData>('tgs-page-completion')
    );

    // When a page loads, it calls this API
    const setStepData = (contentSteps: PageContent[]) => {
        setSteps(contentSteps as PageStep[]);
    };

    // Handle adding the current PageId to viewsteps
    useEffect(() => {
        try {
            const viewed = viewedSteps ? { ...viewedSteps } : {};
            const existingViewedPage = viewed[pageId];
            if (!existingViewedPage) {
                viewed[pageId] = { stepsCompleted: { [`${stepIndex}`]: true } };
            } else {
                viewed[pageId] = { ...existingViewedPage };
                viewed[pageId].stepsCompleted = { ...viewed[pageId].stepsCompleted, [`${stepIndex}`]: true };
            }
            setLocallyStoredValue('tgs-page-completion', viewed);
            setViewedSteps(viewed);
        } catch (e) {
            console.error(`Unable to add the current viewed page`);
        }
    }, [stepIndex, pageId, viewedSteps]);

    const nextStep = useCallback(() => {
        if (steps && +stepIndex === steps.length - 1) return;
        const newIndex = +stepIndex + 1;
        setStepIndex(newIndex);
        updateStepParam(newIndex);
    }, [stepIndex, steps]);

    const prevStep = useCallback(() => {
        if (+stepIndex < 1) return;
        const newIndex = Math.max(0, +stepIndex - 1);
        setStepIndex(newIndex);
        updateStepParam(newIndex);
    }, [stepIndex]);

    const goToStep = useCallback((index: number) => {
        setStepIndex(index);
        updateStepParam(index);
    }, []);

    const showNextPageButton = useMemo(
        () =>
            !steps || !viewedSteps
                ? false
                : !!viewedSteps[pageId]?.stepsCompleted[`${steps.length - 1}`] ||
                  (stepIndex ? +stepIndex : 0) === steps.length - 1,
        [pageId, steps, viewedSteps, stepIndex]
    );

    const stepData = useMemo(() => {
        let finalSteps;
        try {
            if (!steps) {
                console.log('No step data');
                return;
            }
            const cloned = [...steps];
            const mapped = cloned.map((content: PageContent, ind: number) => {
                const clonedStep = { ...content } as Partial<PageStep>;
                const viewed = viewedSteps;
                clonedStep.status =
                    viewed && viewed[pageId] && viewed[pageId]?.stepsCompleted[`${ind}`] ? 'complete' : 'default';
                return clonedStep;
            }) as PageStep[];
            finalSteps = mapped;
        } catch (e) {
            console.error(`Unable to merge step completions with step data`);
        }
        return finalSteps;
    }, [viewedSteps, steps, pageId]);

    const contextVals = useMemo(() => {
        return {
            currIndex: stepIndex ? +stepIndex : 0,
            steps: stepData,
            showNextPageButton,
            setStepData,
            nextStep,
            prevStep,
            goToStep,
        };
    }, [goToStep, nextStep, prevStep, stepData, showNextPageButton, stepIndex]);

    return <StepContext.Provider value={contextVals}>{children}</StepContext.Provider>;
};

export default StepContextProvider;
