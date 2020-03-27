import React, {Component} from 'react';
import Head from '@symph/joy/head';
import controller, {requireModel} from "@symph/joy/controller";
import produce from "immer";
import autowire from '@symph/joy/autowire';
import AimiModel from "../../models/aimiModels";
import styles from './AimiPictures.less';
import {
  Transfer, Switch,
  Menu,
  Select,
  Modal,
  Form,
  Input,
  Button,
  Dropdown,
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
class AimiPictures extends Component {

  @autowire()
  aimi: AimiModel;

  state = {
    tags: [],
    targetKeys: [],
    selectedKeys: [],
    disabled: false,
    currentEditData: {},
    dataSource: [],
    pagination: {
      defaultPageSize: 20,
      size: "medium",
      showQuickJumper: true,
      pageSize: 20,
    },
    btnStatus: true,
    loading: false,
    ModalText: '标签列表',
    visible: false,
    confirmLoading: false,
    rowSelection: undefined,
    rowSelectionData: [],
    rowSelectionTags: [],
  };

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      this.setState({
        rowSelectionData: selectedRows,
      })
    },
    onSubmit: () => {
      let {rowSelectionData, rowSelectionTags, pagination} = this.state;
      let submitData = produce(rowSelectionData, draft => {
        draft.forEach(item => item.Tags = rowSelectionTags);
      });
      console.log(submitData, "JJJ");
      this.aimi.updateAimiPictureTags({
        payload: submitData,
      }).then((success) => {
        if (success) {
          message.success("修改成功");
          setTimeout(() => {
            this.fetchData({
              tagid: "5e50152d58adfe5f36e095f5",
              pagenum: pagination.current,
              pagesize: 20,
            });
            this.setState({
              visible: false,
              confirmLoading: false,
              rowSelection: undefined,
              rowSelectionData: [],
              rowSelectionTags: [],
            });
          }, 2000);
        } else {
          message.warning("Error!")
        }
      });
    }
  };

  formRef = React.createRef();

  onReset = () => {
    // console.log(this.formRef.current, this.props.form);
    this.props.form.resetFields();
  };

  showModal = (record) => {
    console.log(this.state.tags, 'sadfasdf');
    this.setState({
      currentEditData: record,
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    let {tags, targetKeys, currentEditData} = this.state;
    console.log(this.state.targetKeys, "ready to submit");

    let data = {
      FileId: currentEditData.fileId,
      ID: currentEditData.ID,
      Tags: [],
    };
    targetKeys.forEach(item => {
      for (let i =0; i< tags.length; i+=1) {
        if (item === tags[i].tagid && tags[i].ID !== 1) {
          data.Tags.push({
            TagId: item,
            TagName: tags[i].tagname,
            ID: tags[i].ID,
            TagLink: tags[i].taglink,
          })
        }
      }
    });

    console.log(data, "submitData");

    this.aimi.updateAimiPictureTags({
      payload: [data],
    }).then((success) => {
      if (success) {
        message.success("修改成功");
        setTimeout(() => {
          this.setState({
            visible: false,
            confirmLoading: false,
            targetKeys: [this.state.tags[0].key],
          });
        }, 2000);

      } else {
        message.warning("Error!")
      }
    });
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  handleDelete = (record) => {
   console.log(record);
  };

  handleEdit = (record) => {
    this.showModal(record);
    console.log(record, "record");
  };

  fetchTagData = () => {
    this.aimi.fetchAimiTags().then((tags) => {
      /*this.setState({
        tags,
        targetKeys: tags.filter(item => item.key !== "5e50152d58adfe5f36e095f5").map(item => item.key),
        selectedKeys: [tags[0].key],
      })*/
      this.setState({
        tags,
        targetKeys: [tags[0].key],
        selectedKeys: [],
      })
    });
  };

  fetchData = ({tagid, pagenum, pagesize}) => {
    this.setState({loading: true});
    this.aimi.fetchAimiPictures({
      payload: {
        tagid,
        pagenum,
        pagesize,
      }
    }).then((res) => {
      console.log(res.pager, this.props.aimiModel.pager, "pager");
      this.setState({
        dataSource: res.data,
        pagination: {
          ...this.props.aimiModel.pager,
          total: parseInt(res.pager.total, 10),
          current: parseInt(pagenum, 10),
        },
        btnStatus: false,
        loading: false,
      });
    });
  };

  componentDidMount() {
    this.fetchTagData();
    this.fetchData({
      tagid: "5e50152d58adfe5f36e095f5",
      pagenum: 1,
      pagesize: 20,
    })
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
      if (!/^[A-Za-z_0-9]+$/.exec(data.taglink)) {
        message.error('标签链接只能为英文和下划线');
        this.btnStatus = false;
        return null;
      }
      let p0 = await this.aimi.updateAimiTag({
        payload: data
      });
      if (p0 && p0.success) {
        message.success("添加成功");
        this.fetchTagData();
        this.onReset();
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
      width: 40,
    },
    {
      title: "预览",
      render: (text, record) => (
        <div>
          <a href={`https://file.ecs32.top/data${record.relativePath}${record.fileId}__${record.fileName}`} target="_blank">
            <img src={`https://file.ecs32.top/data/aimi_thumb/240/${record.fileId}__${record.fileName}`}
                 data-url={`https://file.ecs32.top/data${record.relativePath}${record.fileId}__${record.fileName}`}
                 alt={record.hashId} />
              <ul className={styles.taglist}>
                <span>标签：  </span>
                {record.Tags.map((tag) => {
                  return <li key={tag.tagid}><span>{tag.tagname}</span></li>
                })}
              </ul>
          </a>
        </div>

      ),
      width: 240,
    },{
      title: '操作',
      key: 'x',
      width: 160,
      render: (text, record) => {
        return (
          <div>
            <Popconfirm title="确认删除数据？" onConfirm={() => this.handleDelete(record.key)} style={{ marginRight: 16 }} >
              <Button type={"danger"} style={{ marginRight: 16 }} disabled>删除</Button>
            </Popconfirm>
            <Button type={"primary"} onClick={() => this.handleEdit(record)}>编辑</Button>
          </div>
        )
      }
    },
  ];


  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    console.log(pagination, "adsfas");
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetchData({
      tagid: "5e50152d58adfe5f36e095f5",
      pagesize: pagination.pageSize,
      pagenum: pagination.current,
    });
  };

  handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });

    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  handleScroll = (direction, e) => {
    // console.log('direction:', direction);
    // console.log('target:', e.target);
  };

  handleDisable = disabled => {
    this.setState({ disabled });
  };

  handleRowSelectionChange = () => {
    let enable = !!this.state.rowSelection;
    this.setState({
      rowSelection: enable ?  undefined : this.rowSelection
    });
  };

  handleMenuClick = (e) => {
    message.info('Click on menu item.');
    console.log('click', e);
  };

  handleSelectOnChange = (value) => {
    console.log(this.state.tags.filter(item => item.tagid === value));
    this.setState({
      rowSelectionTags: this.state.tags.filter(item => item.tagid === value),
    });
  };


  render() {
    const { tags, targetKeys, selectedKeys, disabled } = this.state;
    const {dataSource} = this.state;
    const { visible, confirmLoading, ModalText } = this.state;
    const {form: {getFieldDecorator}} = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 22 },
        sm: { span: 20 },
      },
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
        }),
      };
    });

    return (
      <React.Fragment>
        <div style={{marginBottom: 16}}>
          <Button style={{marginRight: 16}}
                  type="alert"
                  onClick={this.handleRowSelectionChange} >
            {this.state.rowSelection ? `取消` : `批量管理`}
          </Button>
          {this.state.rowSelection ?
            <div style={{display: "inline-block"}}>
              <Select
                style={{ width: 200 }}
                showSearch
                placeholder="选择一个标签"
                optionFilterProp="children"
                onChange={this.handleSelectOnChange}
                dropdownMenuStyle={{maxHeight: 400,
                          overflowY: "scroll",
                          overflowX: "hidden",
                          border: "1px solid #ccc",
                        }}
              >
                {this.state.tags.map(item => {
                  return <Select.Option key={item.tagid} value={item.tagid}>
                    <Icon type="user" />{item.tagname}({item.taglink})
                  </Select.Option>
                })}
              </Select>
              <Button type="primary" style={{marginLeft: 16}} onClick={this.rowSelection.onSubmit}>提交</Button>
            </div>
            : null}
        </div>
        {dataSource.length > 0 ?
          <Table bordered
                 scroll={{ y: 540 }}
                 rowSelection={this.state.rowSelection}
                 rowClassName={() => 'editable-row'}
                 rowKey={record => record.hashId}
                 pagination={this.state.pagination}
                 loading={this.state.loading}
                 dataSource={dataSource}
                 onChange={this.handleTableChange}
                 columns={columns} /> : null }
        <Modal
          title="为图片添加标签"
          visible={visible}
          style={{minWidth: 640}}
          centered
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
        >
          <p>{ModalText}</p>
          <div>
            <Transfer
              dataSource={tags}
              titles={['所有标签', '选中的标签']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={this.handleTransferChange}
              onSelectChange={this.handleSelectChange}
              onScroll={this.handleScroll}
              render={item => (`${item.tagname}(${item.taglink})`)}
              disabled={disabled}
            />
            <Switch
              unCheckedChildren="disabled"
              checkedChildren="disabled"
              checked={disabled}
              onChange={this.handleDisable}
              style={{ marginTop: 16 }}
            />
          </div>
          <h2 style={{marginTop: 16}}>添加新Tag</h2>
          <Form {...formItemLayout}
                ref={this.formRef}
                name="control-ref"
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
              label="标签链接: "
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
              添加Tag
            </Button>
            <Button style={{marginLeft: 16}}
                    type="default"
                    disabled={this.state.btnStatus}
                    onClick={this.onReset} >
              清空数据
            </Button>
          </Form>
        </Modal>
      </React.Fragment>
    )
  }
}
export default Form.create()(AimiPictures);
