import { getServerSession } from 'next-auth/next';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { serverRedirectObject } from '../libs/helpers';
import { getEnrolledCourses } from '../services/queries';
import { CourseByUser } from '../types';
import { authOptions } from './api/auth/[...nextauth]';
import { setAuthToken } from '../libs/axios';
import AllCourses from '../containers/AllCourses';
import LoadingQuote from '../containers/LoadingQuote';
import type { ErrorResponse } from '../types';
import { createErrorString } from '../libs/errorHandler';

type HomeProps = { courses: CourseByUser[] };

const Home = ({ courses }: HomeProps) => {
    const { data: session } = useSession();

    if (!session?.jwt || !courses) return <LoadingQuote />;

    return <AllCourses courses={courses} />;
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    if (session.jwt) setAuthToken(session.jwt as string);

    const resp = await getEnrolledCourses();
    if (!resp || resp.status !== 200) {
        const er = resp?.data as unknown as ErrorResponse;
        if (!resp) return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error=500`);
        if (resp.status === 401) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
        if (resp.status === 403)
            return serverRedirectObject(`/notallowed?error=${encodeURIComponent(createErrorString(er?.error))}`);
        if (resp.status === 500)
            return serverRedirectObject(
                `/error?redirect=${context.resolvedUrl}&error='Oh no, the server seems to be down! ${encodeURIComponent(
                    createErrorString(er?.error)
                )}'`
            );
        return serverRedirectObject(
            `/error?redirect=${context.resolvedUrl}&error=Failed to fetch course data. ${encodeURIComponent(
                createErrorString(er?.error)
            )}`
        );
    }
    // Redirect to dashboard if there is only one course

    if (resp.data.length === 1) return serverRedirectObject(`/courses/${resp.data[0].id}`);

    return {
        props: {
            courses: resp.data,
            pageType: 'standalone',
        },
    };
};
