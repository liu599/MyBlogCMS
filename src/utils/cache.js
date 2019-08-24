import storage from 'good-storage';

const BLOG_NEKOHAND_KEY_V6 = 'TOYAMA_KASUMI';

const SET_TOKEN = (token) => {
  return storage.session.set(BLOG_NEKOHAND_KEY_V6, token);
};

const GET_TOKEN = () => {
  return storage.session.get(BLOG_NEKOHAND_KEY_V6, 'TOKEN NOT FOUND');
};

const REMOVE_TOKEN = () => {
  return storage.session.remove(BLOG_NEKOHAND_KEY_V6);
};

const SET_STORAGE = (key, content) => {
  return storage.session.set(key, content);
};
const GET_STORAGE = (key) => {
  console.log(storage.session);
  return storage.session.get(key, 'TOKEN NOT FOUND');
};

export default {
  setStorage: SET_STORAGE,
  getStorage: GET_STORAGE,
  set: SET_TOKEN,
  get: GET_TOKEN,
  remove: REMOVE_TOKEN,
};
