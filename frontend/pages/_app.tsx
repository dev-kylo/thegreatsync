// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { AppProps } from 'next/app'
import '../styles/global.css';
import '../styles/duotone_prism.css';
import '../styles/line_numbers_prism.css';
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <Head>
                <title>The Great Sync Course</title>
                <link href="http://fonts.cdnfonts.com/css/utopia-std" rel="stylesheet" />
                <link href="http://fonts.cdnfonts.com/css/poppins" rel="stylesheet" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <main>
                <Component {...pageProps} />
            </main>
        </SessionProvider>

    )
}

export default MyApp
