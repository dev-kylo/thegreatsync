import ColumnArea from "./ColumnArea";

export default function ThreeColumns() {
    return (
        <>
            {/* Background color split screen for large screens */}
            <div className="fixed top-0 left-0 h-full w-1/2 bg-white" aria-hidden="true" />
            <div className="fixed top-0 right-0 h-full w-1/2 bg-gray-50" aria-hidden="true" />
            <div className="relative flex min-h-screen flex-col">
                {/* Navb
        {/* 3 column wrapper */}
                <div className="h-16 w-full bg-gray-800"> Nav</div>
                <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
                    {/* Left sidebar & main wrapper */}
                    <div className="min-w-0 flex-1 bg-white xl:flex">
                        <div className="border-b border-gray-200 bg-white xl:w-64 xl:flex-shrink-0 xl:border-b-0 xl:border-r xl:border-gray-200">
                            <div className="h-full py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
                                <ColumnArea> Grid 1</ColumnArea>
                            </div>
                        </div>

                        <div className="bg-white lg:min-w-0 lg:flex-1">
                            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                                <ColumnArea>Grid 2</ColumnArea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0">
                        <div className="h-full py-6 pl-6 lg:w-80">
                            <ColumnArea> Grid 3</ColumnArea>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
