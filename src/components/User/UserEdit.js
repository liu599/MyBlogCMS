import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import lodash from 'lodash';
import { Form, Input, Icon, Row, Button } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './UserEdit.less';

const FormItem = Form.Item;

const UserEdit = ({
  loading,
  match,
  dispatch,
  users,
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
      values.avatar = parseInt(data.avatar, 10);
      dispatch({ type: 'users/update', payload: values });
    });
  }
  const data = users[match.location.query.index];
  console.log('dddd', data);
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 4,
        offset: 0,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
      },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 14,
        offset: 4,
      },
    },
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        Update the administrator information
      </h2>
      <form>
        <FormItem
          {...formItemLayout}
          label="uid"
        >
          {getFieldDecorator('uid', {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: data.uid,
          })(<Input disabled size="large" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="name"
          hasFeedback
        >
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Please input the username',
              },
            ],
            initialValue: data.name,
          })(<Input disabled onPressEnter={handleOk} size="large" placeholder="Username" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="password"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input the username',
              },
            ],
            initialValue: 'This will update the old password',
          })(<Input onPressEnter={handleOk} size="large" placeholder="Password" disabled />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="mail"
          hasFeedback
        >
          {getFieldDecorator('mail', {
            rules: [
              {
                required: true,
                message: 'Please input the right e-mail address',
              },
            ],
            initialValue: data.mail,
          })(<Input onPressEnter={handleOk} size="large" placeholder="Mail" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="nickname"
          hasFeedback
        >
          {getFieldDecorator('nick', {
            rules: [
              {
                required: true,
                message: 'Please input the nickname',
              },
            ],
            initialValue: data.nick,
          })(<Input onPressEnter={handleOk} size="large" placeholder="Nickname" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="url"
          hasFeedback
        >
          {getFieldDecorator('url', {
            rules: [
              {
                required: true,
                message: 'website you want to show',
              },
            ],
            initialValue: data.url,
          })(<Input onPressEnter={handleOk} size="large" placeholder="Website Url" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="introduction"
          hasFeedback
        >
          {getFieldDecorator('introduction', {
            rules: [
              {
                required: true,
                message: 'your introduction',
              },
            ],
            initialValue: data.intro,
          })(<Input onPressEnter={handleOk} size="large" placeholder="Introduction" />)}
        </FormItem>
        <FormItem
          {...tailFormItemLayout}
        >
          <Button style={{ marginRight: 10 }} type="default" size="large" onClick={() => { dispatch(routerRedux.push('/dashboard/user-list')); }} loading={loading.effects.login}>
            Back
          </Button>
          <Button type="primary" size="large" onClick={handleOk} loading={loading.effects.login}>
            Submit
          </Button>
        </FormItem>
      </form>
    </div>
  );
};

UserEdit.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

const mapStateToProps = (state, match) => {
  return {
    loading: state.loading,
    users: state.users,
    match,
  };
};


export default connect(mapStateToProps, null)(Form.create()(UserEdit));
