
import Text_Image_Code from '../components/layout/screens/Text_Image_Code';
import fs from 'fs';
import PageContainer from '../components/layout/PageContainer';
import ContentBlock from '../components/layout/ContentBlock';
import FlexGrid from '../components/layout/FlexGrid';
import Experimental from '../components/layout/Experimental';
import ProgressIcon from '../components/ui/ProgressIcon';
import Text_Image from '../components/layout/screens/Text_Image';
import TextCode_Image from '../components/layout/screens/TextCode_Image';
import NextPrev from '../containers/ControlBar';
import Video from '../components/layout/screens/Video';
import Navbar from '../components/ui/Navbar';
import ControlBar from '../containers/ControlBar';
import { useSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';


const Home = ({ md, blogMd }: { md: string, blogMd: string }) => {


    const topicType = '3col';
    const title = 'Statements and declarations';

    const { data: session, status } = useSession();

    if (!session)

        return (
            <>
                <Navbar title={title} />
                {/* <Video /> */}
                {/* <Text_Image_Code code={md} text={blogMd} /> */}
                {/* <TextCode_Image md={md} /> */}
                <Text_Image md={md} />
                {/* <ControlBar /> */}
            </>
        );
}

export default Home

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);
    // Check if session exists or not, if not, redirect
    if (session == null) {
        return {
            redirect: {
                destination: '/signin',
                permanent: true,
            },
        };
    }

    const md = fs.readFileSync(`mocks/MockCode.md`, 'utf-8');
    const blogMd = fs.readFileSync(`mocks/MockBlog.md`, 'utf-8');
    return {
        props: {
            md,
            blogMd,
        },
    };
}
