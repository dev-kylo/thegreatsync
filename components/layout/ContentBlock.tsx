import ReactMarkdown from 'react-markdown'
import ContainsCodeSnippet from '../ui/ContainsCodeSnippet';

const ContentBlock = ({ md }: { md: string }) => {
    return (
        <article className="line-numbers prose p-4 pt-0 dark:prose-invert prose-lg prose-headings:text-secondary_lightblue">
            <ContainsCodeSnippet>

                <ReactMarkdown children={md} />

            </ContainsCodeSnippet>
        </article >
    )

};

export default ContentBlock;
