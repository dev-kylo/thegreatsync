import { getServerSession } from 'next-auth/next';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { serverRedirectObject } from '../../../libs/helpers';
import { getReflections } from '../../../services/queries';
import { ErrorResponse } from '../../../types';
import { authOptions } from '../../api/auth/[...nextauth]';
import { setAuthToken } from '../../../libs/axios';
import LoadingQuote from '../../../containers/LoadingQuote';
import { createErrorString } from '../../../libs/errorHandler';
import Layout from '../../../components/layout';
import Navbar from '../../../components/ui/Navbar';
import { NavContext } from '../../../context/nav';
import ModelCarousel from '../../../containers/ModelCarousel';

type HomeProps = { courseId: string };

const CourseImageModel = ({ courseId }: HomeProps) => {
    const { data: session } = useSession();
    const { menuData, nextPage, markPage } = useContext(NavContext);

    if (!session?.jwt || !courseId) return <LoadingQuote />;

    return (
        <Layout>
            <Navbar
                current={{ pageId: 0, subchapterId: 0, chapterId: 0 }}
                pageTitle="The Imagimodel"
                subChapterTitle=""
                menuData={menuData}
                markPage={markPage}
            />

            <iframe title="imagimodel" src={`https://imagimodel.com/course/${courseId}`} className="w-full h-full" />

            <Modal open setOpen={() => {}}>
                <ModelCarousel
                    heading="Imagimodel"
                    pageSteps={[
                        {
                            id: 123323,
                            __component: 'media.text_image',
                            text: 'Welcome to Imagimodel!',
                            image_alt: 'Introduction image',
                            orderNumber: 1,
                            image: {
                                data: {
                                    id: 1,
                                    attributes: {
                                        width: 800,
                                        height: 600,
                                        url: 'https://the-great-sync.s3.amazonaws.com/4_Full_ic82lf_a3a6d2eebe.png',
                                        title: 'Introduction Image',
                                        placeholder: 'Introduction Image',
                                        size: 123456,
                                        hash: 'intro_hash',
                                    },
                                },
                            },
                            status: 'current',
                        },
                        {
                            id: 232321312,
                            __component: 'media.text_image',
                            text: 'Learn the fundamentals',
                            image_alt: 'Basic concepts image',
                            orderNumber: 23,
                            image: {
                                data: {
                                    id: 2,
                                    attributes: {
                                        width: 800,
                                        height: 600,
                                        url: 'https://the-great-sync.s3.amazonaws.com/Operator_Cinematic_q1sfux_6e9a57d592.png',
                                        title: 'Basic Concepts Image',
                                        placeholder: 'Basic Concepts Image',
                                        size: 123456,
                                        hash: 'basics_hash',
                                    },
                                },
                            },
                            status: 'default',
                        },
                        {
                            id: 3231231,
                            __component: 'media.text_image',
                            text: 'Ice Island',
                            image_alt: 'Ice Island',
                            orderNumber: 2,
                            image: {
                                data: {
                                    id: 3,
                                    attributes: {
                                        width: 800,
                                        height: 600,
                                        url: 'https://the-great-sync.s3.amazonaws.com/Captain_Pointing_oclmki_a6af5cb6ac.jpg',
                                        title: 'Basic Concepts Image',
                                        placeholder: 'Basic Concepts Image',
                                        size: 123456,
                                        hash: 'basics_hash',
                                    },
                                },
                            },
                            status: 'default',
                        },
                        {
                            id: 4321321334,
                            __component: 'media.text_image',
                            text: 'Pointing at island',
                            image_alt: 'Pointing',
                            orderNumber: 4,
                            image: {
                                data: {
                                    id: 4,
                                    attributes: {
                                        width: 800,
                                        height: 600,
                                        url: 'https://the-great-sync.s3.amazonaws.com/Ship_Pointing_2_nnrnkg_5b95eb8565.png',
                                        title: 'Pointing',
                                        placeholder: 'Pointing',
                                        size: 123456,
                                        hash: 'basics_hash',
                                    },
                                },
                            },
                            status: 'default',
                        },
                        {
                            id: 324325,
                            __component: 'media.text_image',
                            text: 'Captain Pointing',
                            image_alt: 'Basic concepts image',
                            orderNumber: 5,
                            image: {
                                data: {
                                    id: 5,
                                    attributes: {
                                        width: 800,
                                        height: 600,
                                        url: 'https://the-great-sync.s3.amazonaws.com/Captain_Pointing_oclmki_a6af5cb6ac.jpg',
                                        title: 'Basic Concepts Image',
                                        placeholder: 'Basic Concepts Image',
                                        size: 123456,
                                        hash: 'basics_hash',
                                    },
                                },
                            },
                            status: 'default',
                        },
                        {
                            id: 32432416,
                            __component: 'media.text_image',
                            text: 'Complex Scene',
                            image_alt: 'Basic concepts image',
                            orderNumber: 2,
                            image: {
                                data: {
                                    id: 2,
                                    attributes: {
                                        width: 800,
                                        height: 600,
                                        url: 'https://the-great-sync.s3.amazonaws.com/Object_Chained_Pointing_szth0k_3217254874.jpg',
                                        title: 'Complex Scene',
                                        placeholder: 'Basic Concepts Image',
                                        size: 123456,
                                        hash: 'basics_hash',
                                    },
                                },
                            },
                            status: 'default',
                        },
                    ]}
                    links={[]}
                    nextStep={() => {}}
                    prevStep={() => {}}
                    showNextButton={false}
                    type="text_image"
                    loadingPage={false}
                    showNext={false}
                    showPrev={false}
                    nextPage={() => {}}
                    prevPage={() => {}}
                    goToStep={() => {}}
                />
            </Modal>

            <button
                type="button"
                onClick={nextPage}
                aria-label="Next Page"
                className="w-40 mx-auto px-2 text-lg py-2 md:px-4 md:py-1 md:text-base inline-flex items-center justify-center rounded-md border border-secondary_lightblue bg-primary_blue font-medium text-white shadow-sm hover:bg-primary_green focus:outline-none focus:ring-2 focus:ring-primary_green focus:ring-offset-2"
            >
                Resume Course
            </button>
        </Layout>
    );
};

export default CourseImageModel;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    if (session.jwt) setAuthToken(session.jwt as string);

    const { courseId } = context.params as { courseId: string };

    const resp = await getReflections(courseId);

    if (!resp || 'error' in resp) {
        const er = resp as unknown as ErrorResponse;
        if (!er) return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error=500`);
        if (er.error?.status === 401) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
        if (er.error?.status === 403)
            return serverRedirectObject(
                `/error?redirect=${
                    context.resolvedUrl
                }&error='You do not have the correct permissions to view this course. ${encodeURIComponent(
                    createErrorString(er?.error)
                )}'`
            );
        if (er.error?.status === 500)
            return serverRedirectObject(
                `/error?redirect=${context.resolvedUrl}&error='Oh no, the server seems to be down! ${encodeURIComponent(
                    createErrorString(er?.error)
                )}'`
            );
        return serverRedirectObject(
            `/error?redirect=${context.resolvedUrl}&error=${encodeURIComponent(createErrorString(er?.error))}`
        );
    }

    return {
        props: {
            courseId,
        },
    };
};
