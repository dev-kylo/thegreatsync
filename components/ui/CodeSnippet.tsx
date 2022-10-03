import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import Prism from "prismjs"
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

const CodeSnippet = ({ md }: { md: string }) => {
    useEffect(() => {
        Prism.highlightAll()
    }, []);


    const markdownContent = md;
    return (
        <div className="line-numbers">
            <ReactMarkdown children={markdownContent} />
        </div>
    )

};

export default CodeSnippet;
