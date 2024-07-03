import ErrorScreen from '../components/ui/ErrorMessage';

function Error({ statusCode }: { statusCode: string }) {
    console.log(`ERROR: ${statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}`);
    return <ErrorScreen statusCode={statusCode} />;
}

Error.getInitialProps = ({ res, err }: { err: { statusCode: number }; res?: { statusCode: number } }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
