import request from '../utils/request';
import {default as configs} from './config';

export async function login(data) {
  return request({
    url: `${configs.genUrl(configs.backend, configs.modules.backend.token)}`,
    //url: `https://api.ecs32.top/v2/auth/token.get`,
    method: 'post-form-without-token',
    data,
  });
}
