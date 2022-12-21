import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import Protected from '../../../../../containers/Protected';
import Layout from '../../../../../components/layout';
import Navbar from '../../../../../components/ui/Navbar';
import { useContext } from 'react';
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

type CoursePageProps = {
    title: string | number;
    type: PageType,
    content: PageContent[]
    error?: boolean;
}



export default function CoursePage({ title, type, content, error }: CoursePageProps) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { menuData, nextPage, prevPage } = useContext(NavContext);

    console.log({ title, type, content })

    const { id, code, text, image, video } = content[0];
    let contentLayout = <></>

    const hasPageSteps = content.length > 1;

    if (error) contentLayout = <p className="text-md text-red-700"> This page does not exist</p>

    if (hasPageSteps)
        contentLayout = <PageStepsController pageContent={content} type={type} />

    else if (type === 'text')
        contentLayout = <Text text={text} id={id} />

    else if (type === 'text_image_code')
        contentLayout = <Text_Image_Code code={code!} text={text} image={image} id={id} />

    else if (type === 'text_image')
        contentLayout = <Text_Image text={text} image={image} id={id} />

    else if (type === 'video' && video)
        contentLayout = <Video data={video!} />

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
    const session = await getSession(context);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);
    const { chapter, subchapter, pageId } = context.params as { chapter: string, subchapter: string, pageId: string };
    const resp = (await getPage(pageId, session))?.data;

    if (!resp) return {
        props: {
            error: true
        }
    }

    const { title, type, content } = resp.attributes;

    return {
        props: {
            title,
            type,
            content,
        }
    };
};
