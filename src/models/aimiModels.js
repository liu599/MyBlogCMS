import model from '@symph/joy/model';
import produce from "immer";
import {
  getAimiTags,
  updateAimiTags,
  fetchAimiPicturesByTag,
  fetchTagforAimiPictures,
  updateAimiPictures,
  uploadAimiPictures,
} from "../services/aimiTags";

@model()
export default class AimiModel {
  namespace = 'aimiModel';
  // 初始化数据
  initState = {
    tags: [],
    files: [],
    pager: {},
  };

  async updateAimiPictureTags({payload}) {
    let res = await updateAimiPictures(payload);
    if (res && res.success) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  async fetchAimiTags() {
    let res = await getAimiTags();
    if (res && res.data) {
      const tags = produce(res.data, draft => {
        draft.forEach((df, ind) => {
          df.key = res.data[ind].tagid;
          df.disabled = ind === 0;
        });
      });
      console.log(tags, "after produce")
      this.setState({
        tags,
      });
      return Promise.resolve(tags);
    }
  }

  async updateAimiTag({payload}) {
    let res = await updateAimiTags(payload);
    if (res && res.success) {
      console.log(res, "adsjfasdf");
      return Promise.resolve(res);
    }
  }

  async fetchAimiPictures({payload}) {
    let res = await fetchAimiPicturesByTag(payload);
    if (res && res.success) {
      console.log(res, "030");
      this.setState({
        files: res.data,
        pager: {
          defaultCurrent: 1,
          size: "medium",
          showQuickJumper: true,
          pageSize: parseInt(res.pager.pageSize, 10),
          total: parseInt(res.pager.total, 10),
          current: parseInt(payload.pagenum, 10),
        },
      });
      return Promise.resolve(res);
    }
  }


}
