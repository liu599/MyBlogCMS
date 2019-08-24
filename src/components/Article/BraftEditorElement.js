import React from 'react';
import BraftEditorElem from 'braft-editor';
import DashboardModel from '../../models/model'
import {requireModel} from "@symph/joy/controller";
import {Input} from 'antd';
const { TextArea } = Input;
import controller from "@symph/joy/controller";
import lodash from 'lodash'


@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})
export default class BraftEditorElement extends React.Component {

  state = {
    hide: () => null,
    editorState: BraftEditorElem.createEditorState('<p>Initial State</p>'),
    readOnly: true,
    outputHTML: '',
    rawHTML: ''
  };

  componentDidMount() {
    let self = this;
    if (window && window.location.pathname.includes('edit')) {

      self.props.dispatch({
        type: 'model/fetchPostById',
        payload: window.location.pathname.split('/')[4],
      }).then(() => {
        self.state.hide();
        // setTimeout(() => {
        //   self.props.form.setFieldsValue({
        //     body: BraftEditorEle.createEditorState(self.props.model.post.body),
        //   });
        // }, 2000);
        this.setState({
          readOnly: false,
          editorState: BraftEditorElem.createEditorState(lodash.cloneDeep(self.props.model.post.body)),
        });
        // console.log(self.props, self.state,  'after fetch State');
      });
    } else {
      self.props.model.post = {
        title: '',
        category: '',
        createdAt: 1598908234,
        slug: 'this is a new post',
        status: 'Public',
        body: BraftEditorElem.createEditorState('<p>New Article</p>'),
      };
      self.state.hide();
      this.setState({
        readOnly: false
      });
    }
  }

  handleChange =  (editorState) => {
    // console.log(typeof editorState.toHTML, 'editor state')
    let convertToHTML = editorState.toHTML;
    if (typeof convertToHTML === 'function') {
      this.setState({
        editorState,
        outputHTML: editorState.toHTML(),
      });
      this.props.setValue(this.state.editorState.toHTML());
    }
    //
    // this.props.dispatch({
    //   type: 'model/setAsyncState',
    //   payload: {
    //     post: {
    //       body: '',
    //     }
    //   }
    // }).then(() => {
    //   console.log(this.props);
    // });
  };

  preview = () => {

    if (window.previewWindow) {
      window.previewWindow.close()
    }

    window.previewWindow = window.open();
    window.previewWindow.document.write(this.buildPreviewHtml());
    window.previewWindow.document.close();

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
          <div class="container">${this.state.editorState.toHTML()}</div>
        </body>
      </html>
    `

  };

  toRawHtml =  (e) => {
      // console.log('new HTML', e.currentTarget.value);
      this.setState({
        rawHTML: e.currentTarget.value,
      })
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
      },
      {
        key: 'custom-button-raw',
        type: 'modal',
        text: '源代码',

        modal: {
          id: 'my-moda-1',
          title: '源代码编辑',
          confirmable: true,
          onConfirm: () => {
            // console.log('confirm', this.state);
            this.setState({
              editorState: BraftEditorElem.createEditorState(this.state.rawHTML),
              outputHTML: this.state.rawHTML,
            })
          },
          children: (
            <div style={{minWidth: '960px', padding: '10px 10px'}}>
              <TextArea autosize={{ minRows: 4, maxRows: 12 }}
                        defaultValue={this.state.outputHTML}
                        onChange={this.toRawHtml}
              />
            </div>
          ),
        }
      }
    ];
    return (
      <div>
        <BraftEditorElem
          placeholder="post body"
          excludeControls={excludeControls}
          extendControls={extendControls}
          defaultValue = {this.state.editorState}
          value = {this.state.editorState}
          onChange = {this.handleChange}
        />
        {/*<div>输出内容</div>*/}
        {/*<TextArea autosize={{ minRows: 4 }}*/}
                  {/*value={this.state.outputHTML} />*/}
      </div>

    );
  }

}
