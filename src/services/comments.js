import request from '../utils/request';
import {default as configs} from './config';

export async function commentsFetch(coid) {
  return  request({
    url: `${configs.genUrl(configs.frontend, configs.modules.frontend.comments)}/${coid}`,
    method: 'post',
  })
}

export async function commentSubmit(data) {
  return  request({
    url: `${configs.genUrl(configs.frontend, configs.modules.frontend.commentCreation)}`,
    method: 'post',
    data
  })
}
