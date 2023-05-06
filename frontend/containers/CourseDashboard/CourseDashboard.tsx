import Link from 'next/link';
import { useContext } from 'react';
import Layout from '../../components/layout';
import ContentBlock from '../../components/layout/ContentBlock';
import Video from '../../components/layout/screens/Video';
import Navbar from '../../components/ui/Navbar';
import ProgressIcon from '../../components/ui/ProgressIcon';
import { NavContext } from '../../context/nav';
import type { VideoT } from '../../types';
import Spinner from '../../components/ui/Spinner';

const CourseDashboard = ({ description, title, video }: { title: string; description?: string; video?: VideoT }) => {
    const { menuData, courseSequence } = useContext(NavContext);

    return (
        <Layout>
            {menuData && <Navbar title={`${title}`} menuData={menuData} />}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-6 gap-4 ">
                    <div className="sm:col-span-1 w-full">
                        <div className=" bg-gray-900 rounded-lg shadow-lg p-12 flex flex-col justify-center items-center">
                            <div className="mb-8">
                                {courseSequence ? (
                                    <ProgressIcon amount="70" completed={false} size="28" />
                                ) : (
                                    <Spinner />
                                )}
                            </div>
                            <div className="text-center">
                                <p className="text-xl text-white font-bold mb-2">LEARN JAVASCRIPT</p>
                                <p className="text-base text-gray-400 font-normal">____________________________</p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            {courseSequence && (
                                <Link href={courseSequence.currentPageNode?.data.href || '/courses'} passHref>
                                    <button
                                        type="button"
                                        className="my-4 inline-flex items-center justify-center rounded-md border border-green-400 bg-primary_blue  px-8 py-2 text-base font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
                                    >
                                        Start Learning
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="min-w-sm min-h-[20rem] bg-[#031b4352] rounded-lg sm:col-span-2 px-8">
                        <ContentBlock md={description || ''} id={5} />
                        <div className="p-16">{video && <Video data={video} noPadding />}</div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default CourseDashboard;
