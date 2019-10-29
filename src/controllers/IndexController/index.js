import styles from './Login.less';
import React, {Component} from 'react';
import {routerRedux} from '@symph/joy/router';
import DataModel from '../../models/model';
import controller, {requireModel} from '@symph/joy/controller';
import { Form, Icon, Input, Row, Button, notification, message } from 'antd';

const FormItem = Form.Item;
@requireModel(DataModel)
@controller(state => ({model: state.model}))

class IndexController extends Component {
  btnStatus = false;
  onSubmit = e => {
    const {form: {validateFields}, dispatch} = this.props;
    e.preventDefault();
    this.btnStatus = true;
    validateFields(async (err, data) => {
      if(/^[0-9]+$/.test(data.username)) {
        message.error('用户名不能是纯数字');
        this.btnStatus = false;
        return;
      }
      if(/^[a-z0-9A-Z]+$/.test(data.password)) {
        message.error('密码必须包含特殊字符');
        this.btnStatus = false;
        return;
      }
      const hide = message.loading('正在登陆中...');
      let isSuccess = await dispatch({
        type: 'model/login',
        payload: data,
      });
      hide();
      if (isSuccess !== null) {
        notification.success({
          duration: 1,
          message: '验证成功',
          description: '用户名验证通过， 正在获取数据中....'
        });
        await dispatch({
          type: 'model/fetchPostsList',
          payload: {
            pageNumber: 1,
            pageSize: 20,
          }
        });
        setTimeout(() => {
          dispatch(routerRedux.push('/dashboard/article-list'));
        }, 1000);
      } else {
        notification.error({
          duration: 2,
          message: '登陆错误',
          description: '服务器可能无响应'
        });
        this.btnStatus = false;
      }
    });
  };
  render() {
    const {form: {getFieldDecorator}} = this.props;
    return (
      <React.Fragment>
        <div className={styles.form}>
          <div className={styles.logo}>
            <img src={require('./logo.png')} alt="website logo" />
            <span>Nekohand Blog CMS</span>
          </div>
          <Form onSubmit={this.onSubmit}>
            <FormItem hasFeedback>
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '用户名不能为空',
                  },
                ],
              })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} onPressEnter={() => this.onSubmit} size="large" placeholder="Username" />)}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '密码不能为空',
                  },
                ],
              })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} onPressEnter={() => this.onSubmit} size="large" placeholder="Password" type="password" />)}
            </FormItem>
            <Row>
              <Button className={styles.btn}
                      disabled={this.btnStatus}
                      type="primary"
                      size="large"
                      htmlType="submit">
                Sign in
              </Button>
              <div className={styles.desc}>
                <p>Version 7.0.5 Kasumi ©2017-2019 Tokei</p>
              </div>
            </Row>
          </Form>
        </div>
      </React.Fragment>
    );
  }
  
  
}

export default Form.create()(IndexController);
