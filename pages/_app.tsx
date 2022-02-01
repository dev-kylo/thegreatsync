
import type { AppProps } from 'next/app'
import GlobalStyles from '../styles/GlobalStyles'



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <GlobalStyles />
      <Component {...pageProps} />
    </div>

  )
}

export default MyApp
