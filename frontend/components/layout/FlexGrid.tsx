
import Column from "./Column";
import Image from 'next/image'

// import CodeSnippet from "../ui/CodeSnippet";
import ContentBlock from "./ContentBlock";

export default function FlexGrid({ md }: { md: string }) {
    return (
        <>

            <div className="mx-auto w-full flex xl:px-2 py-8">
                <div className="grow">
                    <Column>

                        <ContentBlock md={md} />

                        {/* <CodeSnippet md={md} /> */}
                    </Column>
                </div>
                <div className="min-h-[40%] w-3/5">
                    <Column>

                        {/* //<img className="object-fill w-full h-24" src="https://placeimg.com/1000/1000/any" /> */}
                        <div className="">
                            <Image
                                alt="Mountains"
                                src="https://placeimg.com/1000/1000/any"
                                layout="responsive"
                                width={1000}
                                height={1000}
                            />
                        </div>

                    </Column>
                </div>
                <div className=" grow">
                    <Column>

                        <ContentBlock md={md} />

                    </Column>
                </div>
            </div>


        </>
    )
}
