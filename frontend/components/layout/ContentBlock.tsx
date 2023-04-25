/* eslint-disable react/no-children-prop */
import ReactMarkdown from 'react-markdown'
import ContainsCodeSnippet from '../ui/ContainsCodeSnippet';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const ContentBlock = ({ md, numbered = false, id }: { md: string, id: number, numbered?: boolean }) => {

    return (
        <article id={`md-block:${id} `} className="prose dark:prose-invert prose-lg prose-headings:text-secondary_lightblue mx-auto">
            
            <ContainsCodeSnippet numbered={numbered} id={id}>
            {/* <SyntaxHighlighter language="javascript" style={docco}>
                <ReactMarkdown children={md} />
                
            </SyntaxHighlighter> */}

            <ReactMarkdown
                children={md}
                components={{
                code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                    <SyntaxHighlighter
                        {...props}
                        children={String(children).replace(/\n$/, '')}
                        style={docco}
                        language={match[1]}
                        PreTag="div"
                    />
                    ) : (
                    <code {...props} className={className}>
                        {children}
                    </code>
                    )
                }
    }}
  />

            </ContainsCodeSnippet>
        </article >
    )

};

export default ContentBlock;


// I REMOVED PADDING 4 for Code Snippet