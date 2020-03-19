import React, {Component} from 'react';
import Head from '@symph/joy/head';
import controller, {requireModel} from "@symph/joy/controller";
import autowire from '@symph/joy/autowire';
import AimiModel from "../../models/aimiModels";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Icon,
  message,
  notification,
  List,
  Table,
  Popconfirm, Tooltip
} from 'antd';
const FormItem = Form.Item;

@controller(state => ({aimiModel: state.aimiModel}))
class AimiTags extends Component {

  @autowire()
  aimi: AimiModel;

  state = {
    dataSource: [],
    btnStatus: true,
  };

  fetchData = () => {
    console.log("Fetch Tags");
    this.aimi.fetchAimiTags().then((dataSource) => {
      this.setState({
        dataSource,
        btnStatus: false,
      });
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  onSubmit = e => {
    const {form: {validateFields}, dispatch} = this.props;
    e.preventDefault();
    this.btnStatus = true;

    validateFields(async (err, data) => {
      data.token = window.localStorage.getItem("nekohand_token");
      data.uid = window.localStorage.getItem("nekohand_administrator");
      if(!data.tagname || !data.taglink) {
        message.error('信息不能为空');
        this.btnStatus = false;
        return null;
      }
      if (!/^[A-Za-z_]+$/.exec(data.taglink)) {
        message.error('标签链接只能为英文和下划线');
        this.btnStatus = false;
        return null;
      }
      let p0 = await this.aimi.updateAimiTag({
        payload: data
      });
      if (p0 && p0.success) {
        message.success("添加成功");
        this.fetchData();
      } else {
        if (p0.error) {
          message.warning(p0.error.code);
        }
      }
    })
  };

  columns = [
    {
      title: "序列",
      dataIndex: "ID",
      width: 80,
    },
    {
      title: "标签名称",
      dataIndex: "tagname",
      width: 120,
      editable: true,
    },
    {
      title: "标签路径",
      dataIndex: "taglink",
      width: 120,
      editable: true,
    },
    {
      title: "标签标识",
      dataIndex: "tagid",
      width: 180,
    },
    {
      title: "创建时间",
      dataIndex: "CreatedAt",
      render: time => (
        <b>{time.split("T")[0]}</b>
      ),
      width: 100,
    },{
      title: "修改时间",
      dataIndex: "UpdatedAt",
      render: time => (
        <b>{time.split("T")[0]}</b>
      ),
      width: 100,
    },{
      title: '操作',
      dataIndex: '',
      key: 'x',
      width: 200,
      render: (text, record) => {
        if (record.ID !== 1) {
          return (
            <div>
              <Popconfirm title="确认删除数据？" onConfirm={() => this.handleDelete(record.key)} style={{ marginRight: 16 }} >
                <Button type={"danger"} style={{ marginRight: 16 }}>删除</Button>
              </Popconfirm>
              <Button type={"primary"}>编辑</Button>
            </div>
          )} else {
          return (<b>默认标签, 无法更改</b>);
        }
      }
    },
  ];

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 4 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const {dataSource} = this.state;
    const {form: {getFieldDecorator}} = this.props;
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
        }),
      };
    });
    return (
      <React.Fragment>
        {dataSource.length > 0 ?
          <Table bordered
                 pagination={{ pageSize: 50 }}
                 scroll={{ y: 720 }}
                 rowSelection={{}}
                 rowClassName={() => 'editable-row'}
                 rowKey={record => record.tagid}
                 dataSource={dataSource}
                 columns={columns} /> : null }
            <h2>添加新Tag</h2>
            <Form {...formItemLayout}
                  onSubmit={this.onSubmit}>
              <FormItem
                label="标签名称: "
                hasFeedback
                className="fix-form" >
                {getFieldDecorator('tagname', {
                  rules: [
                    {
                      required: true,
                      message: '标签名称',
                    },
                  ],
                })(<Input
                  placeholder="标签名称"
                  prefix={<Icon type="container" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={
                    <Tooltip title="重复的名称无法得到添加">
                      <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                  }/>)}</FormItem>
              <FormItem
                label="标签名称: "
                hasFeedback
                className="fix-form" >
                {getFieldDecorator('taglink', {
                  rules: [
                    {
                      required: true,
                      message: '标签路径',
                    },
                  ],
                })(<Input
                  placeholder="标签路径， 必须为英文"
                  prefix={<Icon type="container" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={
                    <Tooltip title="重复的名称无法得到添加">
                      <Icon type="info-circle" style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>
                  }/>)}</FormItem>
              <Button type="primary"
                      disabled={this.state.btnStatus}
                      htmlType="submit">
                提交数据
              </Button>
          </Form>
      </React.Fragment>
    )
  }
}

export default Form.create()(AimiTags);
