import request from '../utils/request';

export async function login(data) {
  return request({
    url: '/api/neko/v1/token.get',
    method: 'login',
    data,
  });
}
