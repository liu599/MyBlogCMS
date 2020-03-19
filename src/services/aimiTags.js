import {default as umirequest, extend} from 'umi-request';

const extendedRequest = extend({
  requestType: "form",
  method: "post",
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  }
});

export async function getAimiTags() {
  return umirequest("https://mltd.ecs32.top/tags.get", {
    requestType: "form",
    method: "get",
  });
}

export async function updateAimiTags(data) {
  return extendedRequest("https://mltd.ecs32.top/tag.update", {
    data
  })
}
