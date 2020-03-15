import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model';
import controller, {requireModel} from '@symph/joy/controller'
import config from '../../services/config'
import {timeFormat} from '../../utils'
import {Button, message, Card, Upload, Icon, Input} from 'antd';
const { Meta } = Card;
import Masonry from 'react-masonry-component';
import {default as configs} from '../../services/config';



const masonryOptions = {
  transitionDuration: 300,
  fitWidth: true
};

const imagesLoadedOptions = { background: '.my-bg-image-el' }


@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})

export default class ResourceList extends Component {

  state = {
    fileList: [],
    relativePathName: '',
    uploading: false,
  };

  handleChange = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.setState({ fileList: [...info] });
  };

  componentDidMount() {
    // this.props.dispatch({
    //   type: 'model/filelist'
    // });
    this.props.dispatch({
      type: 'model/filelistbytype',
      payload: {
        fileType: 'png'
      }
    });

  }

  render() {
    const props = {
      action: `${(configs.fileUrl)}/${configs.filemodules.upload}`,
      listType: 'picture',
      data: {
        name: "0000001.png",
        email: "jkljkjadsfa.asdfa@qq.com",
        relativePath: this.state.relativePathName,
      },
      onChange: this.handleChange,
      defaultFileList: [],
    };
    return (
      <>
        <Head>
          <title>Dashboard / ResouceList</title>
        </Head>
        <h2 style={{ marginBottom: 20 }}>资源列表</h2>
        <div style={{ marginBottom: 20 }}>
          <Input defaultValue={"/"}
                 onChange={(value) => {this.setState({
                   relativePathName: value
                 })}}
                 placeholder="创建资源的相对路径" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <Upload {...props}
                  fileList={this.state.fileList}
                  supportServerRender
                  multiple
                  onRemove={() => {
                  this.props.dispatch({
                    type: 'model/filelistbytype',
                    payload: {
                      fileType: 'png'
                    }
                  });
          }}>
            <Button>
              <Icon type="upload" /> Upload
            </Button>
          </Upload>
        </div>
        <Masonry
          className={'my-gallery-class'} // default ''
          elementType={'ul'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
          imagesLoadedOptions={imagesLoadedOptions} // default {}
        >
            {
              this.props.model.files.map(item => {
                return (
                  <li key={item.hashId} className="image-element-class" style={{listStyle: 'none', padding: 8}}>
                    <Card
                      hoverable
                      key={item.FileNo}
                      style={{ width: 240 }}
                      actions={[
                        <Icon type="setting" key="setting" />,
                        <Icon type="edit" key="edit" />,
                        <Icon type="ellipsis" key="ellipsis" />,
                      ]}
                      cover={<img key={item.hashId}
                                  alt="this file cannot be downloaded"
                                  data-src={`${config.fileUrl}/${config.filemodules.nekofile}/${item.fileId}/`}
                                  src={`${config.fileUrl}/${config.filemodules.nekofile}/${item.fileId}/`} />
                      }
                    >
                      <Meta
                        key={item.hashId}
                        title={item.hashId}
                        description={timeFormat(item.modifiedAt)}
                      />
                    </Card>
                  </li>
                )
              })
            }
        </Masonry>
      </>
    )
  }
};
