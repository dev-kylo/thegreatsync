import { unstable_getServerSession } from 'next-auth/next';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import CourseDashboard from '../../../containers/CourseDashboard/CourseDashboard';
import { serverRedirectObject } from '../../../libs/helpers';
import { getCourse } from '../../../services/queries';
import { VideoT } from '../../../types';
import { authOptions } from '../../api/auth/[...nextauth]';
import { setAuthToken } from '../../../libs/axios';
import LoadingQuote from '../../../containers/LoadingQuote';

type CourseData = { title: string; description?: string; video: VideoT | null };
type CourseProps = { course: CourseData };

const Course = ({ course }: CourseProps) => {
    const { data: session } = useSession();

    if (!session?.jwt) return <LoadingQuote />;
    return <CourseDashboard title={course.title} description={course.description} />;
};

export default Course;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    if (session.jwt) setAuthToken(session.jwt as string);

    const { courseId } = context.params as { courseId: string };

    const resp = await getCourse(courseId);

    if (!resp || resp.error || !resp.data) {
        if (!resp) return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error=500`);
        if (resp.error?.status === 401) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
        if (resp.error?.status === 403)
            return serverRedirectObject(
                `/error?redirect=${context.resolvedUrl}&error='You do not have the correct permissions to view this course'`
            );
        if (resp.error?.status === 500)
            return serverRedirectObject(
                `/error?redirect=${context.resolvedUrl}&error='Oh no, the server seems to be down!'`
            );
        return serverRedirectObject(
            `/error?redirect=${context.resolvedUrl}&error=${
                resp.error ? `${resp.error.name}: ${resp.error.message}` : 'Failed to fetch course data.'
            }`
        );
    }

    const descriptionItems = resp.data.attributes.description;
    console.log(descriptionItems);
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
