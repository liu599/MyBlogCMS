import React, {Component} from 'react'
import {Form, Button, Icon, Input, Tooltip, message, notification} from 'antd';
import DataModel from '../../models/model';
import controller, {requireModel} from "@symph/joy/controller";

const FormItem = Form.Item;
@requireModel(DataModel)
@controller(state => ({model: state.model}))

class ResourceFix extends Component{

  btnStatus = false;
  onSubmit = e => {
    const {form: {validateFields}, dispatch} = this.props;
    e.preventDefault();
    this.btnStatus = true;
    validateFields(async (err, data) => {
      console.log(data);
      if(!data.userpath || !data.filetype) {
        message.error('信息不能为空');
        this.btnStatus = false;
        return;
      }
      if(data.userpath === "/home/wwwroot/file.ecs32.top/data") {
        message.error('资源目录不能是根目录/home/wwwroot/file.ecs32.top/data');
        this.btnStatus = false;
        return;
      }
      if(!data.userpath.includes("/home/wwwroot/file.ecs32.top/data")) {
        message.error('资源目录必须以/home/wwwroot/file.ecs32.top/data开头');
        this.btnStatus = false;
        return;
      }
      if(data.userpath.charAt(data.userpath.length-1) === "/") {
        message.error('资源目录不能以 / 结尾');
        this.btnStatus = false;
        return;
      }
      if(data.filetype.includes(".")) {
        message.error('文件类型不必含有 . 字符');
        this.btnStatus = false;
        return;
      }
      if(!/(jpg|JPG|gif|GIF|mp3|MP3|jpeg|JPEG)$/.test(data.filetype)) {
        message.error('文件类型必须为jpg,JPG,jpeg,JPEG,mp3,MP3其中之一');
        this.btnStatus = false;
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
                  disabled={this.btnStatus}
                  size="large"
                  htmlType="submit">
            提交数据
          </Button>
        </Form>

      </div>
    )
  }
}

export default Form.create()(ResourceFix);
