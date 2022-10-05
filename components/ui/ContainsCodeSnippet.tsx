import { useEffect } from 'react';
import Prism from "prismjs"
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

const ContainsCodeSnippet = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        Prism.highlightAll()
    }, []);

    return (
        <div className="linenumbers prose-code:text-[#7fdbca] before:prose-code:content-[''] after:prose-code:content-[''] prose-code:bg-[#011627] prose-code:px-2 prose-code:py-1 prose-code:text-lg">
            {children}
        </div>
    )

};

export default ContainsCodeSnippet;
