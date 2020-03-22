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

export async function fetchAimiPicturesByTag(data) {
  return extendedRequest("https://mltd.ecs32.top/tag.filelist", {
    data
  })
}

export async function fetchTagforAimiPictures(data) {
  return extendedRequest("https://mltd.ecs32.top/filelist.tag", {
    data
  })
}

export async function updateAimiPictures(data) {
  return umirequest("https://mltd.ecs32.top/tagfiles.update", {
    method: "POST",
    data,
  })
}


// FIXME: MIX UPLAOD
export async function uploadAimiPictures(data) {
  return extendedRequest("https://mltd.ecs32.top/tagfile.upload", {
    data
  })
}
