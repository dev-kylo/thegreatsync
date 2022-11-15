import { GetServerSideProps } from 'next';
import Link from 'next/link.js';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';


export default function Subreddit({ chapter, subchapter, pageId }: { chapter: string, subchapter: string, pageId: string }) {
    const router = useRouter();
    const { data: session, status } = useSession();

    console.log('---------EXTRACTED PAARAAANS-------');
    console.log({ chapter, subchapter, pageId })


    return (
        <>
            <h2> Whatever</h2>
            <p>Chapter: {chapter}</p>
            <p>Subchapter: {subchapter}</p>
            <p>Page: {pageId}</p>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { chapter, subchapter, pageId } = context.params as { chapter: string, subchapter: string, pageId: string };

    return {
        props: { chapter, subchapter, pageId }
    };
};
