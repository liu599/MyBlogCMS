import styles from './Login.less';
import React, {PureComponent} from 'react';
import {routerRedux} from '@symph/joy/router';
import DataModel from '../../models/model';
import controller, {requireModel} from '@symph/joy/controller';
import { Form, Icon, Input, Row, Button, notification } from 'antd';

const FormItem = Form.Item;
@requireModel(DataModel)
@controller(state => ({model: state.model}))

class IndexController extends PureComponent {
  onSubmit = e => {
    const {form: {validateFields}, dispatch} = this.props;
    e.preventDefault();
    validateFields(async (err, data) => {
      if (err) {
        notification.error({
          duration: 2,
          message: '登陆失败',
          description: '缺少必填的信息'
        });
        return;
      }
      await dispatch({
        type: 'model/login',
        payload: data,
      });
      notification.success({
        duration: 2,
        message: '登陆成功',
        description: '欢迎登陆管理系统'
      });
      // 延迟2S跳转至列表页面
      // setTimeout(() => {
      //   dispatch(routerRedux.push('/dashboard'));
      // }, 2000);
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
                    message: 'Please input the username',
                  },
                ],
              })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} onPressEnter={() => this.onSubmit} size="large" placeholder="Username" />)}
            </FormItem>
            <FormItem hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the password',
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
