import Image from 'next/image';
import { Allotment } from 'allotment';
import Block from '../Block';
import ContentBlock from '../ContentBlock';
import { ImageComp, ResourceLink } from '../../../types';

type Text_Image_Code_Props = {
    text: string;
    code: string;
    image: ImageComp;
    id: number;
    links: ResourceLink[];
    showImageBorder?: boolean;
    heading?: string;
};

export default function Text_Image_Code({
    text,
    code,
    image,
    id,
    showImageBorder,
    heading,
    links,
}: Text_Image_Code_Props) {
    console.log({ image, code, text, id, showImageBorder });
    const { url, placeholder } = image.data.attributes;

    return (
        <div className="p-4">
            <Allotment defaultSizes={[1, 1.5, 1]}>
                <Allotment.Pane>
                    <div id="one" className="bg-black h-full w-full ">
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll>
                            <ContentBlock md={text} id={id} heading={heading} links={links} />
                        </Block>
                    </div>
                </Allotment.Pane>
                <Allotment.Pane minSize={200} preferredSize="20%">
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
                </Allotment.Pane>
                <Allotment.Pane>
                    <div id="three" className="bg-violet-800 h-full ">
                        <Block outerClasses="bg-code_bg" enableScroll>
                            <ContentBlock md={code} id={id} />
                        </Block>
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
