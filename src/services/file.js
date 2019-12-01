import request from '../utils/request';
import {default as configs} from './config';

export async function getFileList() {
  return request({
    url: `${configs.genFileUrl(configs.filemodules.filelist)}`,
    method: 'get',
  });
}

export async function getFileListByType(data) {
  return request({
    url: `${configs.genFileUrl(configs.filemodules.filetype)}`,
    method: 'post-form-without-token',
    data
  });
}

export async function fix(data) {
  return request({
    url: `${configs.genFileUrl(configs.filemodules.fix)}`,
    method: `post-form-without-token`,
    data
  });
}
