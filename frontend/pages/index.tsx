
import Navbar from '../components/ui/Navbar';
import { getSession } from 'next-auth/react';
import { serverRedirectObject } from '../libs/helpers';
import { GetServerSideProps } from 'next';
import { useContext } from 'react';
import { NavContext } from '../context/nav';
import Layout from '../components/layout';
import Image from 'next/image';
import ProgressIcon from '../components/ui/ProgressIcon';
import Block from '../components/layout/Block';
import ContentBlock from '../components/layout/ContentBlock';
import Link from 'next/link';
import { getCourse } from '../services/queries';
import Video from '../components/layout/screens/Video';
import { VideoT } from '../types';

const Home = ({ description, title, video }: { title: string, description?: string, video?: VideoT }) => {

    const { menuData, courseSequence } = useContext(NavContext);

    return (
        <>
            <Layout>
                <Navbar title={`${title}`} menuData={menuData} />
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12 mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-6 gap-4 ">
                        <div className="sm:col-span-1 w-full">
                            <div
                                className=" bg-gray-900 rounded-lg shadow-lg p-12 flex flex-col justify-center items-center"
                            >
                                <div className="mb-8">
                                    <ProgressIcon amount="70" completed={false} size="28" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xl text-white font-bold mb-2">LEARN JAVASCRIPT</p>
                                    <p className="text-base text-gray-400 font-normal">____________________________</p>
                                </div>

                            </div>
                            <div className="flex justify-center">
                                {courseSequence &&
                                    <Link href={courseSequence.currentPageNode?.data.href || '/courses'}>
                                        <button
                                            type="button"
                                            className="my-4 inline-flex items-center justify-center rounded-md border border-green-400 bg-primary_blue  px-8 py-2 text-base font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
                                        >
                                            Start Learning
                                        </button>
                                    </Link>
                                }
                            </div>
                        </div>

                        <div className="min-w-sm min-h-[20rem] bg-[#031b4352] rounded-lg sm:col-span-2 px-8">
                            <ContentBlock md={description || ''} id={5} />
                            <div className="p-16">
                                {video && <Video data={video} noPadding />}
                            </div>
                        </div>

                    </div>
                </section>

            </Layout>

        </>
    );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);

    const resp = (await getCourse(2, session)).data;
    const descriptionItems = resp.attributes.description;
    const text = descriptionItems.find(item => item.__component === 'media.text')?.text;
    const video = descriptionItems.find(item => item.__component === 'media.video')?.video;

    return {
        props: {
            title: resp.attributes.title,
            description: text,
            video
        },
    };
}
