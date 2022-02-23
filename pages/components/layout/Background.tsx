import styled from "@emotion/styled";
import tw from "twin.macro";



const Main = styled.main`
    background: linear-gradient(71.94deg, #03143F 11.49%, #008579 98.33%);
`

const Background = () => {

    return (
        <Main tw="min-w-min min-h-screen">
            <p>Content will go here.</p>
        </Main>
    )
}

export default Background;