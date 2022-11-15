
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
import { mapMenuChapters, serverRedirectObject } from '../libs/helpers';
import { GetServerSideProps } from 'next';
import Layout from '../components/layout';
import { getChapters, getText } from '../services/queries';
import axios from 'axios';

const Home = ({ md, blogMd, menu }: { md: string, blogMd: string, menu: any }) => {

    const title = 'Statements and declarations';
    console.log('--------ANNND THE DATA IN PROGRAM IS ---------', menu);
    const menuData = mapMenuChapters(menu);

    return (
        <>
            <Protected>
                <Layout>
                    <Navbar title={title} menuData={menuData} />
                    {/* <Video /> */}
                    {/* <Text_Image_Code code={md} text={blogMd} /> */}
                    {/* <TextCode_Image md={md} /> */}
                    {/* <Text_Image md={text.data.attributes.text} /> */}
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
    let menu, error;
    try {
        menu = await getChapters(axios, session);
    } catch (e) {
        console.log(e);
        error = true;
    }

    return {
        props: {
            md,
            blogMd,
            menu,
        },
    };
}
