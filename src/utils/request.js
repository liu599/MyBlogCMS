/* eslint global-require: 0 *//* eslint prefer-const: 0 */
import axios from 'axios';
import qs from 'qs';
import jsonp from 'jsonp';
import lodash from 'lodash';
import pathToRegexp from 'path-to-regexp';

const fetch = (options = {
  fetchType: 'CORS',
  data: {
    header: {},
  },
}) => {
  let {
    method = 'get',
    data,
    url,
  } = options;
  
  const cloneData = lodash.cloneDeep(data);
  cloneData && delete cloneData.headers;
  if (!options.data) {
    options.data = {
      headers: {}
    }
  }
  // options.data && console.log(options.data.headers);
  const httpInstance = axios.create({headers: options.data.headers});
  url = pathToRegexp.compile(url)(data);
  switch (method.toLowerCase()) {
    case 'get':
      return httpInstance.get(url);
    case 'delete':
      return httpInstance.delete(url, {
        data: cloneData,
      });
    case 'post-without-token':
      return axios.post(url, cloneData);
    case 'post-form-without-token':
      return axios.post(url, require('qs').stringify(cloneData));
    case 'post-form':
      delete cloneData.headers;
      return httpInstance.post(url, require('qs').stringify(cloneData));
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
  if (!options.hasOwnProperty('fetchType')) {
    options.fetchType = 'CORS';
  }
  if (options.fetchType === 'CORS') {
    // console.log('跨域请求开始');
    return fetch(options).then((response) => {
      console.log('response is', response);
      
      const { statusText, status } = response;
      let { data } = response;
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
      return Promise.reject(new Error(JSON.stringify({ success: false, statusCode, message: msg }))).then(() => {}, (error) => {
        return error;
      });
    });
  }
  if (options.fetchType === 'jsonp') {
    return new Promise((resolve, reject) => {
      jsonp(options.url, {
        param: `${qs.stringify(options.data)}&callback`,
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
}
