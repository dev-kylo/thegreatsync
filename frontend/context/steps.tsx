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

const StepContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
    const [steps, setSteps] = useState<PageStep[]>();
    const router = useRouter();
    const { stepIndex = 0, pageId } = router.query as {
        chapter: string;
        subchapter: string;
        pageId: string;
        stepIndex: string;
    };
    const [viewedSteps, setViewedSteps] = useState<TgsLocallyStoredData | undefined>(
        retrieveLocallyStoredValue<TgsLocallyStoredData>('tgs-page-completion')
    );

    const setStepData = useCallback(
        (contentSteps: PageContent[] | PageStep[], completed?: TgsLocallyStoredData) => {
            const mapped = contentSteps.map((content: PageContent, ind: number) => {
                const step = { ...content } as Partial<PageStep>;
                const viewed = completed || viewedSteps;
                step.status =
                    viewed && viewed[pageId] && viewed[pageId].stepsCompleted[`${ind}`] ? 'complete' : 'default';
                return step;
            }) as PageStep[];
            setSteps(mapped);
        },
        [pageId, viewedSteps]
    );

    useEffect(() => {
        if (viewedSteps && viewedSteps[pageId]?.stepsCompleted[stepIndex]) return;
        const viewed = !viewedSteps
            ? { [pageId]: { stepsCompleted: { [stepIndex]: true } } }
            : !viewedSteps[pageId]
            ? { ...viewedSteps, [pageId]: { stepsCompleted: { [stepIndex]: true } } }
            : {
                  ...viewedSteps,
                  [pageId]: { stepsCompleted: { ...viewedSteps[pageId].stepsCompleted, [stepIndex]: true } },
              };

        setLocallyStoredValue('tgs-page-completion', viewed);
        setViewedSteps(viewed);
        if (steps) setStepData(steps, viewed);
    }, [stepIndex, pageId, viewedSteps, steps, setStepData]);

    const nextStep = useCallback(() => {
        if (steps && +stepIndex === steps.length - 1) return;
        router.replace(`${window.location.pathname}?stepIndex=${+stepIndex + 1}`);
    }, [router, stepIndex, steps]);

    const prevStep = useCallback(() => {
        if (+stepIndex < 1) return;
        router.replace(`${window.location.pathname}?stepIndex=${+stepIndex - 1}`);
    }, [router, stepIndex]);

    const goToStep = useCallback(
        (index: number) => {
            router.replace(`${window.location.pathname}?stepIndex=${index}`);
        },
        [router]
    );

    const showNextPageButton = useMemo(
        () => (!steps || !viewedSteps ? false : !!viewedSteps[pageId].stepsCompleted[`${steps.length - 1}`]),
        [pageId, steps, viewedSteps]
    );

    const contextVals = useMemo(() => {
        return {
            currIndex: stepIndex ? +stepIndex : 0,
            steps,
            showNextPageButton,
            setStepData,
            nextStep,
            prevStep,
            goToStep,
        };
    }, [goToStep, nextStep, prevStep, setStepData, showNextPageButton, stepIndex, steps]);

    return <StepContext.Provider value={contextVals}>{children}</StepContext.Provider>;
};

export default StepContextProvider;
