
import { useState } from 'react';
import type { PageContent, PageStep, PageType } from '../types';
import PageSteps from '../containers/PageSteps';


type PageStepsControllerProps = {
    pageContent: PageContent[],
    type: PageType
}


const PageStepsController = ({ pageContent, type }: PageStepsControllerProps) => {

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
        <PageSteps completeStep={handleViewedStep} pageSteps={pageSteps} showNextButton={viewed.length >= pageSteps.length - 1} type={type} />
    );
}

export default PageStepsController;
