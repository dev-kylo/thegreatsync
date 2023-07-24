/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-children-prop */
import { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import style from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';
import Divider from '../ui/Divider';
import ExternalLink from '../ui/ExternalLink';
import type { ResourceLink } from '../../types';

SyntaxHighlighter.registerLanguage('javascript', js);

const ContentBlock = ({
    md,
    id,
    heading,
    links,
}: {
    md: string;
    id: number;
    heading?: string;
    links?: ResourceLink[];
}) => {
    const contentContaier = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const elem = document.querySelector(`#md-block-${id}`);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }, [id]);

    return (
        <div ref={contentContaier}>
            <article
                id={`md-block-${id} `}
                className="prose prose-strong:text-offwhite prose-li:text-offwhite prose-span:text-offwhite   prose-em:text-offwhite prose-p:text-offwhite prose-xl prose-headings:text-secondary_lightblue mx-auto prose-pre:p-0 pt-2 prose-code:text-[#7fdbca] prose-code:font-mono prose-code:after:hidden prose-code:before:hidden pb-16"
            >
                {heading && <h2>{heading}</h2>}
                <ReactMarkdown
                    children={md}
                    components={{
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        code({ node, inline, className, children, ...props }) {
                            return !inline ? (
                                <SyntaxHighlighter
                                    {...props}
                                    children={String(children).replace(/\n$/, '')}
                                    style={style}
                                    language="javascript"
                                    PreTag="span"
                                />
                            ) : (
                                <span style={{ display: 'inline' }}>
                                    <SyntaxHighlighter
                                        {...props}
                                        children={String(children).replace(/\n$/, '')}
                                        style={style}
                                        language="javascript"
                                        PreTag="span"
                                        customStyle={{ display: 'inline' }}
                                    />
                                </span>
                            );
                        },
                    }}
                />
                {links && links.length > 0 && (
                    <div>
                        <Divider />
                        <h3 className="text-center pt-12 py-2"> Links & Resources</h3>
                        <ul className="pl-4 ml-0 max-w-xl">
                            {links.map((link) => (
                                <li className="flex items-center justify-between py-2  pr-5 text-sm leading-6 h-[100vh]">
                                    <ExternalLink
                                        type={link.type}
                                        link={link.external_url || link.file.data?.attributes.url || ''}
                                        title={link.title}
                                        subtitle={link.subtitle}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </article>
        </div>
    );
};

export default ContentBlock;
