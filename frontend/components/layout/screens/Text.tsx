import ContentBlock from '../ContentBlock';
import Block from '../Block';
import type { ResourceLink } from '../../../types';

type Text_Props = { text: string; id: number; links: ResourceLink[]; heading?: string };

export default function Text({ text, id, heading, links }: Text_Props) {
    return (
        <div className="py-8  self-center 2xl:px-32 scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
            <div className="mx-auto w-full grid grid-cols-1 gap-1 xl:px-2 self-center h-full">
                <Block key={`blockText-${id}`} outerClasses="min-h-[82vh]" innerClasses="p-4" enableScroll hideBorder>
                    <ContentBlock md={text} id={id} heading={heading} links={links} />
                </Block>
            </div>
        </div>
    );
}
