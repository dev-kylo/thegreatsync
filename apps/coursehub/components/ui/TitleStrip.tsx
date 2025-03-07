const TitleStrip = ({
    primaryTitle,
    secondaryTitle,
    pageType,
}: {
    primaryTitle: string;
    secondaryTitle: string;
    pageType?: string;
}) => (
    <div
        className={`flex flex-col mx-4 md:mx-0 ${
            pageType !== 'listing'
                ? 'items-end md:items-center justify-center'
                : 'items-start md:items-start justify-start'
        }`}
    >
        <span className="text-secondary_lightblue text-md m-0 p-0 md:text-xl block">{primaryTitle}</span>
        <span className=" m-0 mt-1 p-0 text-right md:text-center text-xs block uppercase text-green-400 font-bold">
            {secondaryTitle}
        </span>
    </div>
);

export default TitleStrip;
