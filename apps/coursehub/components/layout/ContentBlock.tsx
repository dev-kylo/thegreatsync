/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-children-prop */
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import style from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';
import React, { ClassAttributes, HTMLAttributes, useEffect, useState } from 'react';
import Divider from '../ui/Divider';
import ExternalLink from '../ui/ExternalLink';
import type { ResourceLink } from '../../types';

SyntaxHighlighter.registerLanguage('javascript', js);

type CodeProps = ClassAttributes<HTMLElement> & HTMLAttributes<HTMLElement> & { [key: string]: any };

const CodeComponent = ({ inline, children, ...props }: CodeProps) => {
    return !inline ? (
        <SyntaxHighlighter
            {...props}
            children={String(children).replace(/\n$/, '')}
            style={style}
            language="javascript"
            PreTag="span"
            className="scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll overflow-x-scroll"
            customStyle={{ fontSize: '0.9rem', height: '100%', paddingBottom: `3rem` }}
            ref={props.ref as React.LegacyRef<SyntaxHighlighter>}
        />
    ) : (
        <span style={{ display: 'inline' }}>
            <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={style}
                language="javascript"
                PreTag="span"
                customStyle={{ display: 'inline', padding: ' 0.2rem 0.5rem' }}
                ref={props.ref as React.LegacyRef<SyntaxHighlighter>}
            />
        </span>
    );
};

const ContentBlock = ({
    md,
    id,
    heading,
    links,
    textType,
    blocks,
}: {
    md?: string;
    id: number;
    heading?: string;
    blocks?: React.ReactNode[];
    textType?: 'page' | 'block';
    links?: ResourceLink[];
}) => {
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        setRendered(true);
    }, []);

    return (
        <article
            id={`md-${textType ? 'carticle' : 'code'}-block`}
            key={`md-${textType ? 'article' : 'code'}-block:${id}`}
            className={`prose ${
                !textType
                    ? 'h-full max-w-full prose-lg'
                    : textType === 'page'
                    ? 'pb-16 prose-h1:text-5xl prose-h2:pt-12 prose-xl'
                    : 'prose-lg pb-16 prose-h1:text-[2.2rem] max-w-full'
            } prose-h2:text-3xl prose-h3:text-2xl prose-strong:text-[#c792ea] prose-strong:font-extrabold prose-li:text-offwhite prose-span:text-offwhite  prose-a:text-green-500 prose-em:text-offwhite prose-p:text-offwhite prose-headings:text-secondary_lightblue mx-auto prose-pre:p-0 pt-2 prose-code:text-[#7fdbca] prose-code:font-mono prose-code:after:hidden prose-code:before:hidden`}
        >
            {heading && <h1>{heading}</h1>}

            {blocks}

            {md && rendered && (
                <ReactMarkdown
                    children={md}
                    components={{
                        code: CodeComponent,
                    }}
                />
            )}
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
