import type { AppProps } from 'next/app'
import '../styles/global.css';
import '../styles/duotone_prism.css';
import '../styles/line_numbers_prism.css';
import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/ui/Navbar';
import NextPrev from '../components/ui/NextPrev';

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
                <Navbar />
                <Component {...pageProps} />
                <NextPrev />
            </Layout>
        </>

    )
}

export default MyApp
