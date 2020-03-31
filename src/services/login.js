import request from '../utils/request';
import {default as configs} from './config';
import {default as umirequest} from 'umi-request';

export async function login(data) {
  return umirequest(`${configs.genUrl(configs.backend, configs.modules.backend.token)}`, {
    requestType: "form",
    method: "post",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    data: data,
  });
  // return umirequest("https://mltd.ecs32.top/token.get", {
  //   requestType: "form",
  //   method: "post",
  //   headers: {
  //     Accept: 'application/json',
  //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  //   },
  //   data: data,
  //   errorHandler: function(error) {
  //     return Promise.resolve(error.response);
  //   },
  // });
}

export async function loginNew(data) {
  return umirequest("https://mltd.ecs32.top/token.get", {
    requestType: "form",
    method: "post",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    data: data,
  });
}
