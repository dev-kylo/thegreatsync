import { PageContent, ResourceLink } from '../../../types';
import Block from '../Block';
import BlockRenderer from '../blocks/BlockRenderer';

type BlocksProps = { id: number; links: ResourceLink[]; heading?: string; blocks: PageContent[] };

const PageOfBlocks = ({ blocks, id, links, heading }: BlocksProps) => {
    return (
        <div className="py-8 self-center 2xl:px-32 scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
            <div className="mx-auto w-full grid grid-cols-1 gap-1 xl:px-2 self-center h-full">
                <Block key={`blockText-${id}`} outerClasses="min-h-[82vh]" innerClasses="p-4" enableScroll hideBorder>
                    <BlockRenderer blocks={blocks} id={id} links={links} heading={heading} />
                </Block>
            </div>
        </div>
    );
};

export default PageOfBlocks;
