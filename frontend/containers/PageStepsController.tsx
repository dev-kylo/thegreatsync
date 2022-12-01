
import { useContext, useState } from 'react';
import type { PageContent, PageStep, PageType } from '../types';
import PageSteps from '../containers/PageSteps';
import { NavContext } from '../context/nav';

type PageStepsControllerProps = {
    pageContent: PageContent[],
    type: PageType,
}


const PageStepsController = ({ pageContent, type }: PageStepsControllerProps) => {
    const { nextPage, prevPage } = useContext(NavContext);

    const [viewed, setViewed] = useState<number[]>([])
    const title = 'Statements and declarations';
    const handleViewedStep = (id: number) => {
        if (!viewed.includes(id)) setViewed([...viewed, id])
    }

    const pageSteps: PageStep[] = pageContent.map((topic: Partial<PageStep>) => {
        topic.status = viewed.includes(topic.id!) ? 'complete' : 'default';
        return topic
    }) as PageStep[]


    return (
        <PageSteps
            completeStep={handleViewedStep}
            pageSteps={pageSteps}
            showNextButton={viewed.length >= pageSteps.length - 1}
            type={type}
            nextPage={nextPage}
            prevPage={prevPage}
        />
    );
}

export default PageStepsController;
