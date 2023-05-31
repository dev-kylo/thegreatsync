import Layout from '../components/layout';
import Spinner from '../components/ui/Spinner';

const LoadingQuote = () => (
    <Layout>
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <div className="mb-8">
                <span className="text-secondary_lightblue m-0 p-0 text-lg block">
                    Knowledge is limited. Imagination encircles the world.
                </span>
                <span className=" m-0 mt-1 p-0 text-xs block uppercase text-center text-green-400 font-bold">
                    Albert Einstein
                </span>
            </div>
            <Spinner />
        </div>
    </Layout>
);

export default LoadingQuote;
