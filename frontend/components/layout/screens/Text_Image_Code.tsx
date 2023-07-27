import Image from 'next/image';
import { Allotment } from 'allotment';
import Block from '../Block';
import ContentBlock from '../ContentBlock';
import { ImageComp, ResourceLink } from '../../../types';
import useResponsivePanes from '../../../hooks/useResponsivePanes';
import PaneTabs from '../PaneTabs';
import CopyButton from '../../ui/CopyButton';
import Spinner from '../../ui/Spinner';

type Text_Image_Code_Props = {
    text: string;
    code: string;
    image: ImageComp;
    imageAlt: string;
    id: number;
    links: ResourceLink[];
    heading?: string;
};

export default function Text_Image_Code({ text, code, image, imageAlt, id, heading, links }: Text_Image_Code_Props) {
    const { isMobile, visiblePane, setVisiblePane } = useResponsivePanes();
    const { url, placeholder } = image.data.attributes;

    const isSSR = () => typeof window === 'undefined';

    if (isSSR())
        return (
            <div className="w-full h-screen flex flex-col justify-center items-center">
                <Spinner />
            </div>
        );

    if (isMobile) {
        return (
            <div className="p-4 pt-16 relative max-h-[85%] md:max-h-full">
                <PaneTabs text image code setVisiblePane={setVisiblePane} />
                <div className="h-full">
                    {visiblePane === 'text' && (
                        <div className="bg-black h-full w-full">
                            <Block
                                outerClasses="bg-code_bg"
                                innerClasses="p-4"
                                enableScroll
                                key={`mobiletext-block:-${id}`}
                            >
                                <ContentBlock md={text} id={id} heading={heading} links={links} />
                            </Block>
                        </div>
                    )}
                    {visiblePane === 'image' && (
                        <div className=" h-full flex align-middle items-center ">
                            <Block
                                hideBorder
                                outerClasses=" h-full relative"
                                key={`mobileimageblock:${image.data.id}-${id}`}
                            >
                                <Image
                                    id={`image:${image.data.id}`}
                                    key={`image:${image.data.id}-${id}`}
                                    alt={imageAlt || ''}
                                    src={url}
                                    layout="fill"
                                    placeholder="blur"
                                    blurDataURL={placeholder}
                                    className="aspect-square h-auto object-contain"
                                />
                            </Block>
                        </div>
                    )}
                    {visiblePane === 'code' && (
                        <div className="bg-violet-800 h-full relative">
                            <Block outerClasses="bg-code_bg" enableScroll>
                                <ContentBlock md={code} id={id} />
                            </Block>
                            <CopyButton textcode={code} />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Allotment defaultSizes={[1, 1.5, 1]}>
                <Allotment.Pane>
                    <div id="one" className="bg-black h-full w-full ">
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll key={`text-block:-${id}`}>
                            <ContentBlock md={text} id={id} heading={heading} links={links} />
                        </Block>
                    </div>
                </Allotment.Pane>

                <Allotment.Pane minSize={200}>
                    <div id="two" className=" h-full flex align-middle items-center ">
                        <Block hideBorder outerClasses=" h-full relative" key={`imageblock:${image.data.id}-${id}`}>
                            <Image
                                key={`image:${image.data.id}-${id}`}
                                id={`image:${id}`}
                                alt={imageAlt || ''}
                                src={url}
                                layout="fill"
                                placeholder="blur"
                                blurDataURL={placeholder}
                                className="aspect-square h-auto object-cover"
                            />
                        </Block>
                    </div>
                </Allotment.Pane>

                <Allotment.Pane>
                    <div id="three" className="bg-violet-800 h-full ">
                        <Block outerClasses="bg-code_bg" enableScroll key={`code-block:-${id}`}>
                            <ContentBlock md={code} id={id} />
                        </Block>
                        <CopyButton textcode={code} />
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
