import { isEqual } from 'lodash-es';

/**
 * 第二题
 */

// 核心用户请求
let _requestTime = 0;
const requestUserInfo = () => {
  // 这个方法的实现不能修改
  return Promise.resolve().then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟 ajax 异步，1s 返回
        resolve();
      }, 1000);
    }).then(() => {
      _requestTime++;
      return {
        nick: 'nick',
        age: '18',
      };
    });
  });
};

const _wrapper = () => {
  let fetchingPromises;
  return () => {
    if (!fetchingPromises) {
      fetchingPromises = requestUserInfo().catch((e) => {
        fetchingPromises = null;
      });
    }
    return fetchingPromises;
  };
};

// -------- 在这里完成代码 优化getUserInfo --------
// 调用 requestUserInfo，并优化请求次数
const getUserInfo = _wrapper();

/**
 * 以下为测试用例，无需修改
 */
const exam2 = async () => {
  try {
    // 模拟请求
    const result = await Promise.all([
      getUserInfo(),
      new Promise((resolve) => setTimeout(async () => { resolve(await getUserInfo()); }, 300)),
      new Promise((resolve) => setTimeout(async () => { resolve(await getUserInfo()); }, 2300)),
    ]);

    if (!isEqual(result, [
      {
        nick: 'nick',
        age: '18',
      },
      {
        nick: 'nick',
        age: '18',
      },
      {
        nick: 'nick',
        age: '18',
      },
    ])) {
      throw new Error('Wrong answer');
    }
    return _requestTime === 1;
  } catch (err) {
    console.warn('测试运行失败');
    console.error(err);
    return false;
  }
};

export default exam2;
