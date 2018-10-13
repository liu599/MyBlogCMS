import model from '@symph/joy/model';
import { getServerInfo, postsFetch } from '../services/article';
import { login } from '../services/login';


@model()
export default class AppModel {
  namespace = 'model';
  // 初始化数据
  initState = {
    list: {},
    posts: [],
  };
  
  async fetchServerStatus() {
    let response = await getServerInfo();
    console.log('response', response, this.getState());
    let {list} = this.getState();
    list = {
      res: response.data
    };
    console.log('list', list);
    this.setState({
      list,
    });
    return null;
  }
  
  async fetchPostsList({ payload }) {
    let response = await postsFetch(payload);
    let {posts} = this.getState();
    posts = [
      ...posts,
      response.data
    ];
    this.setState({
      posts,
    });
    return null
  }
  
  async login({ payload }) {
    let response = await login(payload);
    console.log(response, 'login');
    return null;
  }

  /*// 添加项目
  async add({data}) {
    let {list} = this.getState();
    this.setState({list: list.concat([data])});
    return null;
  }

  // 删除项目
  async del({index}) {
    let {list} = this.getState();
    list = list.filter((l, key) => key !== index);
    this.setState({list});
    return null;
  }*/
}