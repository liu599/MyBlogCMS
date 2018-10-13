import model from '@symph/joy/model';
import { getServerInfo, postsFetch, postFetch, postCreation } from '../services/article';
import * as categoryServices from '../services/categories';
import { login } from '../services/login';
import lodash from 'lodash';
import {message} from 'antd';

@model()
export default class AppModel {
  namespace = 'model';
  // 初始化数据
  initState = {
    list: {},
    posts: [],
    token: '',
    user: '',
    categories: [],
    post: {
      id: '-1',
      title: '',
      category: '',
      createdAt: 0,
      slug: 'this is a created post',
      status: 'public',
      body: '',
    },
  };
  
  async fetchServerStatus() {
    let response = await getServerInfo();
    let list = {
      res: response.data
    };
    this.setState({
      list,
    });
    return null;
  }
  
  async login({ payload }) {
    let response = await login(payload);
    // console.log('res', response, typeof response, response.message);
    if (response && response.hasOwnProperty('api_token')) {
      this.setState({
        token: response.api_token,
        user: payload.username,
      });
      if (window) {
        window.localStorage.setItem("nekohand_token", response.api_token);
        window.localStorage.setItem("nekohand_administrator", payload.username);
      }
      return true;
    } else {
      console.error(response.message);
    }
    return null;
  }
  
  async fetchPostsList({ payload }) {
    let response = await postsFetch(payload);
    // let {posts} = this.getState();
    let responseData = lodash.cloneDeep(response.data).reverse();
    responseData.forEach(item => {
      item.key = item.pid;
    });
    this.setState({
      post: {
        id: '-1',
        title: '',
        category: '',
        createdAt: 0,
        slug: 'this is a created post',
        status: 'public',
        body: '',
      },
      posts: responseData,
    });
    return null;
  }
  
  async fetchCategories() {
    let response = await categoryServices.categoriesFetch();
    let responseData = lodash.cloneDeep(response.data);
    responseData.forEach(item => {
      item.key = item.cid;
    });
    this.setState({
      categories: responseData,
    });
    return null;
  }
  
  async fetchPostById({payload}) {
    let response = await postFetch(payload);
    let responseData = lodash.cloneDeep(response.data);
    this.setState({
      post: responseData,
    });
    return null;
  }
  
  async createPost({payload}) {
    let response = await postCreation(payload);
    // console.log('data', response, response.message, response.success);
    if (response.message !== '') {
      message.error(response.message);
    } else if (response.success) {
      return true;
    }
    return null;
  }
  
}
