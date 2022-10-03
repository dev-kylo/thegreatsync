import Navbar from "../ui/Navbar";
import Column from "./Column";
import Image from 'next/image'
import NextPrev from "../ui/NextPrev";
import TitleStrip from "../ui/TitleStrip";
import CodeSnippet from "../ui/CodeSnippet";

export default function ThreeColumns({ md }: { md: string }) {
    return (
        <>
            <div className="relative flex w-full min-h-screen flex-col">
                <Navbar />
                <TitleStrip />
                <div className="mx-auto w-full grid grid-cols-[28%,44%,28%] xl:px-8 ">
                    <Column>
                        <CodeSnippet md={md} />
                    </Column>
                    <Column>
                        <Image
                            alt="Mountains"
                            src="https://placeimg.com/1000/1000/any"
                            layout="responsive"
                            width={2000}
                            height={2000}
                            className="overflow-hidden"
                        />
                    </Column>
                    <Column> Grid 3</Column>
                </div>
                <NextPrev />
            </div>
        </>
    )
}
