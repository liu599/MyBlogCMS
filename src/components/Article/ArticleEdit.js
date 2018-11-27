import React, {Component} from 'react';
import Head from '@symph/joy/head';
import lodash from 'lodash'
import DashboardModel from '../../models/model'
import {Button, DatePicker, Form, Input, message, Radio, Select} from 'antd';
import 'braft-editor/dist/index.css'
import '../../editor.css'
import 'braft-extensions/dist/code-highlighter.css'
import controller, {requireModel} from '@symph/joy/controller'
import {routerRedux} from '@symph/joy/router';
import BraftEditor from 'braft-editor';
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'
// 首先需要从prismjs中引入需要扩展的语言库
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-php'
import moment from 'moment';

BraftEditor.use(CodeHighlighter({
  includeEditors: ['editor-with-code-highlighter'],
  syntaxs: [
    {
      name: 'JavaScript',
      syntax: 'javascript'
    }, {
      name: 'HTML',
      syntax: 'html'
    }, {
      name: 'CSS',
      syntax: 'css'
    }, {
      name: 'Java',
      syntax: 'java',
    }, {
      name: 'PHP',
      syntax: 'php'
    }
  ],
}));

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
        this.dataIndex = window.location.pathname.split('/')[4];
        self.props.dispatch({
          type: 'model/fetchPostById',
          payload: window.location.pathname.split('/')[4],
        }).then(() => {
          self.state.hide();
          setTimeout(() => {
            try {
              self.props.form.setFieldsValue({
                body: self.props.model.post.body
              });
            } catch(e) {
              console.error(e);
            }
          }, 2000);
          this.setState({
            readOnly: false,
          });
          console.log(self.props, self.state,  'after fetch State');
        });
      } else {
        self.props.model.post = {
          title: '',
          category: '',
          createdAt: 1598908234,
          slug: 'this is a new post',
          status: 'Public',
          body: BraftEditor.createEditorState('<p>New Article</p>'),
        };
        self.state.hide();
        this.setState({
          readOnly: false
        });
      }
    });
  }
  
  
  
  onSubmit = e => {
    const {form: {validateFields}, dispatch} = this.props;
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
      pdata.body = pdata.body.toHTML();
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
      console.log("pdata to post", pdata);
      this.props.dispatch({
        type: 'model/createPost',
        payload: pdata,
      }).then(sign => {
        if (sign) {
          message.info('Your change has been posted.');
          setTimeout(() => {
            this.props.dispatch(routerRedux.push('/dashboard/article-list'));
          }, 600);
        }
      }, (err) => {
        message.error(err)
      });
    });
  };

  preview = () => {

    if (window.previewWindow) {
      window.previewWindow.close()
    }

    window.previewWindow = window.open()
    window.previewWindow.document.write(this.buildPreviewHtml())
    window.previewWindow.document.close()

  };

  buildPreviewHtml () {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 1000px;
              max-width: 100%;
              min-height: 100%;
              margin: 0 auto;
              padding: 30px 20px;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
              margin: 0;
              overflow: auto;
              line-height: 1.6;
              background-color: #eaeae4;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
            img {
              width: 80%;
              margin: 0 auto;
              display: block;
            }
            h1 {
              font-size: 2.0rem;
              color: #4a88c2;
            }
            h2 {
              font-size: 1.8rem;
              color: #4a88c2;
            }
            h3 {
              font-size: 1.6rem;
              font-weight: 400;
              color: #4a88c2;
            }
            code {
              font-family: "Comic Sans MS", "Microsoft Yahei", -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
            }
            p {
              color: #282828;
              line-height: 2;
            }
            p code {
              background: #222;
              color: #f5f5f5;
              padding: .2em .4em;
              border-radius: 6px;
              margin: 0 .4em;
            }
            pre code {
              margin: 0;
            }
            ul {
              margin-left: 1em;
              list-style-type: disc;
            }
            ol {
              margin-left: 1em;
            }
            a:hover {
              color: #ee0022;
            }
            blockquote {
              margin: 20px 1em;
              padding: 0 .6em;
              color: #6a737d;
              border-left: 0.2em solid #dfe2e5;
              line-height: 2em;
            }
          </style>
        </head>
        <body>
          <div class="container">${this.props.form.getFieldsValue().body.toHTML()}</div>
        </body>
      </html>
    `

  };

  render() {
    const excludeControls = [
      'letter-spacing',
      'line-height',
      'clear',
      'remove-styles',
      'superscript',
      'subscript',
      'hr',
    ];

    const extendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      }
    ];

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
            })(<TextArea autosize={{ minRows: 4, maxRows: 4 }} placeholder="post slug" />)}
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
                  type: 'object',
                  message: 'Please write body',
                },
              ],
            })(<BraftEditor
              excludeControls={excludeControls}
              extendControls={extendControls}
              contentStyle={{height: 400}}
              placeholder="post body" />)}
          </FormItem>
          <FormItem
            {...tailFormItemLayout}
          >
            <Button style={{ marginRight: 10 }} type="default" size="large" onClick={() => { this.props.dispatch(routerRedux.push('/dashboard/article-list')); }}>
              Back
            </Button>
            <Button type="primary"
                    size="large"
                    htmlType="submit">
              Submit
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ArticleEdit);
