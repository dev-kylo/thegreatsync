import { getServerSession } from 'next-auth/next';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import CourseDashboard from '../../../containers/CourseDashboard/CourseDashboard';
import { serverRedirectObject } from '../../../libs/helpers';
import { getCourse } from '../../../services/queries';
import { VideoT } from '../../../types';
import { authOptions } from '../../api/auth/[...nextauth]';
import { setAuthToken } from '../../../libs/axios';
import LoadingQuote from '../../../containers/LoadingQuote';
import type { ErrorResponse } from '../../../types';
import { createErrorString } from '../../../libs/errorHandler';

type CourseData = { title: string; description?: string; video: VideoT | null };
type CourseProps = { course: CourseData };

const Course = ({ course }: CourseProps) => {
    const { data: session } = useSession();

    if (!session?.jwt) return <LoadingQuote />;
    return (
        <>
            <Head>
                <title>{course.title} - Dashboard</title>
            </Head>
            <CourseDashboard title={course.title} description={course.description} video={course?.video || undefined} />
        </>
    );
};

export default Course;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    if (session.jwt) setAuthToken(session.jwt as string);

    const { courseId } = context.params as { courseId: string };

    const resp = await getCourse(courseId);

    if (!resp || resp.error || !resp.data) {
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

    const descriptionItems = resp.data.attributes.description;
    const text = descriptionItems.find((item) => item.__component === 'media.text')?.text;
    const video = descriptionItems.find((item) => item.__component === 'media.video')?.video;

    return {
        props: {
            course: {
                title: resp.data.attributes.title,
                description: text,
                video: video || null,
            },
        },
    };
};
