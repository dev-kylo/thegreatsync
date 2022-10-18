
import Text_Image_Code from '../components/layout/screens/Text_Image_Code';
import fs from 'fs';
import PageContainer from '../components/layout/PageContainer';
import ContentBlock from '../components/layout/ContentBlock';
import FlexGrid from '../components/layout/FlexGrid';
import Experimental from '../components/layout/Experimental';
import ProgressIcon from '../components/ui/ProgressIcon';
import Text_Image from '../components/layout/screens/Text_Image';
import TextCode_Image from '../components/layout/screens/TextCode_Image';
const Home = ({ md, blogMd }: { md: string, blogMd: string }) => {

    return (

        // <PageContainer>
        //     <ContentBlock md={md} />
        // </PageContainer>
        <Text_Image_Code code={md} text={blogMd} />
        // <TextCode_Image md={md} />
        // <Text_Image md={md} />
        // <ProgressIcon amount={60} />
        // <FlexGrid md={md} />
        // <Experimental md={md} />
    );
}

export default Home

export async function getServerSideProps() {

    const md = fs.readFileSync(`mocks/MockCode.md`, 'utf-8');
    const blogMd = fs.readFileSync(`mocks/MockBlog.md`, 'utf-8');
    return {
        props: {
            md,
            blogMd,
        },
    };
}
