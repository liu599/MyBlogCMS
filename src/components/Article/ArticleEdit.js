/* eslint comma-dangle: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, DatePicker, Input, Icon, Row, Button, Select, Radio } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

const ArticleEdit = ({
  dispatch,
  match,
  articleList,
  articleCategories,
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
      console.log('Received values of form: ', values);
      if (typeof dataIndex === 'undefined') {
        values.password = '**********';
        values.author = 1;
        values.status = 'private';
        values.template = 201;
        values.category = parseInt(values.category, 10);
        values.created = values.created.unix();
        values.modified = values.created;
        console.log('vvvv32', values);
        dispatch({ type: 'article/articleCreate', payload: values });
        return;
      }
      // TODO: 后台缺数据也可以提交
      console.log(initValue, '21231232');
      values.pid = initValue.pid;
      values.category = parseInt(values.category, 10);
      values.password = initValue.password;
      values.author = initValue.author;
      values.template = initValue.template;
      values.body = initValue.body;
      values.created = values.created.unix();
      console.log(values, 'vvvv');
      dispatch({ type: 'article/articleUpdate', payload: values });
    });
  }
  const receiveMarkdown = (content) => {
    console.log('recieved markdown content', content);
  };
  const receiveHtml = (content) => {
    console.log('receiveHtml', content);
    initValue.body = content;
  };
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
        span: 18,
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
  const markdownContent = '## 二级标题 HEAD 2 \n markdown 格式示例 \n ``` 欢迎使用 ```';
  const htmlContent = ' ';
  if (typeof dataIndex !== 'undefined') {
    initValue = articleList[dataIndex];
  }
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Article</h2>
      <form>
        <FormItem
          {...formItemLayout}
          label="title"
          hasFeedback
        >
          {getFieldDecorator('title', {
            rules: [
              {
                required: true,
                max: 30,
                message: 'title format (max: 30)',
              },
            ],
            initialValue: initValue.title,
          })(<Input onPressEnter={handleOk} size="large" placeholder="post title" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="category"
          hasFeedback
        >
          {getFieldDecorator('category', {
            rules: [
              { required: true, message: 'Please select one category!' },
            ],
            initialValue: String(initValue.category) !== 'undefined' ? String(initValue.category) : '301',
          })(
            <Select placeholder="Please select one category">
              {
                articleCategories.map((category) => {
                  return (
                    <Option value={String(category.cid)} key={category.cid} >{category.cname}</Option>
                  );
                })
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Created"
        >
          {getFieldDecorator('created', {
            rules: [
              {
                required: true,
                type: 'object',
                message: 'Please select time',
              },
            ],
            initialValue: typeof dataIndex !== 'undefined' ? moment(String(initValue.created * 1000), 'x') : moment(String(new Date().getTime()), 'x'),
          })(
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="slug"
          hasFeedback
        >
          {getFieldDecorator('slug', {
            rules: [
              {
                required: true,
                message: 'Please input the post slug',
              },
            ],
            initialValue: initValue.slug,
          })(<TextArea autosize={{ minRows: 4, maxRows: 4 }} placeholder="post slug" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="status"
        >
          {getFieldDecorator('status', {
            rules: [
              {
                required: true,
                type: 'string',
                message: 'Please select privacy',
              },
            ],
            initialValue: initValue.status,
          })(<Radio.Group>
            <Radio key={'public'} value={'public'}>Public</Radio>
            <Radio key={'private'} value={'private'}>Private</Radio>
          </Radio.Group>)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="body"
          hasFeedback
        >
          {getFieldDecorator('body', {
            rules: [
              {
                required: true,
                type: 'string',
                message: 'Please write body',
              },
            ],
            initialValue: initValue.body,
          })(<TextArea autosize={{ minRows: 10 }} placeholder="post body" />)}
        </FormItem>
        <FormItem
          {...tailFormItemLayout}
        >
          <Button style={{ marginRight: 10 }} type="default" size="large" onClick={() => { dispatch(routerRedux.push('/dashboard/article-list')); }}>
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


ArticleEdit.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state, match) => {
  return {
    articleCategories: state.article.articleCategories,
    articleList: state.article.articleList,
    articlePager: state.article.articlePager,
    match,
  };
};

export default connect(mapStateToProps, null)(Form.create()(ArticleEdit));
