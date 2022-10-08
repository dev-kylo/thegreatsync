
import Column from "./Column";
import Image from 'next/image'

// import CodeSnippet from "../ui/CodeSnippet";
import ContentBlock from "./ContentBlock";

export default function LegacyThreeColumns({ md }: { md: string }) {
    return (
        <>

            <div className="mx-auto w-full grid grid-cols-[1fr,1.5fr,1fr] xl:px-2 py-8 h-48">
                <Column>

                    <ContentBlock md={md} />

                    {/* <CodeSnippet md={md} /> */}
                </Column>
                <Column>


                    {/* //<img className="object-fill w-full h-24" src="https://placeimg.com/1000/1000/any" /> */}
                    <Image
                        alt="Mountains"
                        src="https://placeimg.com/1100/1100/any"
                        layout="responsive"
                        width={1100}
                        height={1100}
                        className="aspect-square"
                    />


                </Column>
                <Column>

                    <ContentBlock md={md} />

                </Column>
            </div>


        </>
    )
}
