import Image from 'next/image'
import ContentBlock from "../ContentBlock";
import Block from "../Block";
import { ImageComp } from '../../../types';

type Text_Image_Code_Props = { text: string, code: string, image: ImageComp, id: number, showImageBorder?: boolean }

export default function Text_Image_Code({ text, code, image, id, showImageBorder }: Text_Image_Code_Props) {

    const { width, height, url, placeholder } = image.data.attributes;

    console.log('RENDER TEXT-IMAGE-CODE')
    console.log({ placeholder, url, code })

    return (
        <>

            <div className="py-8 px-8 self-center 2xl:px-32 relative">
                <div className="mx-auto w-full grid grid-cols-[1fr,1.5fr,1fr] gap-1 xl:px-2 self-center relative">

                    <Block outerClasses="bg-[#111111]" innerClasses="p-4" enableScroll>
                        <ContentBlock md={text} id={id} />
                    </Block>

                    <Block image showBorder={showImageBorder} outerClasses="w-full relative">
                        <Image
                            id={`image:${id}`}
                            alt="Mountains"
                            src={url}
                            layout="responsive"
                            placeholder="blur"
                            blurDataURL={placeholder}
                            width={width || 2000}
                            height={height || 2000}
                            className="aspect-square h-auto w-full"
                            onLoadingComplete={() => console.log('image loaded!')}
                        />

                    </Block>
                    {<Block outerClasses="bg-code_bg" enableScroll>
                        <ContentBlock md={code} id={id} />
                    </Block>}

                </div>


            </div>
        </>
    )
}
