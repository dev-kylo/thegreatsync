import ReactMarkdown from 'react-markdown'
import ContainsCodeSnippet from '../ui/ContainsCodeSnippet';

const ContentBlock = ({ md, numbered = false }: { md: string, numbered?: boolean }) => {
    return (
        <article className="prose dark:prose-invert prose-lg prose-headings:text-secondary_lightblue mx-auto">
            <ContainsCodeSnippet numbered={numbered}>
                <ReactMarkdown children={md} />
            </ContainsCodeSnippet>
        </article >
    )

};

export default ContentBlock;


// I REMOVED PADDING 4 for Code Snippet