/**
* 编辑器demo
*/

import React from "react";

import Editor from "../components/Editor"

export const markdownStr = `## Codelieche Editor
> www.codelieche.com

### Todos
- [ ] 列表\`ul/ol\`嵌套
- [x] 上传图片
- [ ] 使用文档
- [ ] 使用示例
- [ ] 性能优化

### 参考文档
- [codelieche.com](https://www.codelieche.com)
`;


export const DemoApp = (props) => {
    return (
        <div>
           <Editor 
            //  uploadFileUrl="http://127.0.0.1:9000/api/v1/docs/image/upload" // POST上传图片的接口
             content={markdownStr} />
        </div>
    )
}

export default DemoApp;
