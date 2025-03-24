import { ImageData, PageContent, ResourceLink } from '../../../types';
import CodeEditorBlock from './CodeEditorBlock';
import ImageBlock from './ImageBlock';
import MarkdownBlock from './MarkdownBlock';
import ContentBlock from '../ContentBlock';

type BlocksProps = { id: number; links: ResourceLink[]; heading?: string; blocks: PageContent[] };

const BlockRenderer = ({ blocks, id, links, heading }: BlocksProps) => {
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

    return <ContentBlock textType="page" blocks={blockCmps} id={id} heading={heading} links={links} />;
};

export default BlockRenderer;
