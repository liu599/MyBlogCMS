import request from '../utils/request';
import {default as configs} from './config';

export async function categoriesFetch() {
  return  request({
    url: `${configs.genUrl(configs.frontend, configs.modules.frontend.categories)}`,
    method: 'get',
  })
}

export async function chronologyFetch() {
  return  request({
    url: `${configs.genUrl(configs.frontend, configs.modules.frontend.postChronology)}`,
    method: 'get',
  })
}

export async function categoryDelete(data) {
  return request({
    url: `${configs.genUrl(configs.backend, configs.modules.backend.categoryDelete)}`,
    method: 'post-form',
    data,
  })
}
