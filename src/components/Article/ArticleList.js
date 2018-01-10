import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import { routerRedux } from 'dva/router';
import { Table, Button, Pagination } from 'antd';
import PropTypes from 'prop-types';

const ArticleList = ({
  loading,
  dispatch,
  articleList,
  articlePager,
}) => {
  const articleEditHandler = (text, record, index, deleteFlag) => {
    if (!deleteFlag) {
      dispatch(routerRedux.push({
        pathname: '/dashboard/article-edit',
        query: {
          index,
        },
      }));
    } else {
      dispatch({ type: 'article/articleDelete', payload: { pid: record.pid } });
    }
  };
  const onPageChange = (page, pageSize) => {
    console.log(page, pageSize);
    dispatch({
      type: 'article/fetchArticles',
      payload: {
        start: (page - 1) * pageSize,
        count: pageSize,
      },
    });
  };
  const showTotalFunc = (total, range) => `${range[0]}-${range[1]} of ${total} items`;
  const data = lodash.cloneDeep(articleList);
  const pager = lodash.cloneDeep(articlePager);
  data.forEach((item) => {
    item.key = item.pid;
  });
  const columns = [{
    title: 'id',
    dataIndex: 'pid',
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
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => { return articleEditHandler(text, record, index); }}>Edit</Button>
        <Button type="danger" onClick={() => { return articleEditHandler(text, record, index, true); }}>Delete</Button>
      </span>
    ),
  }];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Article</h2>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => { return articleEditHandler(); }}>Create</Button>
      </div>
      <div style={{ marginBottom: 20, textAlign: 'right' }}>
        <Pagination
          onChange={onPageChange}
          total={pager.total}
          showTotal={showTotalFunc}
          pageSize={pager.count}
          current={pager.page}
          defaultCurrent={1}
        />
      </div>
      <Table
        loading={loading.effects.login}
        dataSource={data}
        columns={columns}
        pagination={{
          defaultCurrent: 1,
          pageSize: pager.count,
          total: pager.total,
          current: pager.page,
          showTotal: showTotalFunc,
          onChange: onPageChange,
        }}
      />
    </div>
  );
};


ArticleList.propTypes = {
  dispatch: PropTypes.func,
  loading: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    articleList: state.article.articleList,
    articlePager: state.article.articlePager,
  };
};

export default connect(mapStateToProps, null)(ArticleList);
