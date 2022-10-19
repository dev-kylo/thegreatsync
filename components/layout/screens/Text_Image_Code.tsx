
import Image from 'next/image'
import ContentBlock from "../ContentBlock";
import Block from "../Block";
import Steps from '../../ui/Steps';

export default function Text_Image_Code({ text, code }: { text: string, code: string }) {
    return (
        <>

            <div className="py-8 px-8 self-center 2xl:px-32 relative">
                <div className="mx-auto w-full grid grid-cols-[1fr,1.5fr,1fr] gap-1 xl:px-2 self-center relative">

                    <Block outerClasses="bg-code_bg" enableScroll>
                        <ContentBlock md={code} numbered />
                    </Block>

                    <Block image outerClasses="w-full relative">
                        <Image
                            alt="Mountains"
                            src="https://placeimg.com/2000/2000/tech"
                            layout="responsive"
                            width={2000}
                            height={2000}
                            className="aspect-square h-auto w-full"
                        />

                    </Block>

                    <Block outerClasses="bg-[#111111]" innerClasses="p-4" enableScroll>
                        <ContentBlock md={text} />
                    </Block>

                    {/* <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-35px]">
                        <Steps />
                    </div> */}
                </div>


            </div>
        </>
    )
}
