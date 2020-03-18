import React, {Component} from 'react';
import Head from '@symph/joy/head';
import DashboardModel from '../../models/model'
import {Form, Input, Button, Checkbox, Icon, List, Table, Popconfirm} from 'antd';
import controller, {requireModel} from "@symph/joy/controller";
import autowire from '@symph/joy/autowire';
import {timeFormat} from '../../utils';
import styles from './UserList.less';
// import {EditableCell} from './EditableCell';

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    console.log("save?");
    const { record, handleSave } = this.props;
    console.log(record);
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className={styles.wrapper}
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

// @requireModel(DashboardModel)
@controller(state => ({model: state.model}))

class UserList extends Component {

  @autowire()
  aimiModel:  DashboardModel;

  state = {
    dataSource: [],
  };

  handleDelete = (record) => {
    console.log(record);
  };

  handleRegistor = record => {
    console.log(record, 'record');
    this.aimiModel.fetchServerStatus().then((password) => {
      this.aimiModel.createUser({
        payload: {
          username: record.name,
          password: password,
          email: record.mail,
        }
      });
      console.log("pwd", password);
    });
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
      editable: true,
    },
    {
      title: "用户ID",
      dataIndex: "userid",
      width: 220,
    },
    {
      title: "注册邮箱",
      dataIndex: "mail",
      width: 260,
      editable: true,
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
        if (record.ky === "new") {
          return (
            <div>
              <Popconfirm title="确认删除数据？" onConfirm={() => this.handleDelete(record.key)} style={{ marginRight: 16 }} >
                <Button type={"danger"} style={{ marginRight: 16 }}>Delete</Button>
              </Popconfirm>
              <Popconfirm title="确认创建？" onConfirm={() => this.handleRegistor(record)}>
                <Button type={"primary"}>Save</Button>
              </Popconfirm>
            </div>
          )} else {
            return this.props.model.userList.length >= 1 && record.uid !== 1 && record.uid !== 2 ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <Button type={"danger"}>Delete</Button>
              </Popconfirm>
            ) : null;
          }
        }
    },
  ];

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
      ky: "new",
      uid: this.state.dataSource.length + 1,
      name: "adfadfasdf",
      userid: `待定${new Date().getTime()}`,
      mail: "114514@1919.com",
      createdAt: Math.floor(new Date().getTime()*0.001),
      loggedAt: Math.floor(new Date().getTime()*0.001),
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

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.userid === item.userid);
    console.log(index);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log(newData, 777);
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource, rowSelection } = this.state;
    const {form: {getFieldDecorator}} = this.props;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      }
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <React.Fragment>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16, marginRight: 16 }}>
          注册用户
        </Button>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16, marginRight: 16 }}>
          修改密码
        </Button>
        {dataSource.length > 0 ?
          <Table bordered
                 components={components}
                 pagination={{ pageSize: 50 }}
                 scroll={{ y: 720 }}
                 rowSelection={{}}
                 rowClassName={() => 'editable-row'}
                 rowKey={record => record.userid}
                 dataSource={dataSource}
                 columns={columns} /> : null }
      </React.Fragment>

    )
  }
}

export default Form.create()(UserList)
