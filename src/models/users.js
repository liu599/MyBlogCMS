import { routerRedux } from 'dva/router';
import { getUsers, updateUser } from '../services/users';

export default {
  namespace: 'users',
  state: {},
  reducers: {
    add(state, { payload: userInfo }) {
      const ret = [];
      userInfo.login.forEach((uInfo, index) => {
        let uCpy = JSON.parse(JSON.stringify(uInfo));
        if (!(JSON.stringify(userInfo.detail[index]) === '{}')) {
          uCpy = { ...uCpy, ...userInfo.detail[index] };
        }
        uCpy.key = index;
        ret.push(uCpy);
      });
      return ret;
    },
  },
  effects: {
    * fetch({ payload }, { put, call, select }) {
      const data = yield call(getUsers);
      if (data.success) {
        // 调用立即函数
        yield call(console.log, data.data);
        // 调用Reducer
        yield put({ type: 'add', payload: data.data });
      }
    },
    * update({ payload }, { put, call, select }) {
      yield call(console.log, payload);
      yield call(updateUser, { data: payload });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname.indexOf('user') !== -1) {
          dispatch({
            // 不带前缀默认同一namespace下的。
            type: 'fetch',
          });
        }
      });
    },
  },
};
