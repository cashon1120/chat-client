import React from 'react'
import {Upload, message} from 'antd'
import {FolderOutlined} from '@ant-design/icons';
import {getLocalUserInfo} from '../../utils/common'
import "./style.css"

const UploadImg = (props) => {
  const beforeUpload = (file) => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   message.error('只能上传 JPG/PNG 格式的文件!');
    // }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('文件大小不能超过 2MB!');
    }
    return isLt2M;
  }

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      const {path} = info.file.response
      sendFile(path)
    }
  };

    // 发送文件
    const sendFile = (path) => {
      const localUserInfo = getLocalUserInfo()
      props.socket.send({
        type: 'chat',
        params: {
          userName: localUserInfo.userName,
          type: 'file',
          path
        }
      })
    }


  return <div>
    <div
      style={{
      width: 30,
      height: 30,
      boxSizing: 'border-box',
      paddingTop: 2
    }}>
      <FolderOutlined className="icon"/>
    </div>
    <div className="upload-img-btn">
      <Upload
        style={{height: 28}}
        name="upload"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange} >123</Upload>
    </div>        
  </div>
}

export default UploadImg