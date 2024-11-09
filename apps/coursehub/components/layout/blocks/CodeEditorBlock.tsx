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
import MarkdownBlock from './MarkdownBlock';

function CustomRefreshButton() {
    const { refresh } = useSandpackNavigation();
    const { sandpack } = useSandpack();

    const handleRefresh = () => {
        refresh();
    };

    if (sandpack.status !== 'running') return null;

    return (
        <button
            className="bg-[white] text-black py-1 px-3 z-[10] rounded-full"
            aria-label="Refresh page"
            onClick={handleRefresh}
        >
            Run again
        </button>
    );
}
const ShowAnswerButton = ({
    clicked,
    showAnswer,
    customBtnText,
}: {
    clicked: () => void;
    showAnswer: boolean;
    customBtnText?: string;
}) => (
    <button
        className="bg-[white] text-sm text-black py-0.5 px-3 mt-2 z-[10] rounded-full"
        aria-label="Show Answer"
        onClick={clicked}
    >
        {!showAnswer ? customBtnText || 'Show Answer' : 'Show Output'}
    </button>
);

const Answer = ({ md }: { md: string }) => (
    <>
        <div className="absolute top-0 right-0 z-[10] w-full md:w-1/2 h-full bg-[#011627] text-sm p-4 pt-0 overflow-hidden scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll overflow-x-scroll  ">
            <div className="scrollbar-thin scrollbar-thumb-primary_green overflow-y-scroll ">
                <MarkdownBlock md={md} />
            </div>
        </div>
        <div className="absolute right-0 bottom-0 z-[20] h-8 w-full md:w-1/2 bg-gradient-to-b from-transparent to-[#011627de]" />
    </>
);

type CodeEditorBlockProps = {
    showLineNumbers?: boolean;
    files: CodeFile[];
    explanation?: string;
    explanationType?: string;
};

const CodeEditorBlock = ({ showLineNumbers, files, explanation, explanationType = 'answer' }: CodeEditorBlockProps) => {
    const [showAnswer, setShowAnswer] = React.useState(false);

    const codeFiles = files.reduce((final, curr) => {
        return {
            ...final,
            [`${curr.fileName}${curr.fileExtension}`]: curr.code,
        };
    }, {});

    return (
        <>
            <div className="w-[100%] m-auto relative">
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
                            style={{ position: 'relative' }}
                        />
                    </SandpackLayout>
                </SandpackProvider>
                {showAnswer && explanation && <Answer md={explanation} />}
            </div>
            {explanation && (
                <div className="flex justify-center items-center">
                    <ShowAnswerButton
                        customBtnText={explanationType === 'answer' ? 'Show Answer' : 'Apply Model'}
                        showAnswer={showAnswer}
                        clicked={() => setShowAnswer(!showAnswer)}
                    />
                </div>
            )}
        </>
    );
};

export default React.memo(CodeEditorBlock);
