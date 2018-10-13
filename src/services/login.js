import request from '../utils/request';

export async function login(data) {
  return request({
    url: 'https://www.blog.nekohand.moe/api/nekohand/v2/backend/token.get',
    method: 'post-form-without-token',
    data,
  });
}
