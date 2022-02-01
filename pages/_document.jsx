import Document, { Html, Head, NextScript, Main } from 'next/document';
import { extractCritical } from '@emotion/server'


export default class MyDocument extends Document {

    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        const critical = extractCritical(initialProps.html)
        initialProps.html = critical.html
        initialProps.styles = (
            <>
                {initialProps.styles}
                <style
                    data-emotion-css={critical.ids.join(' ')}
                    dangerouslySetInnerHTML={{ __html: critical.css }}
                />
            </>
        )

        return initialProps
    }



    render() {
        return (
            <Html lang="en">
                <Head>
                    <style
                        data-emotion-css={this.props.ids?.join(' ')}
                        dangerouslySetInnerHTML={{ __html: this.props.css }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

// export default class MyDocument extends Document {

//     static async getInitialProps(ctx: DocumentContext) {
//         const initialProps = await Document.getInitialProps(ctx)
//         const sheet = new ServerStyleSheet();
//         const page = ctx.renderPage((App) => (props) =>
//             sheet.collectStyles(<App {...props} />)
//         );
//         const styleTags = sheet.getStyleElement();
//         return { ...initialProps, ...page, styleTags };
//     }

//     render() {
//         return (
//             <Html lang="en">
//                 <Head />
//                 <body>
//                     <Main />
//                     <NextScript />
//                 </body>
//             </Html>
//         );
//     }
// }
