import React, {Component} from 'react'
import {Form, Button, Icon, Input, Tooltip, message, notification, Upload} from 'antd';
import DataModel from '../../models/model';
import AimiModel from "../../models/aimiModels";
import controller, {requireModel} from "@symph/joy/controller";
import {default as configs} from "../../services/config";
import autowire from "@symph/joy/autowire";

const FormItem = Form.Item;
@requireModel(DataModel)
@controller(state => ({model: state.model}))

class ResourceFix extends Component{

  @autowire()
  aimi: AimiModel;


  state = {
    fileList: [],
    uploadingFilename: 'rqst.png',
    relativePathName: '/',
    createdAt: 0,
    uploading: false,
    btnStatus: false,
  };

  componentDidMount() {
    this.aimi.fetchAimiTags();
  }


  handleChange = (info) => {
    console.log(info, 'jkdlaf');
    this.setState({
      uploadingFilename: info.file.name,
      createdAt: Math.floor(info.file.lastModified * 0.001),
      fileList: [...info.fileList] });
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (info.file.status === 'done') {
      info.fileList = info.fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          // file.url = file.response.url;
          console.log(file.response);
          if (file.response.hasOwnProperty("file_name")) {
            let fname = file.response["file_name"];
            let relativePath = file.response["file_relative_path"];
            file.url =`${configs.fileRootUrl}${relativePath}${fname[0]}`;
          }
        }
        return file;
      });
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }

  };


  onSubmit = e => {
    const {form: {validateFields}, dispatch} = this.props;
    e.preventDefault();
    this.btnStatus = true;
    validateFields(async (err, data) => {
      console.log(data);
      data.token = window.localStorage.getItem("nekohand_token");
      data.uid = window.localStorage.getItem("nekohand_administrator");
      if(!data.userpath || !data.filetype) {
        message.error('信息不能为空');
        this.btnStatus = false;
        return;
      }
      if(data.userpath === "/home/wwwroot/file.ecs32.top/data") {
        message.error('资源目录不能是根目录/home/wwwroot/file.ecs32.top/data');
        this.setState({
          btnStatus: false
        });
        return;
      }
      if(!data.userpath.includes("/home/wwwroot/file.ecs32.top/data")) {
        message.error('资源目录必须以/home/wwwroot/file.ecs32.top/data开头');
        this.setState({
          btnStatus: false
        });
        return;
      }
      if(data.userpath.charAt(data.userpath.length-1) === "/") {
        message.error('资源目录不能以 / 结尾');
        this.setState({
          btnStatus: false
        });
        return;
      }
      if(data.filetype.includes(".")) {
        message.error('文件类型不必含有 . 字符');
        this.setState({
          btnStatus: false
        });
        return;
      }
      if(!/(jpg|JPG|gif|GIF|mp3|MP3|jpeg|JPEG|flac|FLAC)$/.test(data.filetype)) {
        message.error('文件类型必须为jpg,JPG,jpeg,JPEG,mp3,MP3其中之一');
        this.setState({
          btnStatus: false
        });
        return;
      }
      const hide = message.loading("正在修改中....");
      let isSuccess = await dispatch({
        type: 'model/fixFiles',
        payload: data,
      });
      hide();
      if (isSuccess !== null) {
        notification.success({
          duration: 1,
          message: '修改成功',
          description: '已成功加入数据库'
        });
      } else {
        notification.error({
          duration: 2,
          message: '登陆错误',
          description: `错误代码`
        });
      }
    });
  };

  render(){
    const props = {
      action: `https://mltd.ecs32.top/upload`,
      listType: 'picture',
      beforeUpload: file => {
        props.data.fileName = file.name;
        props.data.relativePath = this.state.relativePathName;
      },
      data: {
        email: "460512944.com",
        token: window.localStorage.getItem("nekohand_token"),
        uid: window.localStorage.getItem("nekohand_administrator"),
        relativePath: ""
      },
      onChange: this.handleChange,
      defaultFileList: [],
    };
    const {form: {getFieldDecorator}} = this.props;
    return (
      <div>
        <h2>批量导入数据库工具</h2>
        <p>将已有资源批量导入数据库</p>
        <p>资源主路径: /home/wwwroot/file.ecs32.top/data</p>
        <Form onSubmit={this.onSubmit}>
          <FormItem hasFeedback className="fix-form" >
            {getFieldDecorator('userpath', {
              rules: [
                {
                  required: false,
                  message: 'userpath, 根目录下某个目录， 不能填根目录',
                },
              ],
            })(<Input
              placeholder="资源路径要写全, 必须在/home/wwwroot/file.ecs32.top/data下,　末尾不要带/字符"
              prefix={<Icon type="container" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={
                <Tooltip title="例如/a/b">
                  <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }/>)}
              </FormItem>
          <FormItem>
              {getFieldDecorator('filetype', {
                rules: [
                  {
                    required: true,
                    message: 'filetype不能为空',
                  },
                ],
              })(
            <Input
              placeholder="资源格式"
              prefix={<Icon type="file-unknown" style={{ color: 'rgba(0,0,0,.25)' }} />}
              suffix={
                <Tooltip title="mp3, mp4, png, jpg, jpeg等等">
                  <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                </Tooltip>
              }
            />)}
          </FormItem>
          <Button type="primary"
                  disabled={this.state.btnStatus}
                  htmlType="submit">
            提交数据
          </Button>
        </Form>
        <br />
        <h2 style={{ marginBottom: 20 }}>资源上传</h2>
        <div style={{ marginBottom: 20 }}>
          <Input defaultValue={"/"}
                 onChange={(e) => {
                   console.log('eddie32', e.target.value);
                   props.data.relativePath = e.target.value;
                   console.log(props, "");
                   this.setState({
                      relativePathName: e.target.value
                   }
                 )}}
                 placeholder="创建资源的相对路径" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Upload {...props}
                  fileList={this.state.fileList}
                  supportServerRender
                  multiple>
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
        </div>
      </div>
    )
  }
}

export default Form.create()(ResourceFix);
