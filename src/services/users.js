import request, {extend} from 'umi-request';

const extendedRequest = extend({
  requestType: "form",
  method: "post",
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  }
});

export async function getUsers(data) {
  return extendedRequest("https://mltd.ecs32.top/users.get", {
    data,
  });
}
