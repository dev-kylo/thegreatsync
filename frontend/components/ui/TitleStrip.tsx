const TitleStrip = ({ chapterTitle, subChapterTitle }: { chapterTitle: string; subChapterTitle: string }) => (
    <div className="flex flex-col items-end md:items-center justify-center">
        <span className="text-secondary_lightblue text-md m-0 p-0 md:text-xl block">{chapterTitle}</span>
        <span className=" m-0 mt-1 p-0 text-right md:text-center text-xs block uppercase text-green-400 font-bold">
            {subChapterTitle}
        </span>
    </div>
);

export default TitleStrip;
