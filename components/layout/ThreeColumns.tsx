import Navbar from "../ui/Navbar";
import Column from "./Column";
import Image from 'next/image'

export default function ThreeColumns() {
    return (
        <>
            <div className="relative flex w-full min-h-screen flex-col">
                <Navbar />
                <div className="mx-auto w-full grid grid-cols-[28%,44%,28%] xl:px-8">
                    <Column> Grid 1</Column>
                    <Column>
                        <Image
                            alt="Mountains"
                            src="https://placeimg.com/1000/1000/any"
                            layout="responsive"
                            width={2000}
                            height={2000}
                        />
                    </Column>
                    <Column> Grid 3</Column>
                </div>
            </div>
        </>
    )
}
