import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import Prism from "prismjs"
// import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
// import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

const ContentBlock = ({ md }: { md: string }) => {
    useEffect(() => {
        Prism.highlightAll()
    }, []);


    const markdownContent = md;
    return (
        <article className="line-numbers prose p-4 dark:prose-invert ">
            <ReactMarkdown children={markdownContent} />
        </article>
    )

};

export default ContentBlock;
