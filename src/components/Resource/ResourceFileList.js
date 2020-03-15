import React, {Component} from 'react';
import ColorTag from '../Common/ColorTag'
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model';
import controller, {requireModel} from '@symph/joy/controller'
import config from '../../services/config'
import {timeFormat} from '../../utils';
import {List, Avatar, message, Button, Tag} from 'antd';
import {default as configs} from '../../services/config';


@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})

export default class ResourceFileList extends Component {

  state = {
    initLoading: true,
    loading: false,
    filetypes: [{
      name: 'png',
      checked: true,
    },{
      name: 'jpg',
      checked: false,
    },{
      name: 'mp3',
      checked: false,
    }],
    checkedMember: 0,
    uploading: false,
    hide: () => null,
  };

  componentDidMount() {
    this.setState({
      hide: message.loading('载入数据中...', 0),
      loading: true,
    });
    this.props.dispatch({
      type: 'model/filelistbytype',
      payload: {
        fileType: this.state.filetypes[this.state.checkedMember].name
      }
    }).then(() => {
      this.state.hide();
      this.setState({
        initLoading: false,
        loading: false,
      })
    });
  }

  load = (tag, index) => {
    let ps = JSON.parse(JSON.stringify(this.state.filetypes));
    ps.forEach((p, ind) => {
      p.name = this.state.filetypes[ind].name;
      ind === index ? p.checked = true : p.checked = false
    });
    this.setState({
      initLoading: false,
      loading: true,
      checkedMember: index,
      filetypes: ps,
      hide: message.loading(`载入${tag}数据中...`, 0)
    });
    this.props.dispatch({
      type: 'model/filelistbytype',
      payload: {
        fileType: tag
      }
    }).then(() => {
      this.state.hide();
      this.setState({
        initLoading: false,
        loading: false,
      });
    });
  };

  render() {
    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={this.onLoadMore}>loading more</Button>
        </div>
      ) : null;
    const { initLoading, loading } = this.state;
    return (
      <>
        <Head>
          <title>Dashboard / Resource Files</title>
        </Head>
        <h2 style={{ marginBottom: 20 }}>资源列表</h2>
        <div>
          {
            this.state.filetypes && this.state.filetypes.map((item, index) => {
              return (
                  <ColorTag
                    key={item.name}
                    nm={item.name}
                    cb={(tag) => {this.load(tag, index)}}
                    checked={item.checked}
                  />
              )
            })
          }
        </div>
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          loadMore={loadMore}
        >
          {
            this.props.model.files.map(item => {

                return item.FileNo > 172 ? (
                  <List.Item key={item.hashId}>
                    <List.Item.Meta
                      avatar={
                        this.state.checkedMember === 1 || this.state.checkedMember === 0 ?
                        <Avatar src={`${configs.fileRootUrl}${item.src}`} alt={"非图像文件"} />
                        : <Avatar src={`#`} alt={"非图像文件"} />
                      }
                      title={<a target={"_blank"}
                        href={`${config.fileUrl}/${config.filemodules.nekofile}/${item.fileId}/`}>
                        {decodeURIComponent(item.fileName)}
                      </a>}
                      description={timeFormat(item.modifiedAt)+ ' - ' + item.FileNo}
                    />
                  </List.Item>
                ) :
                  (
                    <List.Item key={item.hashId}>
                      <List.Item.Meta
                        avatar={
                          this.state.checkedMember === 1 || this.state.checkedMember === 0 ?
                            <Avatar src={`${configs.fileRootUrl}/${item.fileId}_${item.fileName}`} alt={"非图像文件"} />
                            : <Avatar src={`#`} alt={"非图像文件"} />
                        }
                        title={<a target={"_blank"}
                                  href={`${config.fileUrl}/${config.filemodules.nekofile}/${item.fileId}/`}>
                          {decodeURIComponent(item.fileName)}
                        </a>}
                        description={timeFormat(item.modifiedAt)+ ' - ' + item.FileNo}
                      />
                    </List.Item>
                  )
            })
          }
        </List>
      </>
    )
  }
};
