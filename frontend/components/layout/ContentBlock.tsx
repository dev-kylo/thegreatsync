/* eslint-disable react/no-children-prop */
import ReactMarkdown from 'react-markdown'
import ContainsCodeSnippet from '../ui/ContainsCodeSnippet';

const ContentBlock = ({ md, numbered = false, id }: { md: string, id: number, numbered?: boolean }) => {
    return (
        <article id={`md-block:${id} `} className="prose dark:prose-invert prose-lg prose-headings:text-secondary_lightblue mx-auto">
            <ContainsCodeSnippet numbered={numbered} id={id}>
                <ReactMarkdown children={md} />

            </ContainsCodeSnippet>
        </article >
    )

};

export default ContentBlock;


// I REMOVED PADDING 4 for Code Snippet