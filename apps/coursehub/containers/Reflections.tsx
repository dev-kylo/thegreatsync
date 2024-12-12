import MarkdownBlock from '../components/layout/blocks/MarkdownBlock';
import { ReflectionsResponse } from '../types';

const ReflectionsList = ({ reflections }: { reflections: ReflectionsResponse }) => {
    return (
        <div className="h-full w-full relative overflow-hidden rounded-lg scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll overflow-x-scroll ">
            <div className="self-center 2xl:px-32 scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
                <div className="w-[80%] mx-auto mt-24 my-12">
                    {reflections.length === 0 && (
                        <div className="text-center text-white">
                            You have not submitted any reflections yet. 
                        </div>
                    )}

                    {reflections?.map((reflection) => {
                        if (!reflection.reflection) return null;
                        return (
                            <div
                                className=" bg-[#031b4352] text-white relative p-8 my-16 shadow-2xl rounded-md"
                                key={reflection.id}
                            >
                                <article
                                    id="md-article-block"
                                    key={`md-article-block:${reflection.id}`}
                                    className="prose prose-h2:text-3xl max-w-none prose-h3:text-2xl prose-strong:text-[#c792ea] prose-strong:font-extrabold prose-li:text-offwhite prose-span:text-offwhite  prose-a:text-green-500 prose-em:text-offwhite prose-p:text-offwhite prose-headings:text-secondary_lightblue prose-pre:p-0 prose-code:text-[#7fdbca] prose-code:font-mono prose-code:after:hidden prose-code:before:hidden"
                                >
                                    <MarkdownBlock md={reflection.reflection} />
                                </article>
                                <div className="absolute top-[-1.5rem] left-0 bg-green-500 text-primary_blue pt-0 pb-1 px-2">
                                    {reflection?.chapter?.title || reflection?.subchapter?.title || ''}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReflectionsList;
