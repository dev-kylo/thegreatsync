import { getServerSession } from 'next-auth/next';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useContext } from 'react';
import { serverRedirectObject } from '../../../libs/helpers';
import { getReflections } from '../../../services/queries';
import { ErrorResponse, ReflectionsResponse } from '../../../types';
import { authOptions } from '../../api/auth/[...nextauth]';
import { setAuthToken } from '../../../libs/axios';
import LoadingQuote from '../../../containers/LoadingQuote';
import { createErrorString } from '../../../libs/errorHandler';
import ReflectionsList from '../../../containers/Reflections';
import Layout from '../../../components/layout';
import Navbar from '../../../components/ui/Navbar';
import { NavContext } from '../../../context/nav';
import ControlBar from '../../../containers/ControlBar';

type HomeProps = { reflections: ReflectionsResponse };

const UserReflections = ({ reflections }: HomeProps) => {
    const { data: session } = useSession();
    const { menuData, pageName, subChapterName, loadingPage, nextPage, prevPage, markPage, showNext, showPrev } =
        useContext(NavContext);

    if (!session?.jwt || !reflections) return <LoadingQuote />;

    return (
        <Layout>
            <Navbar
                current={{ pageId: 0, subchapterId: 0, chapterId: 0 }}
                pageTitle="Reflections"
                subChapterTitle=""
                menuData={menuData}
                markPage={markPage}
            />
            <ReflectionsList reflections={reflections} />

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

export default UserReflections;

export const getServerSideProps: GetServerSideProps = async (context) => {
    console.log('getServerSideProps');
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    if (session.jwt) setAuthToken(session.jwt as string);

    const { courseId } = context.params as { courseId: string };

    const resp = await getReflections(courseId);

    console.log(resp);

    if (!resp || resp.error) {
        const er = resp?.data as unknown as ErrorResponse;
        if (!resp) return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error=500`);
        if (resp.error?.status === 401) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
        if (resp.error?.status === 403)
            return serverRedirectObject(
                `/error?redirect=${
                    context.resolvedUrl
                }&error='You do not have the correct permissions to view this course. ${encodeURIComponent(
                    createErrorString(er?.error)
                )}'`
            );
        if (resp.error?.status === 500)
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
            reflections: resp,
        },
    };
};
