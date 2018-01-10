/* global window */
import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Table, Button } from 'antd';
import { routerRedux } from 'dva/router';

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
  }),
};

const UserList =
  ({
    users,
    dispatch,
  }) => {
    const pagination = false;
    const userEditHandler = (text, record, index) => {
      console.log(text, record, index, '222222');
      dispatch(routerRedux.push({
        pathname: '/dashboard/user-list/edit',
        query: {
          index,
        },
      }));
    };
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Nick',
        dataIndex: 'nick',
      },
      {
        title: 'Mail',
        dataIndex: 'mail',
      },
      {
        title: 'Created',
        dataIndex: 'created',
      },
      {
        title: 'Logged',
        dataIndex: 'logged',
      },
      {
        title: 'Operation',
        key: 'operation',
        render: (text, record, index) => (
          <span>
            <Button type="primary" onClick={() => { return userEditHandler(text, record, index); }}>Edit</Button>
          </span>
        ),
      },
    ];

    if (JSON.stringify(users) !== '{}') {
      const dataSource = users.map((user, index) => {
        return {
          key: index,
          name: user.name,
          nick: user.nick,
          intro: user.intro,
          created: window.timeFormat(user.created),
          logged: window.timeFormat(user.logged),
          mail: user.mail,
          url: user.url,
        };
      });
      console.log(dataSource, 'dataSource');
      return (
        <div>
          <h2 style={{ marginBottom: 20 }}>
            User List
          </h2>
          <Table pagination={pagination} columns={columns} rowSelection={rowSelection} dataSource={dataSource} />
        </div>
      );
    }
    return (
      <div>数据加载中...</div>
    );
  };


UserList.propTypes = {
};

const mapStateToProps = (state) => {
  return {
    users: state.users,
  };
};

export default connect(mapStateToProps, null)(UserList);
