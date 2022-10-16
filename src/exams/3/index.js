/**
 * 第三题
 */
import { isEqual } from 'lodash-es';

// 核心用户请求
let _requestTime = 0;
const requestProfile = (uid) => {
  // 这个方法的实现不能修改
  return Promise.resolve().then(() => {
    return new Promise((resolve) => {
      setTimeout(() => { resolve(); }, 1000);
    }).then(() => {
      _requestTime++;
      return {
        uid,
        nick: `nick-${uid}`,
        age: '18',
      };
    });
  });
};

const _wrapper = (max = 2) => {
  const profiles = Object.create(null);
  const promises = Object.create(null);

  const recurring = (uid) => {
    if (profiles[uid]) return Promise.resolve(profiles[uid]);
    if (promises[uid]) return promises[uid];
    if (Object.keys(promises).length < max) {
      const promise = requestProfile(uid).then((p) => {
        profiles[uid] = p;
        return p;
      }).finally(() => {
        delete promises[uid];
      });
      promises[uid] = promise;
      return promise;
    }
    return Promise.race(Object.values(promises)).catch(() => {}).then(() => recurring(uid));
  }

  return recurring;
};

// 在这里完成代码，进行requestUserProfile优化
// 在这里调用requestProfile
const requestUserProfile = _wrapper(2);

/**
 * 以下为测试用例，无需修改
 */
const exam3 = async () => {
  try {
    const star = Date.now();
    const result = await Promise.all([
      requestUserProfile('1'),
      requestUserProfile('2'),
      requestUserProfile('3'),
      requestUserProfile('1'),
    ]);

    if ((Date.now() - star) < 2000 || (Date.now() - star) >= 3000) {
      throw new Error('Wrong answer');
    }

    if (!isEqual(result, [
      {
        uid: '1',
        nick: 'nick-1',
        age: '18',
      },
      {
        uid: '2',
        nick: 'nick-2',
        age: '18',
      },
      {
        uid: '3',
        nick: 'nick-3',
        age: '18',
      },
      {
        uid: '1',
        nick: 'nick-1',
        age: '18',
      }
    ])) {
      throw new Error('Wrong answer');
    }

    return _requestTime === 3;
  } catch (err) {
    console.warn('测试运行失败');
    console.error(err);
    return false;
  }
};

export default exam3;
