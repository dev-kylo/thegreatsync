import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Protected from '../../../../../containers/Protected';
import Layout from '../../../../../components/layout';
import Navbar from '../../../../../components/ui/Navbar';
import { useContext } from 'react';
import { NavContext } from '../../../../../context/nav';
import { getPage } from '../../../../../services/queries';

type CoursePageProps = {
    title: string | number;
}


export default function CoursePage({ title }: CoursePageProps) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const { menuData } = useContext(NavContext);

    getPage();

    return (
        <Protected>
            <Layout>
                <Navbar title={`${title}`} menuData={menuData} />
                {/* <Video /> */}
                {/* <Text_Image_Code code={md} text={blogMd} /> */}
                {/* <TextCode_Image md={md} /> */}
                {/* <Text_Image md={text.data.attributes.text} /> */}
            </Layout>
        </Protected>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { chapter, subchapter, pageId } = context.params as { chapter: string, subchapter: string, pageId: string };


    return {
        props: { title: pageId }
    };
};
