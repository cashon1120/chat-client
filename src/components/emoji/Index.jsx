import React from 'react'
import {SmileOutlined} from '@ant-design/icons';
import './style.css'

const emojis = ['002', '008', '009', '010', '012', '014','015','016','018','023','029','037','039','042','046','048','050','051','054','058','062','064','067','083','091','093','094','107','108','109']


const Emoji = (props) => {
  const threshold = [0.01] // 这是触发时机 0.01代表出现 1%的面积出现在可视区触发一次回掉函数 threshold = [0, 0.25, 0.5, 0.75]  表示分别在0% 25% 50% 75% 时触发回掉函数

  // 利用 IntersectionObserver 监听元素是否出现在视口
  const io = new IntersectionObserver((entries)=>{ // 观察者
    entries.forEach((item)=>{ // entries 是被监听的元素集合它是一个数组
      if (item.intersectionRatio <= 0 ) return // intersectionRatio 是可见度 如果当前元素不可见就结束该函数。
      const {target} = item
      target.src = target.dataset.src // 将 h5 自定义属性赋值给 src (进入可见区则加载图片)
    })
  }, {
    threshold, // 添加触发时机数组
  });

  const onload = (e)=>{
    console.log(e.target)
    io.observe(e.target) // 添加需要被观察的元素。
  }

  return <div className="emoji">
    <SmileOutlined />
    <div className="emoji-container">
      <ul>
        {emojis.map(item => <li key={item} onClick={() => props.sendEmoji(item)}><img data-src={`/assets/emoji/streamline-${item}--office-zoo--140x140.png`} onLoad={onload} src="/avatar.jpg" alt="" /></li>)}
      </ul>
    </div>
  </div>
}
export default Emoji