import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model'
import { Form, Input, InputNumber, Table, Button, Pagination, Popconfirm, message } from 'antd';
import controller, {requireModel} from '@symph/joy/controller'
import {routerRedux} from '@symph/joy/router';
import lodash from 'lodash';
const FormItem = Form.Item;
const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})
export default class ArticleCategory extends Component {
  
  state = {
    hide: () => null,
    data: [],
  };
  
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  
  componentWillMount() {
    this.setState({
      hide: message.loading('载入数据中...', 0)
    });
  }
  
  edit = (record) => {
    this.props.dispatch(routerRedux.push(`/dashboard/article-category/edit/${record.id}`));
  };
  
  componentDidMount() {
    this.props.dispatch({
      type: 'model/fetchCategories'
    }).then(() => {
      this.state.hide();
      this.setState({
        ...this.state,
        data: lodash.cloneDeep(this.props.model.categories)
      })
    });
  }
  
  
  columns = [{
    title: 'id',
    dataIndex: 'cid',
    width: '10%',
    render: (text, record) => this.renderColumns(text, record, 'id'),
  }, {
    title: 'name',
    dataIndex: 'cname',
    width: '30%',
    render: (text, record) => this.renderColumns(text, record, 'name'),
  }, {
    title: 'description',
    dataIndex: 'cinfo',
    width: '30%',
    render: (text, record) => this.renderColumns(text, record, 'description'),
  }, {
    title: 'operation',
    dataIndex: 'operation',
    width: '30%',
    render: (text, record, index) => {
      const { editable } = record;
      return (
        <div className="operations">
          {
            editable ?
              <span>
                <Button size="small" type="primary" style={{ marginRight: 10 }} onClick={() => this.save(record.key)}>Save</Button>
                {/*<Popconfirm
                  title="Are you sure delete this category?"
                  onConfirm={() => {this.deleteCategory({
                              pid: record.id,
                              headers: {
                                Authorization: this.props.model.token || window.localStorage.getItem("nekohand_token"),
                                User: this.props.model.user || window.localStorage.getItem("nekohand_administrator"),
                              }
        });}}
                  okText="Yes" cancelText="No">
          <Button size="small" type="danger">Delete</Button>
        </Popconfirm>*/}
                <Button type="primary" size="small" style={{ marginRight: 10 }} onClick={() => { console.log('cancel') }}>Cancel</Button>
      </span>
              : <a onClick={() => this.edit(record.key)}>Edit</a>
          }
        </div>
      );
    },
  }];
  
  
  render() {
    return (
      <>
        <Head>
          <title>Dashboard / Category</title>
        </Head>
        <h2 style={{ marginBottom: 20 }}>文章分类</h2>
        <div style={{ marginBottom: 20 }}>
          <Button type="primary" style={{ marginRight: 10 }} onClick={() => {
            this.props.dispatch(routerRedux.push('/dashboard/article-category/create'));
          }}>Create</Button>
        </div>
        <Table
          dataSource={this.state.data}
          columns={this.columns} />
      </>
    )
  }
}
