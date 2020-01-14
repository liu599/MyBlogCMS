import request from '../utils/request';
import {default as configs} from './config';

export async function getServerInfo() {
  return request({
    url: 'https://kasumi.ecs32.top/api/nekohand/v2/frontend/status',
    method: 'get',
  });
}

export async function postsFetch(data) {
  return  request({
    url: `${configs.genUrl(configs.frontend, configs.modules.frontend.posts)}`,
    method: 'post-form-without-token',
    data,
  })
}

export async function postsFetchByCategory({cid, ...data}) {

  return  request({
    url: `${configs.genUrl(configs.frontend, configs.modules.frontend.posts)}/${cid}`,
    method: 'post-form-without-token',
    data
  })
}

export async function postFetch(id) {
  return  request({
    url: `${configs.genUrl(configs.frontend, configs.modules.frontend.post)}/${id}`,
    method: 'post-form-without-token',
  })
}

export async function postCreation(data) {
  return request({
    url: `${configs.genUrl(configs.backend, configs.modules.backend.postEdit)}`,
    method: 'post',
    currentTimeStamp: Date.now(),
    data,
  })
}

export async function postDelete(data) {

  return request({
    url: `${configs.genUrl(configs.backend, configs.modules.backend.postDelete)}`,
    method: 'post-form',
    currentTimeStamp: Date.now(),
    data,
  })
}
