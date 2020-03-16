import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model'
import {Form, Input, Button, Checkbox, Icon, List, Table, Popconfirm} from 'antd';
import controller, {requireModel} from "@symph/joy/controller";
import {timeFormat} from '../../utils'

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);



@requireModel(DashboardModel)
@controller(state => ({model: state.model}))

class UserList extends Component {

  state = {
    dataSource: [],
  };

  handleDelete = (record) => {
    console.log(record);
  };

  columns = [
    {
      title: "序列",
      dataIndex: "uid",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "识别代码",
      dataIndex: "userid",
      width: 220,
    },
    {
      title: "注册邮箱",
      dataIndex: "mail",
      width: 260,
    },
    {
      title: "注册时间",
      dataIndex: "createdAt",
      render: time => (
        <b>{timeFormat(time)}</b>
      ),
      width: 200,
    },{
      title: "最后登录时间",
      dataIndex: "loggedAt",
      render: time => (
        <b>{timeFormat(time)}</b>
      ),
      width: 200,
    },{
      title: '操作',
      dataIndex: '',
      key: 'x',
      width: 200,
      render: (text, record) => {
        if (record.key === "new") {
          return (
            <div>
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)} style={{ marginRight: 16 }} >
                <Button type={"danger"} style={{ marginRight: 16 }}>Delete</Button>
              </Popconfirm>
              <Popconfirm title="Save" onConfirm={() => this.handleSave(record.key)}>
                <Button type={"primary"}>Save</Button>
              </Popconfirm>
            </div>
          )} else {
            return this.props.model.userList.length >= 1 && record.uid !== 1 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <Button type={"danger"}>Delete</Button>
              </Popconfirm>
            ) : null;
          }
        }
    },
  ];

  handleSave = (record) => {
    console.log(record);
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'model/getUsers',
      payload: {
        token: window.localStorage.getItem("nekohand_token"),
        uid: window.localStorage.getItem("nekohand_administrator"),
      }
    }).then(() => {
      this.setState({
        dataSource:  this.props.model.userList,
      });
    });
    console.log(this.props.model);
  }

  handleAdd = (record) => {
    const { dataSource } = this.state;
    const newData = {
      key: "new",
      uid: this.state.dataSource.length + 1,
      name: "adfadfasdf",
      userid: "待定",
      mail: "b@b",
      createdAt: new Date().getTime()*0.001,
      loggedAt: new Date().getTime()*0.001,
    };
    this.setState({
      dataSource: [...dataSource, newData]
    })
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.props);
    const {form: {validateFields}, dispatch} = this.props;

    validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        await dispatch({
          type: 'model/loginNew',
          payload: values,
        });

      }
    });
  };

  handleRowSelectionChange = enable => {
    this.setState({ rowSelection: enable ? {} : undefined });
  };


  render() {
    const { dataSource, rowSelection } = this.state;
    console.log(this.props.model, "222");
    const {form: {getFieldDecorator}} = this.props;
    return (
      <React.Fragment>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16, marginRight: 16 }}>
          注册用户
        </Button>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16, marginRight: 16 }}>
          修改密码
        </Button>
        {dataSource.length > 0 ?
          <Table bordered={true}
                 pagination={{ pageSize: 50 }}
                 scroll={{ y: 240 }}
                 rowSelection={this.handleRowSelectionChange}
                 rowKey={record => record.userid}
                 dataSource={dataSource}
                 columns={this.columns} /> : null }
      </React.Fragment>

    )
  }
}

export default Form.create()(UserList)
