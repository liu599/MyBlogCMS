/* global window */
/* eslint no-unused-expressions: 0 */
import lodash from 'lodash';
import cache from './cache';
import request from './request';

// 连字符转驼峰
// String.prototype.hyphenToHump = function () {
//   return this.replace(/-(\w)/g, (...args) => {
//     return args[1].toUpperCase();
//   });
// };

// 驼峰转连字符
// String.prototype.humpToHyphen = function () {
//   return this.replace(/([A-Z])/g, '-$1').toLowerCase();
// };

// 日期格式化
window.timeFormat = (timestamp) => {
  // return new Date(timestamp * 1000).toISOString().replace(/[a-zA-Z]/g, ' ').slice(0, -5);
  return new Date(timestamp * 1000).toLocaleString('chinese', { hour12: false }).replace(/[a-zA-Z]/g, ' ').slice(0, -3);
};

/*
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length));
    }
  }
  // console.log('format', format);
  return format;
};*/

/**
 * 作用将扁平状存储的数组转换成树结构
 * @id: 节点键id
 * @pid: 父节点键id
 * @example-input: {
      id: '1'
    }, {
      id: '2',
      pid: '1',
    },{
      id: '5'
    }
 * @example-output: {id: "1", children: [{
      id: '2',
      pid: '1',
    }, {
      id: '5'
    }]}
 * **/
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  const data = lodash.cloneDeep(array);
  const result = [];
  const hash = {};
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index];
  });

  data.forEach((item) => {
    const hashVP = hash[item[pid]];
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = []);
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

export default {
  cache,
  request,
  arrayToTree,
};
