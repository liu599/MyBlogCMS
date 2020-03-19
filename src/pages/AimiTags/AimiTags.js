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
  List,
  Table,
  Popconfirm
} from 'antd';
import {timeFormat} from "../../utils";

@controller(state => ({aimiModel: state.aimiModel}))
export default class AimiTags extends Component {

  @autowire()
  aimi: AimiModel;

  state = {
    dataSource: [],
  };

  componentDidMount() {
    this.aimi.fetchAimiTags().then((dataSource) => {
      console.log(dataSource);
      this.setState({
        dataSource,
      });
    });
  }

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
      width: 100,
      editable: true,
    },
    {
      title: "标签标识",
      dataIndex: "tagid",
      width: 220,
    },
    {
      title: "数量",
      dataIndex: "Aimifiles",
      width: 60,
      render: files => (
        files !== null ? 1 : 0
      ),
    },
    {
      title: "创建时间",
      dataIndex: "CreatedAt",
      render: time => (
        <b>{time.split("T")[0]}</b>
      ),
      width: 160,
    },{
      title: "修改时间",
      dataIndex: "UpdatedAt",
      render: time => (
        <b>{time.split("T")[0]}</b>
      ),
      width: 160,
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
          return (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <Button type={"danger"}>Delete</Button>
            </Popconfirm>
          )

        }
      }
    },
  ];

  render() {
    const {dataSource} = this.state;
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
      </React.Fragment>
    )
  }
}
