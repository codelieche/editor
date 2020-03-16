/**
 * Markdown渲染Code块
 */
import React from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import atomDark from "./AtomDark";

// ReactMarkdown渲染code node
export const CodeBlock = ({value, language}) => {
    // console.log(value, language);
    return (
        <SyntaxHighlighter language={language} 
            style={ atomDark }
        >
            {value}
        </SyntaxHighlighter>
    )
}

export default CodeBlock;
