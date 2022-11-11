
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
import { redirect } from 'next/dist/server/api-utils';
import Protected from '../containers/Protected';
import { useRouter } from "next/router";
import { serverRedirectObject } from '../libs/helpers';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout';

const Home = ({ md, blogMd }: { md: string, blogMd: string }) => {


    const topicType = '3col';
    const title = 'Statements and declarations';



    return (
        <>
            <Protected>
                <Layout>
                    <Navbar title={title} />
                    {/* <Video /> */}
                    {/* <Text_Image_Code code={md} text={blogMd} /> */}
                    {/* <TextCode_Image md={md} /> */}
                    <Text_Image md={md} />
                </Layout>
            </Protected>
            {/* <ControlBar /> */}
        </>
    );
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (!session) return serverRedirectObject(`/signin?redirect=${context.resolvedUrl}`);


    const md = fs.readFileSync(`mocks/MockCode.md`, 'utf-8');
    const blogMd = fs.readFileSync(`mocks/MockBlog.md`, 'utf-8');
    return {
        props: {
            md,
            blogMd,
        },
    };
}
