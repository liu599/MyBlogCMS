import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model';
import controller, {requireModel} from '@symph/joy/controller'
import {routerRedux} from '@symph/joy/router';
import config from '../../services/config'
import {timeFormat} from '../../utils'
import lodash from 'lodash';
import {Button, Table} from 'antd';

@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})

export default class ResourceList extends Component {
  
  columns = [{
    title: '序号',
    dataIndex: 'fid',
    width: '10%',
  }, {
    title: '上传时间',
    dataIndex: 'modifiedAt',
    width: '20%',
    render: (text, record, index) => (
      <span>
        {timeFormat(record.modifiedAt)}
      </span>
    )
  }, {
    title: '标题',
    dataIndex: 'filename',
    width: '20%',
  }, {
    title: '预览',
    dataIndex: 'preview',
    width: '40%',
    render: (text, record, index) => (
      <span>
        <img key={record.fileid} src={`${config.fileUrl}/${config.filemodules.nekofile}/${record.fileid}/`} alt="" style={{width: 200, height: 'auto'}}/>
      </span>
    )}
  ];
  
  
  componentDidMount() {
    this.props.dispatch({
      type: 'model/filelist'
    });
  }
  
  
  
  render() {
    return (
      <>
        <Head>
          <title>Dashboard / ResouceList</title>
        </Head>
        <h2 style={{ marginBottom: 20 }}>资源列表</h2>
        <div style={{ marginBottom: 20 }}>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
            this.props.dispatch(routerRedux.push('/dashboard/resource-list/upload'));
          }}>Upload</Button>
        </div>
        <Table
          scroll={{ y: 1200 }}
          dataSource={this.props.model.files}
          columns={this.columns}
        />
      </>
    )
  }
};
