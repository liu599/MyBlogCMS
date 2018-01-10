import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Row, Button, Checkbox } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;

const Login = ({
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk() {
    // antd 验证方法
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      console.log('values is:', values);
      dispatch({ type: 'login/login', payload: values });
    });
  }
  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="website logo" />
        <span>Nekohand Blog CMS</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Please input the username',
              },
            ],
          })(<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} onPressEnter={handleOk} size="large" placeholder="Username" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input the password',
              },
            ],
          })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} onPressEnter={handleOk} size="large" placeholder="Password" type="password" />)}
        </FormItem>
        <Row>
          <Button className={styles.btn} type="primary" size="large" onClick={handleOk} loading={loading.effects.login}>
            Sign in
          </Button>
          <p className={styles.desc}>
            <span>Version 6.0 - © 2014-2017 Tokei </span>
          </p>
        </Row>
      </form>
    </div>
  );
};

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

export default connect(({ loading }) => ({ loading }))(Form.create()(Login));
