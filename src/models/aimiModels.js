import model from '@symph/joy/model';
import {getAimiTags, updateAimiTags} from "../services/aimiTags";

@model()
export default class AimiModel {
  namespace = 'aimiModel';
  // 初始化数据
  initState = {
    tags: [],
  };

  async fetchAimiTags() {
    let res = await getAimiTags();
    if (res && res.data) {
      return Promise.resolve(res.data);
    }
  }

  async updateAimiTag({payload}) {
    let res = await updateAimiTags(payload);
    if (res && res.success) {
      console.log(res, "adsjfasdf");
      return Promise.resolve(res);
    }
  }


}
