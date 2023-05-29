import Image from 'next/image';
import { Allotment } from 'allotment';
import ContentBlock from '../ContentBlock';
import Block from '../Block';
import { ImageComp } from '../../../types';

type Text_Image_Props = { text: string; image: ImageComp; id: number; heading?: string };

export default function Text_Image({ text, image, id, heading }: Text_Image_Props) {
    const { url, placeholder } = image.data.attributes;

    return (
        <div className="p-4">
            <Allotment defaultSizes={[1, 2]}>
                <Allotment.Pane>
                    <div id="one" className="bg-black h-full">
                        <Block outerClasses="bg-code_bg" innerClasses="p-4" enableScroll>
                            <ContentBlock md={text} id={id} heading={heading} />
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
