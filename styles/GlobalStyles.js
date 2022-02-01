import React from 'react'
import { createGlobalStyle } from 'styled-components'
import tw, { theme, GlobalStyles as BaseStyles} from 'twin.macro'

export const CustomStyles = createGlobalStyle`
  body {
    -webkit-tap-highlight-color: ${(props) => theme`colors.purple.500`};
    ${tw`antialiased`}
  }
  html,
    body {
      padding: 0;
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    * {
      box-sizing: border-box;
    }

`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);


export default GlobalStyles;

