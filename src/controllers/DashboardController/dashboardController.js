import React, {Component} from 'react';
import { Layout, Menu, Breadcrumb, Icon, Button, Modal } from 'antd';
import Head from '@symph/joy/head';
import WebsiteInfo from '../../components/Layout';
import { arrayToTree } from '../../utils';
import { LeftMenu } from '../../config/constant';
import {Switch, Route, Link, routerRedux} from '@symph/joy/router'
import DashboardModel from '../../models/model'
import controller, {requireModel} from '@symph/joy/controller'

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const { HeaderContent, FooterContent } = WebsiteInfo;
const MenuItem = Menu.Item;

const keyGenerator = k => (`nh-${k}`);

const onSelectModule = (dispatch) => {
  // console.log(e);
  return null;
};

const generateMenu = (menuTree, dispatch) => {
  const mode = 'inline';
  const defaultSelectedKey = [`nh-${String(menuTree[1].children[0].id)}`];
  const defaultOpenKeys = menuTree.map((menuItem) => {
    return `nh-${menuItem.id}`;
  });
  return (
    <Menu
      mode={mode}
      defaultSelectedKeys={defaultSelectedKey}
      defaultOpenKeys={defaultOpenKeys}
      style={{ height: '100%', borderRight: 0 }}
      onSelect={() => onSelectModule(dispatch)}
    >
      {generateSubMenu(menuTree)}
    </Menu>
  );
};

const generateSubMenu = (menuTree) => {
  // console.log('mmm', menuTree);
  return menuTree.map((menuItem, index) => {
    if (menuItem.children && menuItem.children.length > 0) {
      // console.log('进入条件', keyGenerator(menuItem.id));
      return (
        <SubMenu
          key={keyGenerator(menuItem.id)}
          title={<span><Icon type={menuItem.icon && (menuItem.icon)} />{menuItem.name}</span>}
        >
          {generateSubMenu(menuItem.children)}
        </SubMenu>
      );
    }
    return (
      <MenuItem key={keyGenerator(menuItem.id)}>
        <Link to={`/dashboard/${menuItem.path}`} >
          {menuItem.name}
        </Link>
      </MenuItem>
    );
  });
};


@requireModel(DashboardModel)          // register model
@controller((state) => {              // state is store's state
  return {
    model: state.model // bind model's state to props
  }
})
export default class DashboardController extends Component {

  state = {
    ModalText: '确认退出管理系统?',
    visible: false,
    confirmLoading: false,
  };


  showModal = () => {
    // console.log(this.props);
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      ModalText: '正在退出管理系统.....',
      confirmLoading: true,
    });
    setTimeout(() => {
      if (window) {
        window.localStorage.removeItem("nekohand_token");
        window.localStorage.removeItem("nekohand_administrator");
      }
      this.setState({
        visible: false,
        confirmLoading: false,
      });
      this.props.dispatch(routerRedux.push('/'));
    }, 1000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  async logout() {

  }

  async fetchServerInfo() {
    let {dispatch} = this.props;
    await dispatch({
      type: 'model/fetchServerStatus'
    });
    await dispatch({
      type: 'model/fetchPostsList',
      payload: {
        pageNumber: 1,
        pageSize: 50,
      }
    });
    console.log(this.props);
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Header style={{ background: '#908', paddingBottom: '20px', margin: 0, marginBottom: '10px'}} >
          <div style={{display: 'inline-block', color: 'pink', fontSize: '20px', marginLeft: '4%'}}>
            <div>
              Nekohand Content Manage System (Beta)
            </div>
          </div>
          <Button style={{float: 'right', margin: '16px 50px 0 0'}} onClick={() => { this.showModal(); }}> Log out</Button>
        </Header>
        <Layout>
          <Sider width={160} style={{ background: '#fff', minHeight: '100vh', padding: '10px 0' }}>
            {generateMenu(arrayToTree(LeftMenu), this.props.dispatch)}
          </Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
        <Footer style={{ background: 'transparent', width: '100%', padding: '20px 0' }}>
          <FooterContent />
        </Footer>
        <Modal title="确认页面"
               visible={this.state.visible}
               onOk={this.handleOk}
               confirmLoading={this.state.confirmLoading}
               onCancel={this.handleCancel}
        >
          <p>{this.state.ModalText}</p>
        </Modal>
      </Layout>
    );
  }

}
