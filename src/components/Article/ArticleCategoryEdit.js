import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Icon, Row, Button } from 'antd';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;

const ArticleCategoryEdit = ({
  dispatch,
  match,
  categories,
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
      if (JSON.stringify(initValue) === '{}') {
        dispatch({ type: 'article/categoryCreate', payload: values });
        return;
      }
      values.cid = initValue.cid;
      dispatch({ type: 'article/categoryUpdate', payload: values });
    });
  }
  const dataIndex = match.location.query.index;
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
  let initValue = {};
  if (typeof dataIndex !== 'undefined') {
    initValue = categories[dataIndex];
  }
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Category</h2>
      <form>
        <FormItem
          {...formItemLayout}
          label="name"
          hasFeedback
        >
          {getFieldDecorator('cname', {
            rules: [
              {
                required: true,
                message: 'Please input the category name',
              },
            ],
            initialValue: initValue.cname,
          })(<Input onPressEnter={handleOk} size="large" placeholder="category name" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="info"
          hasFeedback
        >
          {getFieldDecorator('cinfo', {
            rules: [
              {
                required: false,
                message: 'intro for this category',
              },
            ],
            initialValue: initValue.cinfo,
          })(<Input onPressEnter={handleOk} size="large" placeholder="Category info" />)}
        </FormItem>
        <FormItem
          {...tailFormItemLayout}
        >
          <Button style={{ marginRight: 10 }} type="default" size="large" onClick={() => { dispatch(routerRedux.push('/dashboard/article-category')); }}>
            Back
          </Button>
          <Button type="primary" size="large" onClick={handleOk}>
            Submit
          </Button>
        </FormItem>
      </form>
    </div>
  );
};


ArticleCategoryEdit.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state, match) => {
  return {
    categories: state.article.articleCategories,
    match,
  };
};

export default connect(mapStateToProps, null)(Form.create()(ArticleCategoryEdit));
