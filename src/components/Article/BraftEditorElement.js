import React from 'react';
import BraftEditorElem from 'braft-editor';
import { ContentUtils } from 'braft-utils';
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
    editorState: BraftEditorElem.createEditorState('<p>删除这段话来开始编辑内容</p>'),
    readOnly: true,
    rawHTML: '<p>删除这段话来开始编辑内容</p>',
  };

  componentDidMount() {
    // console.log('component did mount');
    this.props.onRef(this);
    //组件库
    this.braftFinder = this.editorInstance.getFinderInstance();
    let self = this;
    // console.log(this.props.location.search, "search", this.props.initState);
    if (window && window.location.pathname.includes('edit')) {
      this.setState({
        readOnly: false,
        editorState: BraftEditorElem.createEditorState(lodash.cloneDeep(this.props.initState.body)),
        rawHTML: this.props.initState.body,
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
        readOnly: false,
        rawHTML: '<p>New Article</p>',
      });
    }
  }

  handleChange =  (editorState) => {
     // console.log(typeof editorState.toHTML, 'editor state', editorState)
    let self = this;
    this.setState({
      editorState,
      rawHTML: editorState.toHTML(),
    });
    lodash.debounce(() => {
      self.props.setValue(self.state.editorState.toHTML());
    }, 300, {'maxWait': 1000});
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

  saveCurrent = () => {
    this.props.setValue(this.state.editorState.toHTML());
  };


  toRawHtml =  (e) => {
      // console.log('new HTML', e.currentTarget.value);
      // let regEx_style = `<[\\s]*?style[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?style[\\s]*?>`;
      // let bbb = regEx_style.match(e.currentTarget.value);
      // console.log(bbb);
      this.setState({
        rawHTML: e.currentTarget.value,
      })
  };

  addMediaItem = () => {
    // 使用braftFinder.addItems来添加媒体到媒体库
    this.braftFinder.addItems([
      {
        id: new Date().getTime(),
        type: 'IMAGE',
        url: 'https://margox.cn/wp-content/uploads/2017/05/IMG_4995-480x267.jpg'
      }
    ])
  };

  insertMediaItem = () => {
    // 使用ContentUtils.insertMedias来插入媒体到editorState
    const editorState = ContentUtils.insertMedias(this.state.editorState, [
      {
        type: 'IMAGE',
        url: 'https://margox.cn/wp-content/uploads/2017/05/IMG_4995-480x267.jpg'
      }
    ]);

    // 更新插入媒体后的editorState
    this.setState({ editorState })

  }

  render() {
    const excludeControls = [
      'letter-spacing',
      'line-height',
      'clear',
      'superscript',
      'subscript',
      'hr',
    ];

    const extendControls = [
      'media',
      {
        key: 'custom-save',
        type: 'button',
        text: '保存数据',
        onClick: this.saveCurrent
      },
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
            this.setState({
              editorState: BraftEditorElem.createEditorState(this.state.rawHTML),
              rawHTML: this.state.rawHTML,
            })
          },
          children: (
            <div style={{minWidth: '960px', padding: '10px 10px'}}>
              <TextArea autosize={{ minRows: 4, maxRows: 12 }}
                        defaultValue={this.state.rawHTML}
                        onChange={this.toRawHtml}
              />
            </div>
          ),
        }
      },
      'separator',
      {
        key: 'add-media',
        type: 'button',
        text: '插入图片到媒体库',
        onClick: this.addMediaItem
      }, {
        key: 'insert-media',
        type: 'button',
        text: '插入图片到编辑器',
        onClick: this.insertMediaItem
      }
    ];
    // console.log(this.state.editorState, "editorState");
    return (
      <div>
        <BraftEditorElem
          ref={instance => this.editorInstance = instance}
          placeholder="write post here."
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
