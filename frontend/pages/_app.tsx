import type { AppProps } from 'next/app';
import '../styles/global.css';
import 'allotment/dist/style.css';
import '../styles/nprogress.css';
import Head from 'next/head';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import Router from 'next/router';
import NProgress from 'nprogress';
import Script from 'next/script';
import NavContextProvider from '../context/nav';
import StepContextProvider from '../context/steps';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

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
                <title>The Great Sync Learning Platform</title>
                <meta name="description" content="Learn JavaScript visually and memorably" />
                <link href="https://fonts.cdnfonts.com/css/utopia-std" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/poppins" rel="stylesheet" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <Script id="google-tag-manager" strategy="afterInteractive">
                {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-5LD8VXKM');
                `}
            </Script>
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
