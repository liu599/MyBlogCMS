import React from 'react';
import Head from '@symph/joy/head';
import request from '../../utils/request';
import { Table, Button, Pagination } from 'antd';


export default () => {
  
  
  const data = [
    {
      id: 1,
      key: 'afsf',
      title: 'page',
      slug: 'slg'
    }
  ];
  
  const columns = [{
    title: 'id',
    dataIndex: 'id',
    width: '10%',
  }, {
    title: 'title',
    dataIndex: 'title',
    width: '30%',
  }, {
    title: 'slug',
    dataIndex: 'slug',
    width: '30%',
  }, {
    title: 'operation',
    dataIndex: 'operation',
    width: '30%',
    render: (text, record, index) => (
      <span>
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => { console.log('edit') }}>Edit</Button>
        <Button type="danger" onClick={() => { console.log('delete')}}>Delete</Button>
      </span>
    ),
  }];
  
  const onc = () => {
    request({
      url: 'https://www.blog.nekohand.moe/api/nekohand/v2/backend/status',
      method: 'get',
    });
  };
  
  return (
    <div>
      <Head>
        <title>Dashboard / Article</title>
      </Head>
      <h2 style={{ marginBottom: 20 }}>文章列表</h2>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
          onc();
        }}>Create</Button>
      </div>
      <Table
        dataSource={data}
        columns={columns}
      />
    </div>
  )
}