import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model'
import {Form, Input, Button, Checkbox, Icon, List} from 'antd';
import controller, {requireModel} from "@symph/joy/controller";
import {timeFormat} from '../../utils'

@requireModel(DashboardModel)
@controller(state => ({model: state.model}))

class UserList extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: 'model/getUsers',
      payload: {
        token: window.localStorage.getItem("nekohand_token"),
        uid: window.localStorage.getItem("nekohand_administrator"),
      }
    });
    console.log(this.props.model);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.props);
    const {form: {validateFields}, dispatch} = this.props;

    validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        await dispatch({
          type: 'model/loginNew',
          payload: values,
        });

      }
    });
  };
  render() {
    const { userList } = this.props.model;
    console.log(this.props.model, "222");
    const {form: {getFieldDecorator}} = this.props;
    return (
      <React.Fragment>
        <p>This is UserList</p>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your Password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
        {userList.length > 0 ?
        <List
          header={<div>已注册人员信息管理</div>}
          footer={<div>Version 0.0.15</div>}
          bordered
          dataSource={userList}
          renderItem={item => (
            <List.Item>
              <p>记录号: {item.uid}, 人员身份ID: {item.userid}, user: {item.name}, mail: {item.mail}, 注册时间: {timeFormat(item.createdAt)}, 最后一次登陆时间: {timeFormat(item.loggedAt)}</p>
            </List.Item>
          )} />: null }
      </React.Fragment>

    )
  }
}

export default Form.create()(UserList)
