import { routerRedux } from 'dva/router';
import { login } from '../services/login';
import { cache } from '../utils';

export default {
  namespace: 'login',
  state: {},
  reducers: {},
  effects: {
    // Redux saga generator
    * login({ payload }, { put, call, fork }) {
      const data = yield call(login, payload);
      if (data.success) {
        // 设置TOKEN
        yield call(cache.set, data.data.token);
        // yield put({type: 'user/fetch'});
        yield put(routerRedux.push('/dashboard'));
      } else {
        throw data;
      }
    },
    * logout({ payload }, { put, call, fork }) {
      yield call(cache.remove);
      yield put(routerRedux.push('/'));
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        // console.log('token', cache.get());
        if (cache.get() === 'TOKEN NOT FOUND' && pathname !== '/' && pathname.indexOf('login') === -1) {
          // console.log('1', pathname);
          dispatch({ type: 'logout' });
        }
      });
    },
  },
};
