import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model'
import { Table, Button, Pagination, message } from 'antd';
import controller, {requireModel} from '@symph/joy/controller'

@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})

export default class ArticleCategory extends Component {
  
  state = {
    hide: () => null,
  };
  
  componentWillMount() {
    this.setState({
      hide: message.loading('载入数据中...', 0)
    });
  }
  
  componentDidMount() {
    this.props.dispatch({
      type: 'model/fetchCategories'
    }).then(() => {
      this.state.hide();
    });
  }
  
  
  
  data = [
    {
      key: 'cat-1',
      cid: '1',
      cname: '计算机',
      cinfo: '计算机技术',
    }
  ];
  columns = [{
    title: 'id',
    dataIndex: 'cid',
    width: '10%',
  }, {
    title: 'name',
    dataIndex: 'cname',
    width: '30%',
  }, {
    title: 'description',
    dataIndex: 'cinfo',
    width: '30%',
  }, {
    title: 'operation',
    dataIndex: 'operation',
    width: '30%',
    render: (text, record, index) => (
      <span>
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => { console.log('edit') }}>Edit</Button>
        <Button type="danger" onClick={() => { console.log('delete') }}>Delete</Button>
      </span>
    ),
  }];
  render() {
    return (
      <>
        <Head>
          <title>Dashboard / Category</title>
        </Head>
        <h2 style={{ marginBottom: 20 }}>文章分类</h2>
        <div style={{ marginBottom: 20 }}>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => { console.log('create') }}>Create</Button>
        </div>
        <Table
          dataSource={this.props.model.categories}
          columns={this.columns} />
      </>
    )
  }
  
}
