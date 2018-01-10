import request from '../utils/request';

export async function getCategory(data) {
  return request({
    url: '/api/neko/v1/categories',
    method: 'post-public',
    data,
  });
}

export async function deleteCategory(data) {
  return request({
    url: '/api/neko/v1/auth/category',
    method: 'delete',
    data,
  });
}

export async function updateCategory(data) {
  return request({
    url: '/api/neko/v1/auth/category',
    method: 'put',
    data,
  });
}

export async function createCategory(data) {
  return request({
    url: '/api/neko/v1/auth/category',
    method: 'post',
    data,
  });
}

export async function getArticles(data) {
  return request({
    url: '/api/neko/v1/posts',
    method: 'post-public',
    data,
  });
}


export async function deletePost(data) {
  return request({
    url: '/api/neko/v1/auth/post',
    method: 'delete',
    data,
  });
}

export async function updatePost(data) {
  return request({
    url: '/api/neko/v1/auth/post',
    method: 'put',
    data,
  });
}

export async function createPost(data) {
  return request({
    url: '/api/neko/v1/auth/post',
    method: 'post',
    data,
  });
}
