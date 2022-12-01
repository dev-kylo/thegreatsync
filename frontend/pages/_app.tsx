import type { AppProps } from 'next/app'
import '../styles/global.css';
import '../styles/duotone_prism.css';
import '../styles/line_numbers_prism.css';
import Head from 'next/head'
import { Session } from "next-auth";
import { SessionProvider } from 'next-auth/react';
import NavContextProvider from '../context/nav';


function MyApp({ Component, pageProps }: AppProps<{
    session: Session;
}>) {
    return (
        <SessionProvider session={pageProps!.session}>
            <Head>
                <title>The Great Sync Course</title>
                <link href="http://fonts.cdnfonts.com/css/utopia-std" rel="stylesheet" />
                <link href="http://fonts.cdnfonts.com/css/poppins" rel="stylesheet" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <main>
                <NavContextProvider>
                    <Component {...pageProps} />
                </NavContextProvider>
            </main>
        </SessionProvider>

    )
}


export default MyApp
