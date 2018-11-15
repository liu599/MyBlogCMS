import request from '../utils/request';
import {default as configs} from './config';

export async function getFileList() {
  return request({
    url: `${configs.genUrl(configs.frontend, configs.modules.frontend.filelist)}`,
    method: 'get',
  });
}
