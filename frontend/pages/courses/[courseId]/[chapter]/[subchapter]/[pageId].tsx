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
import { CurrentLocation, PageContent, PageType, ResourceLink } from '../../../../../types';
import Text_Image_Code from '../../../../../components/layout/screens/Text_Image_Code';
import Text_Image from '../../../../../components/layout/screens/Text_Image';
import Video from '../../../../../components/layout/screens/Video';
import ControlBar from '../../../../../containers/ControlBar';
import PageStepsController from '../../../../../containers/PageStepsController';
import Text from '../../../../../components/layout/screens/Text';
import { authOptions } from '../../../../api/auth/[...nextauth]';
import { setAuthToken } from '../../../../../libs/axios';
import Text_Code from '../../../../../components/layout/screens/Text_Code';
import type { ErrorResponse } from '../../../../../types';
import { createErrorString } from '../../../../../libs/errorHandler';

type CoursePageProps = {
    title?: string;
    type: PageType;
    content: PageContent[];
    links: ResourceLink[];
    current: CurrentLocation;
};
export default function CoursePage({ title, type, content, links, current }: CoursePageProps) {
    const { menuData, chapterName, subChapterName, loadingPage, nextPage, prevPage, showNext, showPrev } =
        useContext(NavContext);

    const { data: session } = useSession();
    setAuthToken((session?.jwt as string) || '');

    const { id, code, text, image, video, image_alt } = content[0];
    let contentLayout = null;

    const hasPageSteps = content && content.length > 1;

    if (hasPageSteps)
        contentLayout = (
            <PageStepsController
                loadingPage={loadingPage}
                heading={title}
                pageContent={content}
                type={type}
                links={links}
                pageId={`${current.pageId}`}
            />
        );
    else if (type === 'text') contentLayout = <Text text={text} heading={title} id={id} links={links} />;
    else if (type === 'text_image_code')
        contentLayout = (
            <Text_Image_Code
                code={code!}
                text={text}
                heading={title}
                image={image}
                imageAlt={image_alt}
                id={id}
                links={links}
            />
        );
    else if (type === 'text_image')
        contentLayout = (
            <Text_Image imageAlt={image_alt} text={text} heading={title} image={image} id={id} links={links} />
        );
    else if (type === 'text_code')
        contentLayout = <Text_Code text={text} code={code!} heading={title} id={id} links={links} />;
    else if (type === 'video' && video) contentLayout = <Video data={video} resources={links} />;

    return (
        <Protected>
            <Layout>
                <Navbar
                    current={current}
                    chapterTitle={chapterName || ''}
                    subChapterTitle={subChapterName || ''}
                    menuData={menuData}
                />
                {contentLayout}
                {!hasPageSteps && (
                    <ControlBar
                        loadingPage={loadingPage}
                        showNext={showNext}
                        showPrev={showPrev}
                        nextPage={nextPage}
                        prevPage={prevPage}
                    />
                )}
            </Layout>
        </Protected>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    if (session.jwt) setAuthToken(session.jwt as string);

    const { pageId, subchapter, chapter } = context.params as { chapter: string; subchapter: string; pageId: string };
    let resp;
    try {
        resp = await getPage(pageId);
    } catch (e) {
        console.log(e);
    }
    if (!resp || resp.error || !resp?.data) {
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

    const { title, type, content, links } = resp.data.attributes;

    return {
        props: {
            title,
            type,
            links,
            content,
            current: { pageId, chapterId: chapter, subchapterId: subchapter },
            isStepPage: content.length > 1,
        },
    };
};
