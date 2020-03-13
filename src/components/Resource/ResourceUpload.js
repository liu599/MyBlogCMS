import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model';
import controller, {requireModel} from '@symph/joy/controller'
import {Button, message, Card, Upload, Icon, Input} from 'antd';
import {default as configs} from '../../services/config';

@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})

export default class ResourceUpload extends Component {

  state = {
    fileList: [],
    uploadingFilename: 'rqst.png',
    relativePathName: '',
    createdAt: 0,
    uploading: false,
  };

  handleChange = (info) => {
    console.log(info, 'jkdlaf');
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (info.file.status === 'done') {
      info.fileList = info.fileList.map(file => {
        if (file.response) {
          // Component will show file.url as link
          // file.url = file.response.url;
          console.log(file.response);
          let fname = file.response["file_name"];
          let relativePath = file.response["file_relative_path"];
          file.url =`${configs.fileRootUrl}${relativePath}${fname[0]}`;
        }
        return file;
      });
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    this.setState({
      uploadingFilename: info.file.name,
      createdAt: info.file.lastModified * 0.001,
      fileList: [...info.fileList] });
  };

  render() {
    let props = {
      action: `${(configs.fileUrl)}/${configs.filemodules.upload}`,
      listType: 'picture',
      data: {
        name: this.state.uploadingFilename,
        email: "970228409@qq.com",
        createdAt: this.state.createdAt,
        relativePath: this.state.relativePathName,
      },
      onChange: this.handleChange,
      defaultFileList: [],
    };
    return (
      <>
        <Head>
          <title>Dashboard / ResouceUpload</title>
        </Head>
        <h2 style={{ marginBottom: 20 }}>资源上传</h2>
        <div style={{ marginBottom: 20 }}>
          <Input defaultValue={"/"}
                 onChange={(e) => {this.setState({
                   relativePathName: e.target.value
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
      </>
    )
  }
};
