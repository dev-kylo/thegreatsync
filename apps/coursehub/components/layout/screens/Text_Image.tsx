import Image from 'next/image';
import { Allotment } from 'allotment';
import ContentBlock from '../ContentBlock';
import Block from '../Block';
import { ImageComp, ResourceLink } from '../../../types';
import useResponsivePanes from '../../../hooks/useResponsivePanes';
import PaneTabs from '../PaneTabs';
import Spinner from '../../ui/Spinner';

type Text_Image_Props = {
    text: string;
    image: ImageComp;
    imageAlt: string;
    id: number;
    heading?: string;
    links: ResourceLink[];
};

export default function Text_Image({ text, image, id, heading, links, imageAlt }: Text_Image_Props) {
    const { isMobile, visiblePane, setVisiblePane } = useResponsivePanes();
    const { url, placeholder } = image.data.attributes;
    const isSSR = () => typeof window === 'undefined';

    if (isSSR())
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <Spinner />
            </div>
        );

    if (isMobile)
        return (
            <div className="p-4 pt-16 relative">
                <PaneTabs setVisiblePane={setVisiblePane} text image />

                {visiblePane === 'text' && (
                    <div className="bg-black h-full">
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll>
                            <ContentBlock
                                md={text}
                                id={id}
                                heading={heading}
                                links={links}
                                key={`mobiletext-block:-${id}`}
                                textType="block"
                            />
                        </Block>
                    </div>
                )}

                {visiblePane === 'image' && (
                    <div id="two" className=" h-full flex align-middle items-center ">
                        <Block
                            hideBorder
                            outerClasses="h-full relative"
                            key={`mobileimageblock:${image.data.id}-${id}`}
                        >
                            <Image
                                key={`image:${image.data.id}-${id}`}
                                id={`image:${id}`}
                                alt={imageAlt || ''}
                                src={url}
                                fill
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
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll key={`text-block:-${id}`}>
                            <ContentBlock md={text} id={id} heading={heading} links={links} textType="block" />
                        </Block>
                    </div>
                </Allotment.Pane>
                <Allotment.Pane minSize={500}>
                    <div id="two" className=" h-full flex align-middle items-center ">
                        <Block hideBorder outerClasses="h-full relative" key={`imageblock:${image.data.id}-${id}`}>
                            <Image
                                id={`image:${id}`}
                                key={`image:${image.data.id}-${id}`}
                                alt={imageAlt || ''}
                                src={url}
                                fill
                                placeholder="blur"
                                blurDataURL={placeholder}
                                className="h-auto object-cover"
                            />
                        </Block>
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
