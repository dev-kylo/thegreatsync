
import ThreeColumns from '../components/layout/ThreeColumns';
import fs from 'fs';
import PageContainer from '../components/layout/PageContainer';
import ContentBlock from '../components/layout/ContentBlock';
import FlexGrid from '../components/layout/FlexGrid';
import Experimental from '../components/layout/Experimental';
const Home = ({ md }: { md: string }) => {

    return (

        // <PageContainer>
        //     <ContentBlock md={md} />
        // </PageContainer>
        <ThreeColumns md={md} />
        // <FlexGrid md={md} />
        // <Experimental md={md} />
    );
}

export default Home

export async function getServerSideProps() {

    const md = fs.readFileSync(`mocks/MockCode.md`, 'utf-8');

    return {
        props: {
            md
        },
    };
}
