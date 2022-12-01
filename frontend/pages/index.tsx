
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

const Home = ({ names }: { names: string }) => {

    const { menuData, courseSequence } = useContext(NavContext);
    console.log(names)

    const title = 'Statements and declarations';

    console.log('MENU DATA');
    console.log(menuData)

    const style = { "--value": 70, "--size": '7em' } as React.CSSProperties

    return (
        <>
            <Layout>
                <Navbar title={`${title}`} menuData={menuData} />

                {/* <div className="flex justify-center m-8">

                    <div className="my-8 max-w-xl rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1">
                    <div>
                    <Image
                            alt="Mountains"
                            src="https://res.cloudinary.com/the-great-sync/image/upload/v1667044950/2000x2000/Whirlpool_F_a_g1mm3x.jpg"
                            layout="responsive"
                            // placeholder="blur"
                            width={3000}
                            height={2000}
                            className="aspect-square h-auto w-full"
                        />
                        </div>

                    </div>

                </div> */}
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
                                    <p className="text-base text-gray-400 font-normal">________________________________________</p>
                                </div>

                            </div>
                            <div className="flex justify-center">
                                {courseSequence && <Link href={courseSequence.currentPageNode?.data.href || '/courses'}>
                                    <button
                                        type="button"
                                        className="my-4 inline-flex items-center justify-center rounded-md border border-green-400 bg-primary_blue  px-8 py-2 text-base font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
                                    >
                                        Start Learning
                                    </button>
                                </Link>}
                            </div>
                        </div>

                        <div className="min-w-sm min-h-[20rem] bg-[#031b4352] rounded-lg sm:col-span-2 px-8">
                            <ContentBlock md={'Hello World'} id={5} />
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

    return {
        props: {
            names: 'mike'
        },
    };
}
