import Navbar from "../ui/Navbar";
import Column from "./Column";
import Image from 'next/image'
import NextPrev from "../ui/NextPrev";
// import CodeSnippet from "../ui/CodeSnippet";
import ContentBlock from "./ContentBlock";

export default function ThreeColumns({ md }: { md: string }) {
    return (
        <>
            <Navbar />
            <div className="mx-auto w-full grid grid-cols-[28%,44%,28%] xl:px-2  py-8">
                <Column>

                    code

                    {/* <CodeSnippet md={md} /> */}
                </Column>
                <Column>


                    {/* //<img className="object-fill w-full h-24" src="https://placeimg.com/1000/1000/any" /> */}
                    <Image
                        alt="Mountains"
                        src="https://placeimg.com/1000/1000/any"
                        layout="fill"
                        objectFit="cover"
                        width={1000}
                        height={1000}

                    />


                </Column>
                <Column>

                    <ContentBlock md={md} />

                </Column>
            </div>
            <NextPrev />

        </>
    )
}
