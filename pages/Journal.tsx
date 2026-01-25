
import React from 'react';
import { Card, Icon } from '../components/UI';

const JournalPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black italic underline decoration-[#A8B58F] decoration-4 underline-offset-4">旅行日記</h2>
        <div className="flex -space-x-3">
            {[1,2,3].map(i => (
                <img key={i} src={`https://picsum.photos/seed/${i+10}/50/50`} className="w-8 h-8 rounded-full border-2 border-white soft-shadow" />
            ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-10">
        {[
          { id: 1, user: '小鹿', text: '今天的燒肉真的太好吃了！尤其是牛舌的部分，入口即化 🤤', date: '1小時前', location: '新宿', image: 'https://picsum.photos/seed/yakiniku/500/500' },
          { id: 2, user: '我自己', text: '在明治神宮感受到了城市中的寧靜。這片森林真的好美！', date: '4小時前', location: '明治神宮', image: 'https://picsum.photos/seed/shrine/500/500' },
        ].map(post => (
          <div key={post.id} className="flex flex-col gap-3">
             <div className="flex items-center gap-3 px-2">
                <img src={`https://picsum.photos/seed/${post.user}/50/50`} className="w-10 h-10 rounded-full border-2 border-white soft-shadow" />
                <div>
                   <h4 className="font-bold text-sm">{post.user}</h4>
                   <p className="text-[10px] opacity-60 font-bold uppercase">{post.date} • {post.location}</p>
                </div>
             </div>
             
             <Card className="p-2 overflow-hidden border-none rounded-[2.5rem]">
                <img src={post.image} className="w-full aspect-square object-cover rounded-[2rem]" alt="Journal" />
                <div className="p-4">
                   <p className="text-sm leading-relaxed">{post.text}</p>
                   <div className="mt-4 flex gap-4 text-[#A8B58F]">
                      <button className="flex items-center gap-1 active:scale-90"><Icon name="heart" /> 12</button>
                      <button className="flex items-center gap-1 active:scale-90"><Icon name="comment" /> 3</button>
                      <button className="flex items-center gap-1 active:scale-90"><Icon name="share" /></button>
                   </div>
                </div>
             </Card>
          </div>
        ))}
      </div>

      <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#8B735B] text-white rounded-full flex items-center justify-center text-2xl soft-shadow">
        <Icon name="camera" />
      </button>
    </div>
  );
};

export default JournalPage;
