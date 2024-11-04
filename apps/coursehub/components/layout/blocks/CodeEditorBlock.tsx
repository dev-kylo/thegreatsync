/* eslint-disable react/button-has-type */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
    SandpackProvider,
    SandpackConsole,
    useSandpackNavigation,
    SandpackCodeEditor,
    SandpackLayout,
    useSandpack,
} from '@codesandbox/sandpack-react';

import { nightOwl } from '@codesandbox/sandpack-themes';
import { CodeFile } from '../../../types';

function CustomRefreshButton() {
    const { refresh } = useSandpackNavigation();
    const { sandpack } = useSandpack();

    const handleRefresh = () => {
        refresh();
    };

    if (sandpack.status !== 'running') return null;

    return (
        <button className="bg-[var(--primary_green)] " aria-label="Refresh page" onClick={handleRefresh}>
            Run again
        </button>
    );
}

type CodeEditorBlockProps = {
    showLineNumbers?: boolean;
    files: CodeFile[];
};

const CodeEditorBlock = ({ showLineNumbers, files }: CodeEditorBlockProps) => {
    const codeFiles = files.reduce((final, curr) => {
        return {
            ...final,
            [`${curr.fileName}${curr.fileExtension}`]: curr.code,
        };
    }, {});

    return (
        <div className="w-[100%] m-auto">
            <SandpackProvider
                options={{
                    autorun: false,
                }}
                template="vanilla"
                files={codeFiles}
                theme={nightOwl}
            >
                <SandpackLayout>
                    <SandpackCodeEditor showLineNumbers={showLineNumbers} />
                    <SandpackConsole
                        showRestartButton
                        showResetConsoleButton
                        standalone
                        actionsChildren={<CustomRefreshButton />}
                    />
                </SandpackLayout>
            </SandpackProvider>
        </div>
    );
};

export default React.memo(CodeEditorBlock);
