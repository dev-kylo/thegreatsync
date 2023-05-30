const TitleStrip = ({ chapterTitle, subChapterTitle }: { chapterTitle: string; subChapterTitle: string }) => (
    <div className="">
        <span className="text-secondary_lightblue m-0 p-0 text-xl block">{chapterTitle}</span>
        <span className=" m-0 mt-1 p-0 text-xs block uppercase text-center text-green-400 font-bold">
            {subChapterTitle}
        </span>
    </div>
);

export default TitleStrip;
