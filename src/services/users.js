import request from '../utils/request';

export async function getUsers() {
  return request({
    url: '/api/neko/v1/auth/users',
    method: 'post',
  });
}

export async function getUser(data) {
  return request({
    url: '/api/neko/v1/auth/user',
    method: 'post',
    data,
  });
}

export async function updateUser(data) {
  return request({
    url: '/api/neko/v1/auth/user',
    method: 'put',
    data,
  });
}
