import { useEffect } from 'react';
// import Prism from "prismjs"
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js'


const ContainsCodeSnippet = ({ children, numbered = false, id }: { children: React.ReactNode, numbered?: boolean, id: number }) => {



    return (
        <div id={`codeblock_${id}`} className={`${numbered ? "line-numbers left-[0!important]" : ""} prose-code:text-[#7fdbca] before:prose-code:content-[''] after:prose-code:content-[''] prose-code:bg-[#011627] prose-code:py-1 prose-code:text-lg`}>
            {children}
        </div>

    )

};

export default ContainsCodeSnippet;
