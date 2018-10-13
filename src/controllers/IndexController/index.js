import styles from './Login.less';
import React, {PureComponent} from 'react';
import {routerRedux} from '@symph/joy/router';
import DataModel from '../../models/model';
import controller, {requireModel} from '@symph/joy/controller';
import { Form, Icon, Input, Row, Button, notification, message } from 'antd';

const FormItem = Form.Item;
@requireModel(DataModel)
@controller(state => ({model: state.model}))

class IndexController extends PureComponent {
  onSubmit = e => {
    const {form: {validateFields}, dispatch} = this.props;
    e.preventDefault();
    validateFields(async (err, data) => {
      if(/^[0-9]+$/.test(data.username)) {
        message.error('用户名不能是纯数字');
        return;
      }
      if(/^[a-z0-9A-Z]+$/.test(data.password)) {
        message.error('密码必须包含特殊字符');
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
          message: '登陆成功',
          description: '欢迎登陆管理系统'
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
          description: '请输入正确的用户名和密码'
        });
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
                      type="primary"
                      size="large"
                      htmlType="submit">
                Sign in
              </Button>
              <p className={styles.desc}>
                <span>Ver7.0 Kasumi - ©2017-2018 Tokei </span>
              </p>
            </Row>
          </Form>
        </div>
      </React.Fragment>
    );
  }
  
  
}

export default Form.create()(IndexController);
