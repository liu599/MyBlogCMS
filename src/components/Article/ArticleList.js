import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model'
import { Table, Button, Pagination, Popconfirm, message } from 'antd';
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

  componentDidMount() {
    if (window.localStorage.hasOwnProperty('nekohand_token') &&
      window.localStorage.hasOwnProperty('nekohand_administrator')) {
      this.setState({
        hide: message.loading('载入数据中...', 0)
      });
      this.props.dispatch({
        type: 'model/fetchPostsList',
        payload: {
          pageNumber: 1,
          pageSize: 50,
        }
      }).then(() => {
        this.state.hide();
      });
    } else {
      this.setState({
        hide: message.loading('未找到登陆信息， 即将返回', 1000)
      });
      setTimeout(() => {
        this.state.hide();
      }, 1000);
      setTimeout(() => {
        this.props.dispatch(routerRedux.push('/'));
      }, 1100);

    }

  }

  deletePost = (id) => {
    this.props.dispatch(
      {
        type: 'model/deletePost',
        payload: id,
      }
    ).then(res => {
      console.log('call back here');
      this.props.dispatch({
        type: 'model/fetchPostsList',
        payload: {
          pageNumber: 1,
          pageSize: 50,
        }
      })
    });
  };

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
          this.props.dispatch(routerRedux.push({
            pathname: "/dashboard/article-list/edit",
            search: require('query-string').stringify({
              pid: `${record.id}`,
            }),
          })) }}>Edit</Button>
        <Popconfirm title="Are you sure delete this post?" onConfirm={() => {this.deletePost({
          pid: record.id,
          headers: {
            Authorization: this.props.model.token || window.localStorage.getItem("nekohand_token"),
            User: this.props.model.user || window.localStorage.getItem("nekohand_administrator"),
          }
        });}} okText="Yes" cancelText="No">
          <Button type="danger">Delete</Button>
        </Popconfirm>

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
          scroll={{ y: 1200 }}
          dataSource={this.props.model.posts}
          columns={this.columns}
        />
      </div>
    );
  }

}
