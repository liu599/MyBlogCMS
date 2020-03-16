import request from '../utils/request';
import {default as configs} from './config';
import {default as umirequest} from 'umi-request';

export async function login(data) {
  return request({
    url: `${configs.genUrl(configs.backend, configs.modules.backend.token)}`,
    //url: `https://api.ecs32.top/v2/auth/token.get`,
    method: 'post-form-without-token',
    data,
  });
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
