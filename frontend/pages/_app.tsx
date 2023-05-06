import type { AppProps } from 'next/app';
import '../styles/global.css';
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
}>) {
    return (
        <SessionProvider session={pageProps.session}>
            <Head>
                <title>The Great Sync Course</title>
                <link href="http://fonts.cdnfonts.com/css/utopia-std" rel="stylesheet" />
                <link href="http://fonts.cdnfonts.com/css/poppins" rel="stylesheet" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <main>
                <NavContextProvider>
                    {pageProps.isStepPage ? (
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
