import {default as umirequest} from 'umi-request';

export async function getAimiTags() {
  return umirequest("https://mltd.ecs32.top/tags.get", {
    requestType: "form",
    method: "get",
  });
}
