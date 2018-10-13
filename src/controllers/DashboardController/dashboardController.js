import React, {PureComponent} from 'react';
import { Layout, Menu, Breadcrumb, Icon, Button } from 'antd';
import Head from '@symph/joy/head';
import WebsiteInfo from '../../components/Layout';
import { arrayToTree } from '../../utils';
import { menu } from '../../config/constant';
import {Switch, Route, Link} from '@symph/joy/router'
import DashboardModel from '../../models/model'
import controller, {requireModel} from '@symph/joy/controller'

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const { HeaderContent, FooterContent } = WebsiteInfo;
const MenuItem = Menu.Item;

const keyGenerator = k => (`nh-${k}`);

const onSelectModule = (e) => {
  console.log(e);
};

const generateMenu = (menuTree) => {
  const mode = 'inline';
  const defaultOpenKeys = [String(menuTree[0].children[0].id)];
  const defaultSelectedKeys = menuTree.map((menuItem) => {
    return `nh-${menuItem.id}`;
  });
  return (
    <Menu
      mode={mode}
      // defaultSelectedKeys={defaultOpenKeys}
      defaultOpenKeys={defaultSelectedKeys}
      style={{ height: '100%', borderRight: 0 }}
      onSelect={onSelectModule}
    >
      {generateSubMenu(menuTree)}
    </Menu>
  );
};

const generateSubMenu = (menuTree) => {
  // console.log('mmm', menuTree);
  return menuTree.map((menuItem, index) => {
    if (menuItem.children && menuItem.children.length > 0) {
      // console.log('进入条件', keyGenerator(index));
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
export default class DashboardController extends PureComponent {
  
  async fetchServerInfo() {
    let {dispatch} = this.props;
    await dispatch({
      type: 'model/fetchServerStatus'
    });
    await dispatch({
      type: 'model/fetchPostsList',
      payload: {
        pageNumber: 1,
        pageSize: 20,
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
        <Header style={{ background: '#666', marginBottom: '36px', textAlign: 'right' }} >
          <Button onClick={() => { this.fetchServerInfo(); }}> Log out</Button>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff', minHeight: '100vh', padding: '10px 0' }}>
            {generateMenu(arrayToTree(menu))}
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
      </Layout>
    );
  }
  
}
