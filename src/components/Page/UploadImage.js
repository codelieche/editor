/**
 * 上传图片的块
 * 有三种方式上传图片
 * 1. 选择本地的图片
 * 2. 选择链接
 * 3. 选择系统中的图片
 * 4. 网络搜索图片
 */
import React, { useState, useEffect, useCallback, useMemo} from "react";

import {
    Tabs,
    Input,
    Button,
    message,
    Modal
} from "antd";

// import fetchApi from "../Utils/fetchApi";
import UploadImageItem from "./UplaodImageItem";


/**
 * 上传图片的组件
 * 1. uploadImage: 选择本地图片上传
 * 2. useLink: 选择外部链接上传
 * 3. useSystem: 使用系统中的图片
 * 4. searchImage: 搜索图片上传
 * 
 * 需要传递的属性
 * 1. afterUploadHandle = (url) = {}: 得到图片链接后需要的处理函数
 * @param {*} props 
 */
export const UploadImageTabs = (props) => {
    // 设置状态
    const [ activeTabKey, setActiveTabKey ] = useState("uploadImage");
    const [fileListData, setFileListData] = useState([]);
    // 上传或者输入的图片链接
    const [imageUrl, setImageUrl] = useState(null);

    // Tab变更
    const onTabChange = useCallback((key) => {
        setActiveTabKey(key);
    }, [])

    useEffect(() => {
        
    }, [])

    // 输入图片链接
    const handleInputImageUrl = useCallback((e) => {
        // console.log(e);
        e.stopPropagation();
        setImageUrl(e.target.value);
    }, []);

    const checkImageUrlPattern = useMemo(() => {
        // 检查图片是否以这些结尾
        return /\.(png)|(jpg)|(gif)|(jpeg)$/;
    }, []);

    // 处理上传图片操作
    const handleUploadImage = useCallback(() => {
        // 检查是否有图片数据
        if( fileListData.length < 1 ){
            return;
        }

        // 通过表单 上传图片
        let formData = new FormData();
        for(var i=0; i < fileListData.length; i++){
            formData.append("file", fileListData[i]);
        }
        
        // 发起Post请求
        // let url = "/api/v1/docs/image/upload";
        let url = props.uploadFileUrl;
        if(!url){
            // 未传递url
            message.warn("Edtiror为传递uploadFileUrl参数");
            // 创建一个base64的连接
            if(fileListData.length > 0){
                let uploadImageUrl = URL.createObjectURL(fileListData[0]);
                if(props.afterUploadHandle){
                    props.afterUploadHandle(uploadImageUrl);
                }else{
                    console.log("未传递：afterUploadHandle");
                }
            }else{
                // 图片为空
                message.warn("传入的图片为空");
            }
            
        }else{
            // 执行上传图片操作，需要返回：file或者qiniu字段
            fetch(
                url, {
                    method: "POST",
                    body: formData,
                    // headers: {
                    //     "Content-Type": "multipart/form-data"
                    // },
                    credentials: 'include' // 携带cookie
                }
            ).then(response => {
                return response.json();
            })
              .then(responseData => {
                console.log(responseData);
                // 执行得到图片链接后的：后续的操作
                if(responseData.qiniu){
                    if(props.afterUploadHandle){
                        props.afterUploadHandle(responseData.qiniu);
                    }else{
                        console.log("未传递：afterUploadHandle");
                    }
                }else if(responseData.file){
                    if(props.afterUploadHandle){
                        props.afterUploadHandle(responseData.file);
                    }else{
                        console.log("未传递：afterUploadHandle");
                    }
                }else{
                    message.warn("上传图片的返回结果file和qiniu字段为空");
                }
              })
                .catch(err => {
                    console.log(err);
                    message.warn("fetch发起post上传图片出错")
                })
        }
        // fetch.Post(url, formData, {})
        //   .then(responseData => {
        //       console.log(responseData);
        //       // 执行得到图片链接后的：后续的操作
        //       if(responseData.qiniu){
        //           if(props.afterUploadHandle){
        //             props.afterUploadHandle(responseData.qiniu);
        //           }else{
        //             console.log("未传递：afterUploadHandle");
        //           }
        //       }else if(responseData.file){
        //         if(props.afterUploadHandle){
        //           props.afterUploadHandle(responseData.file);
        //         }else{
        //           console.log("未传递：afterUploadHandle");
        //         }
        //     }else{
        //         message.warn("上传图片的返回结果file和qiniu字段为空");
        //     }
        //   })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }, [fileListData, props])

    const handleSubmit = useCallback((e) => {
        // console.log(e);
        e.stopPropagation();

        if( activeTabKey === "uploadImage" ){
            // 情况1：上传图片文件
            if( fileListData.length > 0 ){
                // 发起上传图片请求
                handleUploadImage();
                return;
            }else{
                message.warn("请选择需要上传的图片");
            }
        }else if( activeTabKey === "useLink" ){
            // 情况2：选择的输入图片
            if(!!imageUrl){
                if(checkImageUrlPattern.test(imageUrl)){
                    // 执行得到图片链接后的：后续的操作
                    if(props.afterUploadHandle){
                        props.afterUploadHandle(imageUrl);
                    }else{
                        console.log("未传递：afterUploadHandle");
                    }
                }else{
                    message.warn("图片的地址需要以jpg/jpeg/png/gif结尾");
                }

            }else{
                message.warn("请输入图片的网址")
            }
        }

    }, [activeTabKey, checkImageUrlPattern, fileListData.length, handleUploadImage, imageUrl, props])

    

    // 提交按钮是否未禁用
    let submitDisable = true;
    if(activeTabKey === "uploadImage"){
        if(fileListData.length > 0){
            submitDisable = false;
        }
    }else if( activeTabKey === "useLink" ){
        if(!!imageUrl && checkImageUrlPattern.test(imageUrl)){
            submitDisable = false;
        }
    }

    return (
        <div className="upload-image-tabs">
            <Tabs defaultActiveKey={activeTabKey} onChange={onTabChange}>
                <Tabs.TabPane tab="上传图片" key="uploadImage">
                    <div className="upload">
                        <UploadImageItem
                            url=""
                            fileListData={fileListData}
                            setFileListData={setFileListData}
                        />
                    </div>
                    
                </Tabs.TabPane>

                <Tabs.TabPane tab="使用链接" key="useLink">
                    <div className="input-url">
                        <Input placeholder="输入图片地址" 
                          allowClear={true}
                          onChange={handleInputImageUrl} />
                    </div>
                        { 
                            activeTabKey === "useLink" && imageUrl && checkImageUrlPattern.test(imageUrl) &&  (
                                <div className="show-image"> 
                                    <img src={imageUrl} alt="图片"></img>
                                </div>
                            )
                        }
                </Tabs.TabPane>
            </Tabs>
            {/* <div>
                <span>{imageUrl}</span>
            </div> */}
            <div className="button">
                <Button type="primary" 
                  onClick={handleSubmit} 
                  disabled={submitDisable}
                >
                    提交
                </Button>
            </div>
        </div>
    );
}

export const UploadImageTabsModal = (props) => {
    const {visible, ...restProps} = props;

    const handleOnCloseOrOk = useCallback((e) => {
        // console.log(e);
        if(props.handleAfterClose){
            props.handleAfterClose()
        }
    }, [props])
    return (
        <Modal 
          wrapClassName="upload-image-modal"
          visible={props.visible} 
          onOk={handleOnCloseOrOk}
          onCancel={handleOnCloseOrOk}
          // 关闭的时候销毁里面的内容，就不会看到上次上传的图片了
          destroyOnClose={true}
          footer={null}  // 不显示底部按钮
        >
            <UploadImageTabs {...restProps} />
        </Modal>
    )
}

export default UploadImageTabs;
