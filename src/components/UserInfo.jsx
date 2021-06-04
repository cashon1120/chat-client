import React, {useState} from 'react'
import {Modal, Form, Input, Upload, message} from 'antd'
import {UserOutlined, LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import {Consumer} from '../context'
import request from '../utils/axios'

const layout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const UserInfo = () => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [avatar, setAvatar] = useState('')
  const [nickName, setNickName] = useState(localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).nickName : '')

  const handleFinish = (setUserInfo) => {
    if(!nickName){
      message.error('请输入您的昵称')
      return
    }
    const values = {
      nickName,
      avatar
    }
    request.post('/updateInfo', values).then(res => {
      console.log(res)
      if(res && res.code === 0){
        message.success('修改成功')
        setUserInfo(res.userInfo)
      }else{
        message.error(res.msg)
      }
    })
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  const handleNickNameChange = (e) => {
    setNickName(e.target.value)
  }

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      const {path} = info.file.response
      setAvatar(path)
      getBase64(info.file.originFileObj, imageUrl => {
          setLoading(true)
          setImageUrl(imageUrl)
        }
      );
    }
  };

  return <Consumer>
    {
      ({userInfo, setUserInfo}) => <>
        <UserOutlined onClick={() => setVisible(true)} />
            <Modal title="修改信息" visible={visible} onCancel={() => setVisible(false)} onOk={() => {
              handleFinish(setUserInfo)
            }}>
            <Form
              {...layout}
              name="basic"
              initialValues={{remember: true}}
            >
              <Form.Item
                label="昵称"
                name="nickName"
                rules={[{
                  required: true,
                  message: '请输入昵称!'
                }
              ]}>
                <Input defaultValue={userInfo ? userInfo.nickName : ''} onChange={handleNickNameChange} />
              </Form.Item>

              <Form.Item
                label="头像"
                name="password"
                rules={[{
                  required: true,
                  message: '请输入密码!'
                }
              ]}>
                <Upload
                  name="upload"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="/api/upload"
                  beforeUpload={beforeUpload}
                  onChange={  handleChange}
                >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
      </>
    }
  </Consumer>
}

export default UserInfo