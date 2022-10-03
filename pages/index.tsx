
import ThreeColumns from '../components/layout/ThreeColumns';
import fs from 'fs';
const Home = ({ md }: { md: string }) => {

    return (

        <ThreeColumns md={md} />

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
