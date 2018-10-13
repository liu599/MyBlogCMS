import React, {PureComponent} from 'react';
import Head from '@symph/joy/head';
import {Layout} from 'antd';

class AppController extends PureComponent {
  
  render() {
    return (
      <React.Fragment>
        <Head>
          <title>后台系统登陆页</title>
        </Head>
        <Layout.Content>
          {this.props.children}
        </Layout.Content>
      </React.Fragment>
    );
  }
}

export default AppController;