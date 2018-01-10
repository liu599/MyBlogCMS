import React from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import lodash from 'lodash';
import { routerRedux } from 'dva/router';

const ArticleCategory = ({
  dispatch,
  categories,
}) => {
  const categoriesEditHandler = (text, record, index, deleteFlag) => {
    if (!deleteFlag) {
      dispatch(routerRedux.push({
        pathname: '/dashboard/article-category-edit',
        query: {
          index,
        },
      }));
    } else {
      dispatch({ type: 'article/categoryDelete', payload: { cid: record.cid } });
    }
  };
  const data = lodash.cloneDeep(categories);
  data.forEach((item) => {
    item.key = item.cid;
  });
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
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => { return categoriesEditHandler(text, record, index); }}>Edit</Button>
        <Button type="danger" onClick={() => { return categoriesEditHandler(text, record, index, true); }}>Delete</Button>
      </span>
    ),
  }];
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Categories</h2>
      <div style={{ marginBottom: 20 }}>
        <Button type="primary" style={{ marginRight: 10 }} onClick={() => { return categoriesEditHandler(); }}>Create</Button>
      </div>
      <Table dataSource={data} columns={columns} />
    </div>
  );
};


ArticleCategory.propTypes = {
};

const mapStateToProps = (state) => {
  return {
    categories: state.article.articleCategories,
  };
};

export default connect(mapStateToProps, null)(ArticleCategory);
