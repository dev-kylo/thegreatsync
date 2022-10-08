
import Image from 'next/image'
import ContentBlock from "./ContentBlock";
import Block from "./Block";

export default function Experimental({ md }: { md: string }) {
    return (
        <>

            <div className="py-8 px-8 self-center 2xl:px-32 scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
                <div className="mx-auto w-full grid grid-cols-[1fr,1.5fr,1fr] gap-1 xl:px-2 self-center ">

                    <Block outerClasses="bg-code_bg" enableScroll>
                        <ContentBlock md={md} />
                    </Block>

                    <Block image outerClasses="w-full">
                        <Image
                            alt="Mountains"
                            src="https://placeimg.com/2000/2000/any"
                            layout="responsive"
                            width={2000}
                            height={2000}
                            className="aspect-square h-auto w-full"
                        />
                    </Block>

                    <Block outerClasses="bg-[#111111]" innerClasses="p-4" enableScroll>
                        <ContentBlock md={md} />
                    </Block>


                </div>

            </div>
        </>
    )
}
