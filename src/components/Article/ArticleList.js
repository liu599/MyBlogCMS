import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model'
import { Table, Button, Pagination, message } from 'antd';
import controller, {requireModel} from '@symph/joy/controller'
import {routerRedux} from '@symph/joy/router';

@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})
export default class ArticleList extends Component {
  
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
      type: 'model/fetchPostsList',
      payload: {
        pageNumber: 1,
        pageSize: 20,
      }
    }).then(() => {
      this.state.hide();
    });
  }
  
  columns = [{
    title: '序号',
    dataIndex: 'pid',
    width: '10%',
  }, {
    title: '标题',
    dataIndex: 'title',
    width: '30%',
  }, {
    title: '分类',
    dataIndex: 'category',
    width: '30%',
  }, {
    title: '操作',
    dataIndex: 'operation',
    width: '30%',
    render: (text, record, index) => (
      <span>
        <Button type="primary" style={{ marginRight: 10 }} onClick={(e) => {
          console.log('ee', record);
          this.props.dispatch(routerRedux.push(`/dashboard/article-list/edit/${record.id}`)) }}>Edit</Button>
        <Button type="danger" onClick={() => { console.log('delete')}}>Delete</Button>
      </span>
    ),
  }];
  
  render() {
    return (
      <div>
        <Head>
          <title>Dashboard / Article</title>
        </Head>
        <h2 style={{ marginBottom: 20 }}>文章列表</h2>
        <div style={{ marginBottom: 20 }}>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
            this.props.dispatch(routerRedux.push('/dashboard/article-list/create'));
          }}>Create</Button>
        </div>
        <Table
          dataSource={this.props.model.posts}
          columns={this.columns}
        />
      </div>
    );
  }
  
}
