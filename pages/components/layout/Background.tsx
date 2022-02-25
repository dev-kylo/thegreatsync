import styled from "@emotion/styled";
import tw from "twin.macro";

const Frame = styled.div`
  ${tw`
    h-screen
    bg-red-200
  `}
`

const NavBar = styled.div`
  ${tw`
    h-32 
    bg-black 
    p-6
  `}
`;


const Main = styled.main`
    background: linear-gradient(71.94deg, #03143F 11.49%, #008579 98.33%);
    ${tw`
        min-w-min 
        min-h-screen
  `}
`

const Background = () => {

    return (
        <Main>
            <p>Content will go here.</p>
        </Main>
    )
}

export default Background;