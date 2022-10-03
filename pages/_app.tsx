import type { AppProps } from 'next/app'
import '../styles/global.css';
import '../styles/duotone_prism.css';
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>The Great Sync Course</title>
                <link href="http://fonts.cdnfonts.com/css/utopia-std" rel="stylesheet" />
                <link href="http://fonts.cdnfonts.com/css/poppins" rel="stylesheet" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
            </Head>
            <main style={{ background: 'linear-gradient(38.92deg, #03143F 10.77%, #008579 115.98%)' }}>
                <Component {...pageProps} />
            </main>
        </>

    )
}

export default MyApp
