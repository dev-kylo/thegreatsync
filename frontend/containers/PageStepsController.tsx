
import { useContext, useEffect, useState } from 'react';
import type { PageContent, PageStep, PageType } from '../types';
import PageSteps from '../containers/PageSteps';
import { NavContext } from '../context/nav';
import { StepContext } from '../context/steps';

type PageStepsControllerProps = {
    pageContent: PageContent[],
    type: PageType,
}


const PageStepsController = ({ pageContent, type }: PageStepsControllerProps) => {
    const { nextPage, prevPage } = useContext(NavContext);
    const {nextStep, prevStep, goToStep, currIndex, setStepData, steps } = useContext(StepContext)

    // const [viewed, setViewed] = useState<number[]>([])
    const handleViewedStep = (id: number) => {
        // if (!viewed.includes(id)) setViewed([...viewed, id])
        console.log('Viewed ID')
        console.log(id);
    }

    useEffect(() => {
        console.log('Ready to set steps?:', !!steps)
        if(pageContent && !steps) setStepData(pageContent);
    }, [pageContent, setStepData, steps])

    if (!steps){
        return <p>Loading Step Context</p>
    }


    return (
        <PageSteps
            completeStep={handleViewedStep}
            currIndex={currIndex}
            pageSteps={steps}
            nextStep={nextStep}
            prevStep={prevStep}
            // showNextButton={viewed.length >= pageSteps.length - 1}
            showNextButton={true}
            type={type}
            nextPage={nextPage}
            prevPage={prevPage}
            goToStep={goToStep}
        />
    );
}

export default PageStepsController;
