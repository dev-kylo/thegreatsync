import { ImageData, PageContent, ResourceLink } from '../../../types';
import Block from '../Block';
import CodeEditorBlock from '../blocks/CodeEditorBlock';
import ImageBlock from '../blocks/ImageBlock';
import MarkdownBlock from '../blocks/MarkdownBlock';
import ContentBlock from '../ContentBlock';

type BlocksProps = { id: number; links: ResourceLink[]; heading?: string; blocks: PageContent[] };

const Blocks = ({ blocks, id, links, heading }: BlocksProps) => {
    const blockCmps = blocks.map((block, index) => {
        const key = `pageblock-${block.__component}-${index}`;
        switch (block.__component) {
            case 'media.text':
                return <MarkdownBlock key={key} md={block?.text} />;
            case 'media.image':
                return (
                    <ImageBlock
                        image={(block?.image?.data as ImageData[])[0]}
                        id={block?.id}
                        imageAlt={block?.image_alt}
                        key={key}
                    />
                );
            case 'media.code-editor':
                return (
                    <CodeEditorBlock
                        key={key}
                        files={block.file!}
                        showLineNumbers={block?.showLineNumbers}
                        description={block?.description?.text}
                        descriptionType={block?.descriptionType}
                        hideRunButtons={block?.hideRunButtons}
                        wrapContent={block?.wrapContent}
                    />
                );
            default:
                return null;
        }
    });

    return (
        <div className="py-8 self-center 2xl:px-32 scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
            <div className="mx-auto w-full grid grid-cols-1 gap-1 xl:px-2 self-center h-full">
                <Block key={`blockText-${id}`} outerClasses="min-h-[82vh]" innerClasses="p-4" enableScroll hideBorder>
                    <ContentBlock textType="page" blocks={blockCmps} id={id} heading={heading} links={links} />
                </Block>
            </div>
        </div>
    );
};

export default Blocks;
