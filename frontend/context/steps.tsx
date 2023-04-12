import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { PageStep, PageContent } from "../types";
import { useRouter } from "next/router";



type StepProviderValues = {
    step?: PageStep,
    steps?: PageStep[]
    setStepData: (contentSteps: PageContent[]) => void
    nextStep: () => void
    prevStep: () => void
    goToStep: (ind: number) => void
}

export const StepContext = React.createContext<StepProviderValues>({
    setStepData: () => { },
    nextStep: () => { },
    prevStep: () => { },
    goToStep: () => { },
});


const StepContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
    const [steps, setSteps] = useState<PageStep[]>()
    const router = useRouter();

    const { stepIndex = 0 } = router.query as { chapter: string, subchapter: string, pageId: string, stepIndex: string };

    const setStepData = useCallback(function setStepData(contentSteps: PageContent[]){
        const mapped = contentSteps.map((content:PageContent) => {
            // topic.status = viewed.includes(topic.id!) ? 'complete' : 'default';
            const step = {...content} as Partial<PageStep>;
            step.status = 'default';
            return step
        }) as PageStep[]
        setSteps(mapped);
    }, []) 

    function nextStep(){
        console.log('NEXT')
        console.log(steps && +stepIndex === steps.length - 1)
        if(steps && +stepIndex === steps.length - 1) return;
        router.replace(`${window.location.pathname}?stepIndex=${+stepIndex+1}`)
    }

    function prevStep(){
        if(+stepIndex < 1) return;
        router.replace(`${window.location.pathname}?stepIndex=${+stepIndex-1}`)
    }

    function goToStep(index: number){
        router.replace(`${window.location.pathname}?stepIndex=${index}`)
    }

    return (
        <StepContext.Provider value={{
            step:  steps && steps[+stepIndex],
            steps,
            setStepData,
            nextStep,
            prevStep,
            goToStep
        }}>
            {children}
        </StepContext.Provider>
    )

};

export default StepContextProvider;