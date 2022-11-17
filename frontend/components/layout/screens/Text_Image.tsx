
import Image from 'next/image'
import ContentBlock from "../ContentBlock";
import Block from "../Block";
import { ImageComp } from '../../../types';

// To add line numbers in code, use the numbered prop in ContentBlock

type Text_Image_Props = { text: string, image: ImageComp, id: number }

export default function Text_Image({ text, image, id }: Text_Image_Props) {
    const { width, height, url } = image?.data?.attributes;

    return (
        <>

            <div className="py-32 px-16 self-center 2xl:px-32 scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
                <div className="mx-auto w-full grid grid-cols-[1fr,2.5fr] gap-1 xl:px-2 self-center ">

                    <Block outerClasses="bg-[#111111]" innerClasses="p-4" enableScroll>
                        <ContentBlock md={text} id={id} />
                    </Block>

                    <Block image outerClasses="w-full">
                        <Image
                            alt="Mountains"
                            src={url || "https://res.cloudinary.com/the-great-sync/image/upload/v1667044950/2000x2000/Whirlpool_F_a_g1mm3x.jpg"}
                            layout="responsive"
                            // placeholder="blur"
                            width={width || 3000}
                            height={height || 2000}
                            className="aspect-square h-auto w-full"
                        />
                    </Block>


                </div>

            </div>
        </>
    )
}
