import model from '@symph/joy/model';
import {getServerInfo, postsFetch, postFetch, postCreation, postDelete} from '../services/article';
import * as categoryServices from '../services/categories';
import { login } from '../services/login';
import { getFileList, getFileListByType, fix } from '../services/file';
import lodash from 'lodash';
import {message} from 'antd';
import React from "react";
import {getUsers, createUser} from "../services/users";

@model()
export default class AppModel {
  namespace = 'model';
  // 初始化数据
  initState = {
    code: {},
    posts: [],
    token: '',
    user: '',
    categories: [],
    files: [],
    error: {
      msg: 'error message'
    },
    post: {
      id: '-1',
      title: '',
      category: '',
      createdAt: 0,
      slug: 'this is a created post',
      status: 'public',
      body: '',
    },
    userList: [],
  };

  async fetchServerStatus() {
    let response = await getServerInfo();
    this.setState({
      code: response.data.body
    });
    return Promise.resolve(response.data.body);
  }

  async filelist({ payload }) {
    let response = await getFileList();
    console.log(response);
    if (response && response.data) {
      let responseData = response.data;
      responseData.forEach((item, index, responseData) => {
        item.key = item.hashId;
        let fileType = item.filetype;
        if (fileType !== 'png' && fileType !== 'jpg' && fileType !== 'jpeg') {
          responseData.splice(index, 1);
        }
      });

      this.setState({
        files: responseData,
      })
    }
    return null;
  }

  async filelistbytype({ payload }) {
    let response = await getFileListByType(payload);
    console.log(response);
    if (response && response.data) {
      let responseData = response.data;
      responseData.forEach((item, index, responseData) => {
        item.key = item.hashId
      });
      this.setState({files: responseData})
    }
    return null;
  }

  async fixFiles({payload}) {
    let response = await fix(payload);
    console.log('res', response);
    if (response && response.data) {
      return true;
    }
  }

  async login({ payload }) {
    let response = await login(payload);
    // console.log('res', response, typeof response, response.message);
    if (response && response.hasOwnProperty('api_token')) {
      this.setState({
        token: response.api_token,
        user: response.user_id,
      });
      if (window) {
        window.localStorage.setItem("nekohand_token", response.api_token);
        window.localStorage.setItem("nekohand_administrator", response.user_id);
      }
      return true;
    } else {
      console.error(response.message);
      this.setState({
        error: {
          msg: response.message,
        }
      })
    }
    return null;
  }

  async loginNew({ payload }) {
    let response = await login(payload);
    // console.log('res', response, typeof response, response.message);
    if (response && response.hasOwnProperty('api_token')) {
      this.setState({
        token: response.api_token,
        user: response.user_id,
      });
      if (window) {
        window.localStorage.setItem("nekohand_token", response.api_token);
        window.localStorage.setItem("nekohand_administrator", response.user_id);
      }
      return true;
    } else {
      console.error(response.message);
      this.setState({
        error: {
          msg: response.message,
        }
      })
    }
    return null;
  }

  async fetchPostsList({ payload }) {
    let response = await postsFetch(payload);
    // let {posts} = this.getState();
    let responseData = lodash.cloneDeep(response.data);
    responseData.forEach(item => {
      item.key = item.pid;
    });
    responseData.sort((a, b) => {
      return b.createdAt - a.createdAt;
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

  async deletePost({payload}) {
    let res = await postDelete(payload);
    console.log(res.success, 'adfasf');
    return true;
  }

  async setAsyncState({payload}) {
    this.setState(payload);
  }

  async getUsers({payload}) {
    let res = await getUsers(payload);
    console.log(res, '2233');
    this.setState({
      userList: res.data,
    });
    return null;
  }

  async createUser({payload}) {
    payload.token = window.localStorage.getItem("nekohand_token");
    payload.uid = window.localStorage.getItem("nekohand_administrator");
    let res = await createUser(payload);
    console.log(res, 'createUser');
    return null;
  }
}
