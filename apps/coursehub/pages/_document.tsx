import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
    return (
        <Html>
            <Head>
                <meta name="description" content="Learn JavaScript visually and memorably" />
                <link href="https://fonts.cdnfonts.com/css/utopia-std" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/poppins" rel="stylesheet" />
                <link href="https://fonts.cdnfonts.com/css/Inconsolata" rel="stylesheet" />
                <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#031440" />
                <meta name="msapplication-TileColor" content="#2b5797" />
                <meta name="theme-color" content="#031440" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@200..900&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap"
                    rel="stylesheet"
                />
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-5LD8VXKM');
                `}
                </Script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
