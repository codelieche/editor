/**
* 编辑器demo
*/

import React from "react";

import Editor from "../components/Editor"


export const DemoApp = (props) => {
    return (
        <div>
           <Editor content="> Hello Codelieche Editor!" />
        </div>
    )
}

export default DemoApp;
