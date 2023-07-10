import React, { useState } from 'react';

const CopyButton = ({ textcode }: { textcode: string }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(textcode.replace(/```(js|jsx)\s*([\s\S]+?)\s*```/g, '$2'));
        setCopied(true);

        // Reset the "copied" state after 3 seconds
        const timer = setTimeout(() => {
            setCopied(false);
            clearTimeout(timer);
        }, 3000);
    };

    return (
        <div className="absolute bottom-8 right-4 sm:bottom-4">
            <button
                className="rounded-[4px] border border-l-stone-100 text-white px-5 py-1.5 transition ease-in-out hover:bg-[#008579]"
                type="button"
                onClick={copyToClipboard}
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
};

export default CopyButton;
