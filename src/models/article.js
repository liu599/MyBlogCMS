import { routerRedux } from 'dva/router';
import {
  getCategory,
  updateCategory,
  deleteCategory,
  createCategory,
  getArticles,
  updatePost,
  deletePost,
  createPost,
} from '../services/article';

export default {
  namespace: 'article',
  state: {
    articleCategories: [],
    articlePager: {},
    articleList: [],
  },
  reducers: {
    addCategory(state, { payload: categories }) {
      console.log(categories, 'dddd');
      const articleCategories = [].concat(categories);
      return { ...state, articleCategories };
    },
    deleteCategory(state, { cid }) {
      console.log(state);
      const articleCategories = state.articleCategories.filter((category) => {
        return category.cid !== cid;
      });
      return { ...state, articleCategories };
    },
    addArticles(state, { payload: articles }) {
      console.log(articles, 'dddd123');
      const articleList = [].concat(articles.Posts);
      const articlePager = Object.assign({}, articles.Pager);
      return { ...state, articleList, articlePager };
    },
    deleteArticle(state, { pid }) {
      // TODO: 这里逻辑不对, 应该查询。
      console.log(state);
      const articleList = state.articleList.filter((article) => {
        return article.pid !== pid;
      });
      return { ...state, articleList };
    },
  },
  effects: {
    * fetchCategories({ payload }, { put, call, fork }) {
      const data = yield call(getCategory);
      if (data.success) {
        yield call(console.log, data.data, '33333');
        yield put({ type: 'addCategory', payload: data.data });
      }
    },
    * categoryCreate({ payload }, { put, call, fork }) {
      const data = yield call(createCategory, payload);
      if (data.success) {
        yield put(routerRedux.push('/dashboard/article-category'));
      }
    },
    * categoryDelete({ payload }, { put, call, fork }) {
      const data = yield call(deleteCategory, payload);
      if (data.success) {
        yield call(console.log, payload.cid);
        yield put({ type: 'deleteCategory', cid: payload.cid });
      }
    },
    * categoryUpdate({ payload }, { put, call, fork }) {
      const data = yield call(updateCategory, payload);
      if (data.success) {
        yield put(routerRedux.push('/dashboard/article-category'));
      }
    },
    * fetchArticles({ payload }, { put, call, fork }) {
      const data = yield call(getArticles, payload);
      yield call(console.log, data);
      if (data.success) {
        yield call(console.log, data.data, '333333');
        yield put({ type: 'addArticles', payload: data.data });
      }
    },
    * articleCreate({ payload }, { put, call, fork }) {
      const data = yield call(createPost, payload);
      if (data.success) {
        yield put(routerRedux.push('/dashboard/article-list'));
      }
    },
    * articleDelete({ payload }, { put, call, fork }) {
      const data = yield call(deletePost, payload);
      if (data.success) {
        yield call(console.log, payload.pid);
        yield put({ type: 'deleteArticle', pid: payload.pid });
      }
    },
    * articleUpdate({ payload }, { put, call, fork }) {
      const data = yield call(updatePost, payload);
      if (data.success) {
        yield put(routerRedux.push('/dashboard/article-list'));
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf('article') !== -1) {
          dispatch({
            // 不带前缀默认同一namespace下的。
            type: 'fetchCategories',
          });
        }
        if (pathname.indexOf('article-list') !== -1) {
          // console.log('dddispatch default');
          dispatch({
            // 不带前缀默认同一namespace下的。
            type: 'fetchArticles',
            payload: {
              start: 0,
              count: 20,
            },
          });
        }
      });
    },
  },
};
