import Image from 'next/image';
import { Allotment } from 'allotment';
import Block from '../Block';
import ContentBlock from '../ContentBlock';
import { ImageComp, ResourceLink } from '../../../types';
import useResponsivePanes from '../../../hooks/useResponsivePanes';
import PaneTabs from '../PaneTabs';
import CopyButton from '../../ui/CopyButton';

type Text_Image_Code_Props = {
    text: string;
    code: string;
    image: ImageComp;
    id: number;
    links: ResourceLink[];
    heading?: string;
};

export default function Text_Image_Code({ text, code, image, id, heading, links }: Text_Image_Code_Props) {
    const { isMobile, visiblePane, setVisiblePane } = useResponsivePanes();
    const { url, placeholder } = image.data.attributes;

    console.log(code);
    if (isMobile)
        return (
            <div className="p-4 pt-16 relative">
                <PaneTabs text image code setVisiblePane={setVisiblePane} />

                {visiblePane === 'text' && (
                    <div className="bg-black h-full w-full">
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll>
                            <ContentBlock md={text} id={id} heading={heading} links={links} />
                        </Block>
                    </div>
                )}
                {visiblePane === 'image' && (
                    <div className=" h-full flex align-middle items-center ">
                        <Block hideBorder outerClasses=" h-full relative">
                            <Image
                                id={`image:${id}`}
                                alt="Mountains"
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
        );

    return (
        <div className="p-4">
            <Allotment defaultSizes={[1, 1.5, 1]}>
                {(!isMobile || (isMobile && visiblePane === 'text')) && (
                    <Allotment.Pane>
                        <div id="one" className="bg-black h-full w-full ">
                            <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll>
                                <ContentBlock md={text} id={id} heading={heading} links={links} />
                            </Block>
                        </div>
                    </Allotment.Pane>
                )}
                {(!isMobile || (isMobile && visiblePane === 'image')) && (
                    // <Allotment.Pane minSize={200} preferredSize="20%">
                    <div id="two" className=" h-full flex align-middle items-center ">
                        <Block hideBorder outerClasses=" h-full relative">
                            <Image
                                id={`image:${id}`}
                                alt="Mountains"
                                src={url}
                                layout="fill"
                                placeholder="blur"
                                blurDataURL={placeholder}
                                className="aspect-square h-auto object-cover"
                                onLoadingComplete={() => console.log('image loaded!')}
                            />
                        </Block>
                    </div>
                    // </Allotment.Pane>
                )}
                {(!isMobile || (isMobile && visiblePane === 'code')) && (
                    <Allotment.Pane>
                        <div id="three" className="bg-violet-800 h-full ">
                            <Block outerClasses="bg-code_bg" enableScroll>
                                <ContentBlock md={code} id={id} />
                            </Block>
                            <CopyButton textcode={code} />
                        </div>
                    </Allotment.Pane>
                )}
            </Allotment>
        </div>
    );
}
