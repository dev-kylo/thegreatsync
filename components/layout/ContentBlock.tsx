import ReactMarkdown from 'react-markdown'
import ContainsCodeSnippet from '../ui/ContainsCodeSnippet';

const ContentBlock = ({ md }: { md: string }) => {
    return (
        <article className="line-numbers prose dark:prose-invert prose-lg prose-headings:text-secondary_lightblue mx-auto">
            <ContainsCodeSnippet>
                <ReactMarkdown children={md} />
            </ContainsCodeSnippet>
        </article >
    )

};

export default ContentBlock;


// I REMOVED PADDING 4 for Code Snippet