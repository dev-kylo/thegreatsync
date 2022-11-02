
import fs from 'fs';
import { useState } from 'react';
import TopicSteps from '../containers/TopicSteps';
import type { TopicStepT } from '../types';

type P = {
    number: {
        number_code: string,
        number_text: string
    },
    string: {
        string_code: string,
        string_text: string
    },
    undefinedd: {
        undefined_code: string,
        undefined_text: string
    },
    boolean: {
        boolean_code: string,
        boolean_text: string
    },
}

const TopicStepsPage = ({ number, string, undefinedd, boolean }: P) => {
    const topicType = '3col';

    const topics = [
        { image: 'https://res.cloudinary.com/the-great-sync/image/upload/v1667063626/2000x2000/Number_wc1j0y.png', id: 1, orderNumber: 1, text: number.number_text, code: number.number_code },
        { image: 'https://res.cloudinary.com/the-great-sync/image/upload/v1667062132/2000x2000/Rain_Island_juwyrk.png', id: 2, orderNumber: 2, text: string.string_text, code: string.string_code },
        { image: 'https://res.cloudinary.com/the-great-sync/image/upload/v1667063268/2000x2000/Undefined_tyvsdx.png', id: 3, orderNumber: 3, text: undefinedd.undefined_text, code: undefinedd.undefined_code },
        { image: 'https://res.cloudinary.com/the-great-sync/image/upload/v1667064088/2000x2000/Boolean_m3vqro.png', id: 4, orderNumber: 4, text: boolean.boolean_text, code: boolean.boolean_code }
    ];
    const [viewed, setViewed] = useState<number[]>([])
    const title = 'Statements and declarations';

    const handleViewedStep = (id: number) => {
        if (!viewed.includes(id)) setViewed([...viewed, id])
    }


    const topicSteps: TopicStepT[] = topics.map((topic: Partial<TopicStepT>) => {
        topic.status = viewed.includes(topic.id!) ? 'complete' : 'default';
        return topic
    }) as TopicStepT[]


    return (
        <TopicSteps topicSteps={topicSteps} title={title} completeStep={handleViewedStep} showNextButton={viewed.length >= topics.length - 1} />
    );
}

export default TopicStepsPage;

export async function getServerSideProps() {

    const number_text = fs.readFileSync(`mocks/Number_text.md`, 'utf-8')
    const number_code = fs.readFileSync(`mocks/Number_code.md`, 'utf-8');

    const string_text = fs.readFileSync(`mocks/String_text.md`, 'utf-8');
    const string_code = fs.readFileSync(`mocks/String_code.md`, 'utf-8');

    const undefined_text = fs.readFileSync(`mocks/Undefined_text.md`, 'utf-8');
    const undefined_code = fs.readFileSync(`mocks/Undefined_code.md`, 'utf-8');

    const boolean_text = fs.readFileSync(`mocks/Boolean_text.md`, 'utf-8');
    const boolean_code = fs.readFileSync(`mocks/Boolean_code.md`, 'utf-8');

    return {
        props: {
            number: { number_code, number_text },
            string: { string_code, string_text },
            undefinedd: { undefined_code, undefined_text },
            boolean: { boolean_code, boolean_text }
        },
    };
}
