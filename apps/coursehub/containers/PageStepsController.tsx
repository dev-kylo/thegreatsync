import { useContext, useEffect, useRef } from 'react';
import type { PageContent, PageType, ResourceLink } from '../types';
import PageSteps from './PageSteps';
import { NavContext } from '../context/nav';
import { StepContext } from '../context/steps';
import Spinner from '../components/ui/Spinner';

type PageStepsControllerProps = {
    pageContent: PageContent[];
    loadingPage: boolean;
    pageId: string;
    heading?: string;
    type: PageType;
    links: ResourceLink[];
};

const PageStepsController = ({ pageContent, type, heading, links, loadingPage, pageId }: PageStepsControllerProps) => {
    const { nextPage, prevPage, showNext, showPrev } = useContext(NavContext);
    const { nextStep, prevStep, goToStep, currIndex, setStepData, steps, showNextPageButton } = useContext(StepContext);
    const loadedPages = useRef<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (pageContent) {
            if (loadedPages.current && !loadedPages.current[pageId]) {
                setStepData(pageContent);
                loadedPages.current = { ...loadedPages.current, [pageId]: true };
            }
        }
    }, [pageContent, setStepData, pageId]);

    if (!steps) {
        return (
            <div className="h-full w-full flex justify-center items-center">
                <Spinner />
            </div>
        );
    }

    const goBack = () => {
        loadedPages.current = {};
        prevPage();
    };

    const goForward = () => {
        loadedPages.current = {};
        nextPage();
    };

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
            loadingPage={loadingPage}
            showNext={showNext}
            showPrev={showPrev}
            nextPage={goForward}
            prevPage={goBack}
            goToStep={goToStep}
        />
    );
};

export default PageStepsController;
