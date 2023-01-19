
import { unstable_getServerSession } from "next-auth/next";
import CourseDashboard from '../containers/CourseDashboard/CourseDashboard';
import { serverRedirectObject } from '../libs/helpers';
import { GetServerSideProps } from 'next';
import { getCourse } from '../services/queries';
import { ErrorData, VideoT } from '../types';
import { createErrorString } from '../libs/errorHandler';
import { authOptions } from './api/auth/[...nextauth]';
import { setAuthToken } from "../libs/axios";

type CourseData = { title: string, description?: string, video?: VideoT }
type HomeProps = { course?: CourseData, error?: { error: boolean, data: ErrorData } }

const Home = ({ course, error }: HomeProps) => {

    if (error && error.data && error.data.status === '500') return <p>Oh no, looks like a 500 server error!</p>;
    if (error || !course) return <p>Oh no we have an issue</p>;
    return <CourseDashboard title={course.title} description={course.description} video={course.video} />

}

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    session.jwt && setAuthToken(session.jwt);

    const resp = (await getCourse(2, session));
    if (!resp || resp.error || !resp.data) {
        console.log('THERE IS AN ERROR')
        if (!resp) return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error=500`);
        if (resp.error.status === 401) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
        if (resp.error.status === 403) return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error='You do not have the correct permissions to view this course'`);
        else if (resp.error.status === 500) return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error='Oh no, the server seems to be down!'`);
        return serverRedirectObject(`/error?redirect=${context.resolvedUrl}&error=${resp.error ? `${resp.error.name}: ${resp.error.message}` : 'Failed to fetch course data. Received undefined'}`);
    }

    const descriptionItems = resp.data.attributes.description;
    const text = descriptionItems.find(item => item.__component === 'media.text')?.text;
    const video = descriptionItems.find(item => item.__component === 'media.video')?.video;

    return {
        props: {
            course: {
                title: resp.data.attributes.title,
                description: text,
                video
            }
        }
    };
}
