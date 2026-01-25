
import React from 'react';
import { Card, Button, Icon } from '../components/UI';
import { MOCK_MEMBERS } from '../constants';

const MembersPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black">旅行小夥伴 ({MOCK_MEMBERS.length})</h2>
        <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
           <Icon name="user-plus" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {MOCK_MEMBERS.map(member => (
          <Card key={member.id} className="flex items-center gap-4">
             <div className="relative">
                <img src={member.avatar} className="w-16 h-16 rounded-[1.5rem] border-2 border-white soft-shadow" alt={member.name} />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#B5C99A] rounded-full border-2 border-white flex items-center justify-center">
                    <Icon name="check" className="text-white text-[10px]" />
                </div>
             </div>
             <div className="flex-grow">
                <h3 className="font-bold text-lg">{member.name} {member.id === '1' && '(團長)'}</h3>
                <p className="text-xs opacity-60">負責：行程規劃、地圖導航</p>
             </div>
             <button className="text-[#8B735B] opacity-40 hover:opacity-100 transition-opacity">
                <Icon name="ellipsis-vertical" />
             </button>
          </Card>
        ))}
      </div>

      <Card className="bg-[#E9D5CA] border-none mt-4">
          <h4 className="font-black italic text-lg mb-2">💡 小提醒</h4>
          <p className="text-sm opacity-80 leading-relaxed">
             團體旅行中，記得隨時跟夥伴分享你的位置和心情喔！大家一起分擔記帳也能讓結算更輕鬆。
          </p>
      </Card>

      <div className="flex flex-col items-center gap-2 mt-10 opacity-40">
        <div className="w-16 h-1 bg-[#E0E5D5] rounded-full"></div>
        <p className="text-[10px] font-black tracking-widest uppercase italic">Made with Love in Tokyo</p>
      </div>
    </div>
  );
};

export default MembersPage;
