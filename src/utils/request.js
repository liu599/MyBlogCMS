/* global window */
/* eslint global-require: 0 */
/* eslint prefer-const: 0 */
import axios from 'axios';
import qs from 'qs';
import jsonp from 'jsonp';
import lodash from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import header from '../config/my-secret';
import { cache } from '../utils';


const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options;

  const cloneData = lodash.cloneDeep(data);
  const token = cache.get();
  const httpInstance = axios.create({
    headers: { Authorization: token },
  });
  const match = pathToRegexp.parse(url);
  url = pathToRegexp.compile(url)(data);
  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve({ statusText: 'OK', status: 200, data: result });
      });
    });
  }

  switch (method.toLowerCase()) {
    case 'get':
      return httpInstance.get(url, {
        params: cloneData,
      });
    case 'delete':
      return httpInstance.delete(url, {
        data: cloneData,
      });
    case 'login':
      return axios.post(url, cloneData);
    case 'post-public':
      return axios.create({
        headers: header,
      }).post(url, require('qs').stringify(cloneData));
    case 'post':
      return httpInstance.post(url, cloneData);
    case 'put':
      return httpInstance.put(url, cloneData);
    case 'patch':
      return httpInstance.patch(url, cloneData);
    default:
      return httpInstance(options);
  }
};

export default function request(options) {
  /* if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`;
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS';
      } else {
        options.fetchType = 'JSONP';
      }
    }
  }*/
  options.fetchType = 'CORS';
  return fetch(options).then((response) => {
    console.log('response is', response);
    const { statusText, status } = response;
    let data = response.data;
    if (data instanceof Array) {
      data = {
        list: data,
      };
    }
    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data,
    });
  }).catch((error) => {
    console.log('options', options);
    const { response } = error;
    let msg;
    let statusCode;
    if (response && response instanceof Object) {
      const { data, statusText } = response;
      statusCode = response.status;
      msg = data.message || statusText;
    } else {
      statusCode = 600;
      msg = error.message || 'Network Error';
    }
    return Promise.reject({ success: false, statusCode, message: msg });
  });
}
