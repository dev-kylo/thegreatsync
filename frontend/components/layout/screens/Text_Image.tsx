import Image from 'next/image';
import { Allotment } from 'allotment';
import ContentBlock from '../ContentBlock';
import Block from '../Block';
import { ImageComp, ResourceLink } from '../../../types';
import useResponsivePanes from '../../../hooks/useResponsivePanes';
import PaneTabs from '../PaneTabs';

type Text_Image_Props = { text: string; image: ImageComp; id: number; heading?: string; links: ResourceLink[] };

export default function Text_Image({ text, image, id, heading, links }: Text_Image_Props) {
    const { isMobile, visiblePane, setVisiblePane } = useResponsivePanes();
    const { url, placeholder } = image.data.attributes;

    if (isMobile)
        return (
            <div className="p-4 pt-16 relative">
                <PaneTabs setVisiblePane={setVisiblePane} text image />

                {visiblePane === 'text' && (
                    <div className="bg-black h-full">
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll>
                            <ContentBlock md={text} id={id} heading={heading} links={links} />
                        </Block>
                    </div>
                )}

                {visiblePane === 'image' && (
                    <div id="two" className=" h-full flex align-middle items-center ">
                        <Block hideBorder outerClasses="h-full relative">
                            <Image
                                id={`image:${id}`}
                                alt="Mountains"
                                src={url}
                                layout="fill"
                                placeholder="blur"
                                blurDataURL={placeholder}
                                className="h-auto object-contain"
                            />
                        </Block>
                    </div>
                )}
            </div>
        );

    return (
        <div className="p-4">
            <Allotment defaultSizes={[1, 2]}>
                <Allotment.Pane>
                    <div id="one" className="bg-black h-full">
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll>
                            <ContentBlock md={text} id={id} heading={heading} links={links} />
                        </Block>
                    </div>
                </Allotment.Pane>
                <Allotment.Pane minSize={500}>
                    <div id="two" className=" h-full flex align-middle items-center ">
                        <Block hideBorder outerClasses="h-full relative">
                            <Image
                                id={`image:${id}`}
                                alt="Mountains"
                                src={url}
                                layout="fill"
                                placeholder="blur"
                                blurDataURL={placeholder}
                                className="h-auto object-cover"
                                onLoadingComplete={() => console.log('image loaded!')}
                            />
                        </Block>
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
