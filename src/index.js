import React, { Component } from 'react'
import 'antd/dist/antd.css'
import Head from '@symph/joy/head'
import dynamic from '@symph/joy/dynamic'
import { Switch, Route, Redirect } from '@symph/joy/router'
import AppController from './controllers/AppController'
import ArticleComponents from './components/Article'
import ResourceComponents from './components/Resource'
import UserComponents from './pages/User'

import AimiTags from './pages/AimiTags/AimiTags'

// 加载业务组件
import loading from './components/Loading'
import AimiPictures from "./pages/AimiPictures/AimiPictures";

const DashboardController = dynamic({loader: () => import('./controllers/DashboardController/dashboardController'), loading});
const IndexController = dynamic({loader: () => import('./controllers/IndexController'), loading});

export default class Main extends Component {
  render () {
    return (
      <div>
        <Head>
          <title>Nekohand Blog Content Management Service</title>
        </Head>

          <AppController>
            <Switch>
              <DashboardController path={"/dashboard"}>
                <Switch>
                  <Route exact path="/dashboard/user-list" component={UserComponents.UserList} />
                  <Route exact path="/dashboard/article-list" component={ArticleComponents.ArticleList} />
                  <Route exact path="/dashboard/article-list/create" component={ArticleComponents.ArticleEdit} />
                  <Route exact path="/dashboard/article-list/edit/(:pid)" component={ArticleComponents.ArticleEdit} />
                  <Route exact path="/dashboard/article-category" component={ArticleComponents.ArticleCategory} />
                  <Route exact path="/dashboard/article-category/create" component={ArticleComponents.ArticleCategoryEdit} />
                  <Route path="/dashboard/article-category/edit/:cid" component={ArticleComponents.ArticleCategoryEdit} />
                  <Route exact path="/dashboard/resource-upload" component={ResourceComponents.ResourceUpload} />
                  <Route exact path="/dashboard/resource-tools" component={ResourceComponents.ResourceFix} />
                  <Route exact path="/dashboard/resource-list" component={ResourceComponents.ResourceFileList} />

                  <Route exact path="/dashboard/aimi-tags"  component={AimiTags} />
                  <Route exact path="/dashboard/aimi-pictures" component={AimiPictures} />

                  <Route component={() => (<div>Waiting for the development..</div>)}/>
                </Switch>
              </DashboardController>
              <Route path="/" component={IndexController}/>
            </Switch>
          </AppController>
      </div>
    )
  }
};

