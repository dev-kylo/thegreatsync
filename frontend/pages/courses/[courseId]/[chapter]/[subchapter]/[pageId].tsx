import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { useContext } from 'react';
import { useSession } from 'next-auth/react';
import Protected from '../../../../../containers/Protected';
import Layout from '../../../../../components/layout';
import Navbar from '../../../../../components/ui/Navbar';
import { NavContext } from '../../../../../context/nav';
import { getPage } from '../../../../../services/queries';
import { serverRedirectObject } from '../../../../../libs/helpers';
import { PageContent, PageType } from '../../../../../types';
import Text_Image_Code from '../../../../../components/layout/screens/Text_Image_Code';
import Text_Image from '../../../../../components/layout/screens/Text_Image';
import Video from '../../../../../components/layout/screens/Video';
import ControlBar from '../../../../../containers/ControlBar';
import PageStepsController from '../../../../../containers/PageStepsController';
import Text from '../../../../../components/layout/screens/Text';
import { authOptions } from '../../../../api/auth/[...nextauth]';
import { setAuthToken } from '../../../../../libs/axios';

type CoursePageProps = {
    title: string | number;
    type: PageType;
    content: PageContent[];
};
export default function CoursePage({ title, type, content }: CoursePageProps) {
    const { menuData, nextPage, prevPage } = useContext(NavContext);

    const { data: session } = useSession();
    setAuthToken((session?.jwt as string) || '');

    console.log({ title, type, content });

    const { id, code, text, image, video } = content[0];
    let contentLayout = null;

    const hasPageSteps = content.length > 1;

    if (hasPageSteps) contentLayout = <PageStepsController pageContent={content} type={type} />;
    else if (type === 'text') contentLayout = <Text text={text} heading={title} id={id} />;
    else if (type === 'text_image_code')
        contentLayout = <Text_Image_Code code={code!} text={text} heading={title} image={image} id={id} />;
    else if (type === 'text_image') contentLayout = <Text_Image text={text} heading={title} image={image} id={id} />;
    else if (type === 'video' && video) contentLayout = <Video data={video} />;

    return (
        <Protected>
            <Layout>
                <Navbar title={`${title}`} menuData={menuData} />
                {contentLayout}
                {!hasPageSteps && <ControlBar nextPage={nextPage} prevPage={prevPage} />}
            </Layout>
        </Protected>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    if (session.jwt) setAuthToken(session.jwt as string);

    const { pageId } = context.params as { chapter: string; subchapter: string; pageId: string };
    const resp = await getPage(pageId);
    if (!resp || resp.error || !resp.data) {
        console.log('THERE IS AN ERROR');
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
                resp.error
                    ? `${resp.error.name}: ${resp.error.message}`
                    : 'Failed to fetch page data. Received undefined'
            }`
        );
    }

    const { title, type, content } = resp.data.attributes;

    return {
        props: {
            title,
            type,
            content,
            isStepPage: content.length > 1,
        },
    };
};
