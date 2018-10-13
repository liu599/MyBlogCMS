import request from '../utils/request';

export async function categoriesFetch() {
  return  request({
    url: 'https://www.blog.nekohand.moe/api/nekohand/v2/backend/categories',
    method: 'get',
  })
}

export async function chronologyFetch() {
  return  request({
    url: 'https://www.blog.nekohand.moe/api/nekohand/v2/backend/posts-chronology',
    method: 'get',
  })
}
