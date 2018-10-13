import React from 'react';
import Head from '@symph/joy/head';
import { Table, Button, Pagination } from 'antd';

export default () => {
  const data = [
    {
      key: 'cat-1',
      cid: '1',
      cname: '计算机',
      cinfo: '计算机技术',
    }
  ];
  const columns = [{
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
  return (
    <>
      <Head>
        <title>Dashboard / Category</title>
      </Head>
      <h2 style={{ marginBottom: 20 }}>文章分类</h2>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => { console.log('create') }}>Create</Button>
      </div>
      <Table dataSource={data} columns={columns} />
    </>
  )
}