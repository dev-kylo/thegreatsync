/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-children-prop */
import React, { ClassAttributes, HTMLAttributes, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import style from 'react-syntax-highlighter/dist/cjs/styles/hljs/night-owl';

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
            customStyle={{ height: '100%' }}
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

const MarkdownBlock = ({ md }: { md: string }) => {
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        setRendered(true);
    }, []);

    return !rendered ? null : (
        <ReactMarkdown
            children={md}
            components={{
                code: CodeComponent,
            }}
        />
    );
};

export default MarkdownBlock;
