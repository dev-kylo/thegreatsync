'use client';

import Link from 'next/link';
import { useContext, useState } from 'react';
import Layout from '../../components/layout';
import ContentBlock from '../../components/layout/ContentBlock';
import Video from '../../components/layout/screens/Video';
import Navbar from '../../components/ui/Navbar';
import ProgressIcon from '../../components/ui/ProgressIcon';
import { NavContext } from '../../context/nav';
import type { VideoT } from '../../types';
import Spinner from '../../components/ui/Spinner';

const CourseDashboard = ({ description, title, video }: { title: string; description?: string; video?: VideoT }) => {
    const { menuData, courseSequence, courseCompletionStat } = useContext(NavContext);
    const [loading, setLoading] = useState(false);

    const isProgressing = !Number.isNaN(courseCompletionStat) && courseCompletionStat && courseCompletionStat > 0;

    return (
        <Layout>
            {menuData && (
                <Navbar
                    chapterTitle="Course Dashboard"
                    subChapterTitle="The Great Sync"
                    menuData={menuData}
                    current={{ pageId: 0, subchapterId: 0, chapterId: 0 }}
                />
            )}
            <section className="w-full sm:max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-6 gap-4 ">
                    <div className="sm:col-span-1 w-full">
                        <div className=" bg-gray-900 rounded-lg shadow-lg p-12 flex flex-col justify-center items-center">
                            <div className="mb-8">
                                {courseCompletionStat === null ? (
                                    <Spinner />
                                ) : (
                                    <div className="flex align-center flex-col">
                                        <ProgressIcon
                                            // removeViewbox
                                            amount={!isProgressing ? 1 : courseCompletionStat}
                                            completed={courseCompletionStat === 100}
                                            size="24"
                                        />
                                        <small className="text-green-400 text-center">
                                            {isProgressing ? `${courseCompletionStat}% completed` : `0% completed`}
                                        </small>
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-xl text-white font-bold mb-2">{title}</p>
                                <p className="text-base text-gray-400 font-normal">____________________________</p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            {courseSequence && (
                                <Link href={courseSequence.currentPageNode?.data.href || '/courses'} passHref>
                                    <button
                                        type="button"
                                        onClick={() => setLoading(true)}
                                        disabled={loading}
                                        className="my-4 inline-flex items-center justify-center rounded-md border border-green-400 bg-primary_blue  px-8 py-2 text-base font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
                                    >
                                        {loading ? <Spinner /> : !isProgressing ? 'Start Learning' : 'Resume Learning'}
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="min-w-sm min-h-[75vh]  bg-[#031b4352] relative rounded-lg sm:col-span-2 px-8 overflow-scroll scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll">
                        <div className="absolute top-0 p-8 left-0 w-full h-auto">
                            <ContentBlock md={description || ''} id={5} />
                            <div className="p-16">{video && <Video data={video} noPadding />}</div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CourseDashboard;
