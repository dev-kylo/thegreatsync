import { useContext, useEffect } from 'react';
import type { PageContent, PageType, ResourceLink } from '../types';
import PageSteps from './PageSteps';
import { NavContext } from '../context/nav';
import { StepContext } from '../context/steps';

type PageStepsControllerProps = {
    pageContent: PageContent[];
    heading?: string;
    type: PageType;
    links: ResourceLink[];
};

const PageStepsController = ({ pageContent, type, heading, links }: PageStepsControllerProps) => {
    const { nextPage, prevPage } = useContext(NavContext);
    const { nextStep, prevStep, goToStep, currIndex, setStepData, steps, showNextPageButton } = useContext(StepContext);

    useEffect(() => {
        console.log('Ready to set steps?:', !!steps);
        if (pageContent && !steps) setStepData(pageContent);
    }, [pageContent, setStepData, steps]);

    if (!steps) {
        return <p>Loading Step Context</p>;
    }

    return (
        <PageSteps
            heading={heading}
            currIndex={currIndex}
            pageSteps={steps}
            links={links}
            nextStep={nextStep}
            prevStep={prevStep}
            showNextButton={showNextPageButton}
            type={type}
            nextPage={nextPage}
            prevPage={prevPage}
            goToStep={goToStep}
        />
    );
};

export default PageStepsController;
