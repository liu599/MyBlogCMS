import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon, Button } from 'antd';
import { Route, Switch } from 'dva/router';
import WebsiteInfo from '../components/Layout';
import { arrayToTree } from '../utils';
import { menu } from '../config';
import User from '../components/User';
import Article from '../components/Article';

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;
const { HeaderContent, FooterContent } = WebsiteInfo;
const MenuItem = Menu.Item;


const keyGenerator = k => (`nh-${k}`);

const Dashboard = ({
  dispatch,
  state,
  router,
}) => {
  // 这是函数，不是 Object，没有 this 作用域，是 pure function。
  const onSelectModule = (e) => {
    // console.log(e);
    console.log(state, router);
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

  return (
    <Layout>
      <Header style={{ background: '#666', marginBottom: '36px', textAlign: 'right' }} >
        <Button onClick={() => { dispatch({ type: 'login/logout' }); }}> Log out</Button>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff', minHeight: '100vh', padding: '10px 0' }}>
          {generateMenu(arrayToTree(menu))}
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
            {/* {generateModuleView()} */}
            <Switch>
              <Route path={`${router.match.url}/article-category-edit`} component={Article.ArticleCategoryEdit} />
              <Route path={`${router.match.url}/article-category`} component={Article.ArticleCategory} />
              <Route path={`${router.match.url}/article-edit`} component={Article.ArticleEdit} />
              <Route path={`${router.match.url}/article-list`} component={Article.ArticleList} />
              <Route path={`${router.match.url}/user-list/edit`} component={User.UserEdit} />
              <Route path={`${router.match.url}/user-list`} component={User.UserList} />
              <Route exat path={`${router.match.url}`} component={() => (<div>Waiting for the development..</div>)} />
            </Switch>
          </Content>
          <Footer style={{ background: 'transparent', width: '100%', padding: '20px 0' }}>
            <FooterContent />
          </Footer>
        </Layout>
      </Layout>

    </Layout>
  );
};


Dashboard.propTypes = {};

const mapStateToProps = (state, router) => {
  return {
    state,
    router,
  };
};

export default connect(mapStateToProps, null)(Dashboard);
