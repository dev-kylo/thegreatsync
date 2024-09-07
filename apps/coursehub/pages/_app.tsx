import type { AppProps } from 'next/app';
import '../styles/global.css';
import 'allotment/dist/style.css';
import '../styles/nprogress.css';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import Router from 'next/router';
import NProgress from 'nprogress';
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
