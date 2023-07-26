import { unstable_getServerSession } from 'next-auth/next';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { serverRedirectObject } from '../../libs/helpers';
import { getEnrolledCourses } from '../../services/queries';
import { CourseByUser } from '../../types';
import { authOptions } from '../api/auth/[...nextauth]';
import { setAuthToken } from '../../libs/axios';
import AllCourses from '../../containers/AllCourses';
import LoadingQuote from '../../containers/LoadingQuote';

type HomeProps = { courses: CourseByUser[] };

const UserCourses = ({ courses }: HomeProps) => {
    const { data: session } = useSession();

    if (!session?.jwt || !courses) return <LoadingQuote />;

    return <AllCourses courses={courses} />;
};

export default UserCourses;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    if (session.jwt) setAuthToken(session.jwt as string);

    const resp = await getEnrolledCourses();
    if (!resp || resp.status !== 200) {
        if (!resp) return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error=500`);
        if (resp.status === 401) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
        if (resp.status === 403)
            return serverRedirectObject(
                `/error?redirect=${context.resolvedUrl}&error='You do not have the correct permissions to view this course'`
            );
        if (resp.status === 500)
            return serverRedirectObject(
                `/error?redirect=${context.resolvedUrl}&error='Oh no, the server seems to be down!'`
            );
        return serverRedirectObject(
            `/error?redirect=${context.resolvedUrl}&error=Failed to fetch course data. Received undefined`
        );
    }

    return {
        props: {
            courses: resp.data,
            pageType: 'standalone',
        },
    };
};
