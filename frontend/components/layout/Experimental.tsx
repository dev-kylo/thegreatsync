

import Column from "./Column";
import Image from 'next/image'

// import CodeSnippet from "../ui/CodeSnippet";
import ContentBlock from "./ContentBlock";

export default function Experimental({ md }: { md: string }) {
    return (
        <>
            <div className="py-8 px-8 self-center 2xl:px-32 scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
                <div className="mx-auto w-full grid grid-cols-[1fr,1.5fr,1fr] gap-1 xl:px-2 self-center ">

                    <div className="relative overflow-hidden rounded-lg bg-code_bg border-2 border-r-2 border-secondary_lightblue scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll ">
                        <div className="absolute top-0 left-0 w-full h-auto">
                            <Column>
                                <ContentBlock md={md} />
                            </Column>
                        </div>
                    </div>

                    <Column>
                        <div className="rounded-lg bg-[#111111] border-2 border-r-2 border-secondary_lightblue overflow-hidden w-full ">
                            <div className="">
                                <Image
                                    alt="Mountains"
                                    src="https://placeimg.com/2000/2000/any"
                                    layout="responsive"
                                    width={2000}
                                    height={2000}
                                    className="aspect-square h-auto w-full"
                                />
                            </div>
                        </div>
                    </Column>

                    <div className="relative overflow-hidden rounded-lg bg-[#111111] border-2 border-r-2 border-secondary_lightblue scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll ">
                        <div className="absolute top-0 left-0 w-full h-auto p-4">
                            <Column>
                                <ContentBlock md={md} />
                            </Column>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}
