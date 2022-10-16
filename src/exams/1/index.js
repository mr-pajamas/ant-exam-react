/**
 * 第一题
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './style.scss';

/**
 * 渲染测试数据
 */
const cardDataList = [
  {
    title: '杭州市通用5元券',
    subTitle: '杭味面馆非常好吃，太好吃了，相当不错，味道鲜美，特别划算，快快抢购，聚划算',
  },
  {
    title: '杭州市10元券',
    subTitle: '兰州拉面非常好吃',
  },
];

const sleep = (millis) => new Promise((resolve) => setTimeout(resolve, millis));

/**
 * 卡片组件
 */
const Card = ({ data }) => {
  // -------- 在这里完成代码 --------
  const [countDown, setCountDown] = useState(10);
  const [doneIds, setDoneIds] = useState([]);
  const [doingIds, setDoingIds] = useState([]);

  const btnText = useMemo(() => {
    if (countDown) return `${countDown}s`;
    if (doingIds.includes(data.title)) return '...';
    if (doneIds.includes(data.title)) return '已抢购';
    return '抢购';
  }, [data, countDown, doingIds, doneIds]);

  const sendRequest = useCallback(async ({ title }) => {
    setDoingIds((ids) => ids.concat(title));
    try {
      await sleep(1000);
      setDoneIds((ids) => ids.concat(title));
    } finally {
      setDoingIds((ids) => {
        const nids = [...ids];
        nids.splice(nids.indexOf(title), 1);
        return nids;
      });
    }
  }, []);

  useEffect(() => {
    const tid = countDown && setTimeout(() => {
      setCountDown((pc) => pc - 1);
    }, 1000);

    return () => tid && clearTimeout(tid);
  }, [countDown]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title">{data.title}</div>
        <div className="card-subtitle">{data.subTitle}</div>
      </div>
      <button
        className={['card-btn', ...(doingIds.includes(data.title) ? ['loading'] : [])].join(' ')}
        disabled={!!countDown || doingIds.includes(data.title) || doneIds.includes(data.title)}
        onClick={() => sendRequest(data)}
      >{btnText}</button>
    </div>
  );
};

/**
 * 以下为测试用例，无需修改
 */
const Exam1 = () => cardDataList.map((data) => <Card key={data.title} data={data} />);

export default Exam1;
