import request from '../utils/request';

import request from '../utils/request';

export async function commentsFetch(coid) {
  return  request({
    url: `https://www.blog.nekohand.moe/api/nekohand/v2/backend/comments/${coid}`,
    method: 'post',
  })
}

export async function commentSubmit(data) {
  return  request({
    url: `https://www.blog.nekohand.moe/api/nekohand/v2/backend/c2a5cc3b070`,
    method: 'post',
    data
  })
}
