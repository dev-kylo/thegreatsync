import type { AppProps } from 'next/app'
import '../styles/global.css';
import '../styles/duotone_prism.css';
import '../styles/line_numbers_prism.css';
import Head from 'next/head'
import NextPrev from '../containers/ControlBar';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>The Great Sync Course</title>
                <link href="http://fonts.cdnfonts.com/css/utopia-std" rel="stylesheet" />
                <link href="http://fonts.cdnfonts.com/css/poppins" rel="stylesheet" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>

    )
}

export default MyApp
