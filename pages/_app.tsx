
import type { AppProps } from 'next/app'
import stylesBase from '../styles/stylesBase'
import "tailwindcss/tailwind.css";
import { GlobalStyles } from 'twin.macro';
import { Global } from "@emotion/react";




function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <GlobalStyles />
      <Global styles={stylesBase} />
      <Component {...pageProps} />
    </div>

  )
}

export default MyApp
