import Image from 'next/image';
import ContentBlock from '../ContentBlock';
import Block from '../Block';

export default function TextCode_Image({ md }: { md: string }) {
    return (
        <div className="py-32 px-16 self-center 2xl:px-32 scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
            <div className="mx-auto w-full grid grid-cols-[1fr,2.5fr] gap-1 xl:px-2 self-center ">
                <div className="flex flex-col">
                    <Block outerClasses="bg-[#111111] h-full mb-1" innerClasses="p-4" enableScroll>
                        <ContentBlock md={md} id={0} />
                    </Block>
                    <Block outerClasses="bg-[#111111] h-full mt-1" innerClasses="p-4" enableScroll>
                        <ContentBlock id={0} md={md} />
                    </Block>
                </div>

                <Block outerClasses="w-full">
                    <Image
                        alt="Mountains"
                        src="https://placeimg.com/3000/2000/tech"
                        layout="responsive"
                        width={3000}
                        height={2000}
                        className="aspect-square h-auto w-full"
                    />
                </Block>
            </div>
        </div>
    );
}
