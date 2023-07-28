/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-children-prop */
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
    return (
        <article
            id={`md-block:${id} `}
            key={`md-article-block:${id}`}
            className="prose prose-xl h-full prose-h2:text-3xl prose-h1:text-4xl prose-h3:text-2xl  prose-strong:text-[#c792ea] prose-strong:font-extrabold prose-li:text-offwhite prose-span:text-offwhite  prose-a:text-green-500 prose-em:text-offwhite prose-p:text-offwhite prose-headings:text-secondary_lightblue mx-auto prose-pre:p-0 pt-2 prose-code:text-[#7fdbca] prose-code:font-mono prose-code:after:hidden prose-code:before:hidden pb-16"
        >
            {heading && <h1>{heading}</h1>}

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
                                PreTag="div"
                                className="scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll overflow-x-scroll"
                                customStyle={{ height: '100%' }}
                            />
                        ) : (
                            <div style={{ display: 'inline' }}>
                                <SyntaxHighlighter
                                    {...props}
                                    children={String(children).replace(/\n$/, '')}
                                    style={style}
                                    language="javascript"
                                    PreTag="div"
                                    customStyle={{ display: 'inline', padding: ' 0.2rem 0.5rem' }}
                                />
                            </div>
                        );
                    },
                }}
            />
            {links && links.length > 0 && (
                <div>
                    <Divider />
                    <h3 className="text-center pt-12 py-2"> Links & Resources</h3>
                    <ul className="pl-4 max-w-md m-auto">
                        {links.map((link) => (
                            <li
                                className="flex items-center justify-between py-2  pr-5 text-sm leading-6"
                                key={link.id}
                            >
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
    );
};

export default ContentBlock;
