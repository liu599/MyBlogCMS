import React, {Component} from 'react';
import Head from '@symph/joy/head';
import dynamic from '@symph/joy/dynamic';
import lodash from 'lodash'
import DashboardModel from '../../models/model'
import {Button, DatePicker, Form, Input, message, Radio, Select} from 'antd';
import 'braft-editor/dist/index.css'
import '../../editor.css'
import 'braft-extensions/dist/code-highlighter.css'
import controller, {requireModel} from '@symph/joy/controller'
import {routerRedux} from '@symph/joy/router';
import moment from 'moment';
const BraftEditor = dynamic({loader: () => import('./BraftEditorElement')}, {
  ssr: false
});


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

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



@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})

class ArticleEdit extends Component {

  state = {
    hide: () => null,
    dataIndex: undefined,
    readOnly: true,
    editorState: '',
  };

  componentWillMount() {
    this.setState({
      hide: message.loading('载入数据中...', 0)
    });
  }

  componentDidMount() {
    let self = this;
    self.props.dispatch({
      type: 'model/fetchCategories',
      payload: {
        pageNumber: 1,
        pageSize: 20,
      }
    }).then(() => {
      if (window && window.location.pathname.includes('edit')) {
        self.dataIndex = window.location.pathname.split('/')[4];
        self.props.dispatch({
          type: 'model/fetchPostById',
          payload: self.dataIndex,
        }).then(() => {
          self.state.hide();
        });
      } else {
        self.props.model.post = {
          title: '',
          category: '',
          createdAt: 1598908234,
          slug: 'this is a new post',
          status: 'Public',
        };
        self.state.hide();
        this.setState({
          readOnly: false
        });
      }
      self.state.hide();
    });
  }

  onSetValue = (body) => {
    console.log(body, 'body');
    this.props.form.setFieldsValue({
      body
    });
  };

  // 父组件调用子组件方法进行存储数据。
  onRef = (ref) => {
    this.child = ref;
  };

  onSubmit = e => {
    const {form: {validateFields}, dispatch} = this.props;
    console.log(this.props.model.post);
    this.child.saveCurrent();
    e.preventDefault();
    validateFields(async (err, data) => {
      // console.log('data', data, this.props);
      let pdata = lodash.cloneDeep(data);
      if (err) {
        return;
      }
      if(/^[0-9]+$/.test(pdata.title)) {
        message.error('文章标题不能是纯数字');
        return;
      }
      if (window) {
        window.sessionStorage.getItem("nekohand_administrator");
      }
      pdata.headers = {
        Authorization: this.props.model.token || window.localStorage.getItem("nekohand_token"),
        User: window.localStorage.getItem("nekohand_administrator"),
      };
      pdata.author = this.props.model.user;
      // pdata.body = pdata.body.toHTML();
      this.props.model.categories.forEach(category => {
        if (category.cname === data.category) {
          pdata.category = category.id;
        }
      });
      pdata.createdAt = pdata.createdAt.unix() ;
      pdata.modifiedAt = Math.ceil(new Date().getTime() / 1000);
      pdata.password = '******';
      if (this.dataIndex !== 'undefined') {
        pdata.id = this.props.model.post.id;
      }
      // 将空的段落转化为回车。
      // pdata.body = pdata.body.replace(/\<p\>\<\/p\>/gi, `<br/>`);
      console.log("pdata to post", pdata);
      this.props.dispatch({
        type: 'model/createPost',
        payload: pdata,
      }).then(sign => {
        if (sign) {
          message.info('Your change has been posted.');
          setTimeout(() => {
            this.props.dispatch(routerRedux.push('/dashboard/article-list'));
          }, 400);
        }
      });
    });
  };




  render() {


    const {form: {getFieldDecorator}} = this.props;
    return (
      <div>
        <Head>
          <title>Dashboard / edit article</title>
        </Head>
        <h2 style={{ marginBottom: 20 }}>Article</h2>
        <Form readOnly={this.state.readOnly} onSubmit={this.onSubmit}>
          <FormItem
            {...formItemLayout}
            label="title"
            hasFeedback
          >
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  max: 120,
                  message: 'title format (max: 120)',
                },
              ],
              initialValue: this.props.model.post.title,
            })(<Input onPressEnter={this.handleOk} size="large" placeholder="post title" />)}
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
              initialValue: String(this.props.model.post.category) !== 'undefined' ? String(this.props.model.post.category) : '公告',
            })(
              <Select placeholder="Please select one category">
                {
                  this.props.model.categories.map((category) => {
                    return (
                      <Option value={String(category.id)} key={category.id} >{category.cname}</Option>
                    );
                  })
                }
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="createdAt"
          >
            {getFieldDecorator('createdAt', {
              rules: [
                {
                  required: true,
                  type: 'object',
                  message: 'Please select time',
                },
              ],
              initialValue: typeof this.dataIndex !== 'undefined' ? moment(String(this.props.model.post.createdAt * 1000), 'x') : moment(String(new Date().getTime()), 'x'),
            })(
              <DatePicker showTime format="YYYY-MM-DD" />
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
              initialValue: this.props.model.post.slug,
            })(<TextArea autosize={{ minRows: 1, maxRows: 6 }} placeholder="post slug" />)}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="status"
          >
            {getFieldDecorator('status', {
              rules: [
                {
                  required: false,
                  type: 'string',
                  message: 'Please select privacy',
                },
              ],
              initialValue: this.props.model.post.status,
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
                  required: false,
                  type: 'string',
                  message: 'Please write body',
                },
              ],
            })(<BraftEditor setValue={this.onSetValue} onRef={this.onRef} />)}
          </FormItem>
          <FormItem
            {...tailFormItemLayout}
          >
            <Button style={{ marginRight: 10 }} type="default" size="large"
                    onClick={() => { this.props.dispatch(routerRedux.push('/dashboard/article-list')); }}>
              Back
            </Button>
            <Button type="primary"
                    size="large"
                    htmlType="submit">
              Save & Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ArticleEdit);
