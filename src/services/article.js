import request from '../utils/request';

export async function getServerInfo() {
  return request({
    url: 'https://www.blog.nekohand.moe/api/nekohand/v2/backend/status',
    method: 'get',
  });
}

export async function postsFetch(data) {
  return  request({
    url: 'https://www.blog.nekohand.moe/api/nekohand/v2/backend/posts',
    method: 'post-form-without-token',
    data,
  })
}

export async function postsFetchByCategory({cid, ...data}) {
  
  return  request({
    url: `https://www.blog.nekohand.moe/api/nekohand/v2/backend/posts/${cid}`,
    method: 'post-form-without-token',
    data
  })
}

export async function postFetch(id) {
  return  request({
    url: `https://www.blog.nekohand.moe/api/nekohand/v2/backend/post/${id}`,
    method: 'post-form-without-token',
  })
}

export async function postCreation(data) {
  return request({
    url: `https://www.blog.nekohand.moe/api/nekohand/v2/backend/auth/post.create`,
    method: 'post',
    data,
  })
}
