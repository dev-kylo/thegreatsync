import type { AppProps } from 'next/app';
import '../styles/global.css';
import 'allotment/dist/style.css';
import Head from 'next/head';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import NavContextProvider from '../context/nav';
import StepContextProvider from '../context/steps';

function MyApp({
    Component,
    pageProps,
}: AppProps<{
    session: Session;
    isStepPage: boolean;
    pageType?: 'text' | 'text-image-code' | 'text-image' | 'video' | 'standalone';
}>) {
    const { isStepPage } = pageProps;

    return (
        <SessionProvider session={pageProps.session}>
            <Head>
                <title>The Great Sync Course</title>
                <link href="https://fonts.cdnfonts.com/css/utopia-std" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/poppins" rel="stylesheet" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <main>
                <NavContextProvider>
                    {isStepPage ? (
                        <StepContextProvider>
                            <Component {...pageProps} />
                        </StepContextProvider>
                    ) : (
                        <Component {...pageProps} />
                    )}
                </NavContextProvider>
            </main>
        </SessionProvider>
    );
}

export default MyApp;
