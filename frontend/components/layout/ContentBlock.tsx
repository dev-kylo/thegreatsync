/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-children-prop */
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import style from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';

SyntaxHighlighter.registerLanguage('javascript', js);

const ContentBlock = ({ md, numbered = false, id }: { md: string; id: number; numbered?: boolean }) => {
    return (
        <article
            id={`md-block:${id} `}
            className="prose dark:prose-invert prose-lg prose-headings:text-secondary_lightblue mx-auto prose-pre:p-0 pt-2 prose-code:text-[#7fdbca] prose-code:after:hidden prose-code:before:hidden pb-16"
        >
            <ReactMarkdown
                children={md}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        return !inline ? (
                            <SyntaxHighlighter
                                {...props}
                                children={String(children).replace(/\n$/, '')}
                                style={style}
                                language="javascript"
                                PreTag="div"
                            />
                        ) : (
                            <code {...props} className={`${className} text-lg bg-code_bg`}>
                                {children}
                            </code>
                        );
                    },
                }}
            />
        </article>
    );
};

export default ContentBlock;
