
import React, { useState, useEffect } from 'react';
import { Card, Button, Icon } from '../components/UI';

interface PlanningItem {
  id: number;
  text: string;
  completed: boolean;
  user?: string;
}

const STORAGE_KEY = 'nagoya_planning_items';

const PlanningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'todo' | 'luggage' | 'shopping'>('todo');
  const [newItemText, setNewItemText] = useState('');
  const [editingItem, setEditingItem] = useState<PlanningItem | null>(null);
  const tripId = localStorage.getItem('shared_trip_id');

  // 初始化狀態
  const [items, setItems] = useState<{
    todo: PlanningItem[];
    luggage: PlanningItem[];
    shopping: PlanningItem[];
  }>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    return {
      todo: [
        { id: 1, text: '購買 JR Pass (記得確認是否包含指定席預約)', completed: true, user: '我自己' },
        { id: 2, text: '預約吉卜力公園門票：大倉庫、青春之丘、動動力森林', completed: false, user: '小鹿' },
        { id: 3, text: '下載名古屋地下鐵圖與離線地圖，確認主要轉乘車站出口資訊', completed: false, user: '所有人' },
      ],
      luggage: [
        { id: 4, text: '護照 & 簽證 & 數位入境證明 (Visit Japan Web)', completed: true },
        { id: 5, text: '行動電源 (10000mAh 以上) & 多國萬用轉接頭', completed: false },
        { id: 6, text: '保暖手套 & 發熱衣 & 暖暖包 (名古屋 2 月很冷！)', completed: true },
      ],
      shopping: [
        { id: 7, text: '合利他命 EX Plus 270錠 (幫鄰居大嬸帶兩罐)', completed: false },
        { id: 8, text: '名古屋蝦餅 (えびせんべいの里) - 多口味綜合包', completed: false },
        { id: 9, text: '小倉吐司抹醬 (Pasco 或是名古屋機場限定款式)', completed: false },
      ]
    };
  });

  // 當 items 改變時，自動存入 localStorage 
  // 如果有 tripId，這裡未來可以呼叫 Supabase API 實現真正的雲端同步
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    
    // 假裝同步到雲端 (Mock Cloud Sync)
    if (tripId) {
       console.log(`[Cloud Sync] Syncing data to Trip: ${tripId}`);
    }
  }, [items, tripId]);

  const toggleComplete = (id: number) => {
    setItems(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    const newItem: PlanningItem = {
      id: Date.now(),
      text: newItemText,
      completed: false,
      user: activeTab === 'todo' ? '我自己' : undefined
    };

    setItems(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItem]
    }));
    setNewItemText('');
  };

  const handleDeleteItem = (id: number) => {
    setItems(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(item => item.id !== id)
    }));
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    setItems(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(item => 
        item.id === editingItem.id ? editingItem : item
      )
    }));
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sync Banner */}
      {tripId && (
        <div className="bg-[#B5C99A]/20 border border-[#B5C99A] rounded-2xl p-3 flex items-center justify-between mx-1">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#B5C99A] rounded-full animate-ping"></div>
              <p className="text-[10px] font-black text-[#5D534A] opacity-60">雲端同步中: {tripId}</p>
           </div>
           <Icon name="cloud-check" className="text-[#B5C99A]" />
        </div>
      )}

      {/* Sub-tab Navigation */}
      <div className="flex bg-white p-1 rounded-full border-2 border-[#E0E5D5] soft-shadow">
        {(['todo', 'luggage', 'shopping'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-full text-xs font-bold transition-all ${
              activeTab === tab ? 'bg-[#A8B58F] text-white soft-shadow' : 'text-[#8B735B] opacity-60'
            }`}
          >
            {tab === 'todo' ? '待辦事項' : tab === 'luggage' ? '行李清單' : '購物清單'}
          </button>
        ))}
      </div>

      <Card className="min-h-[450px] relative pb-24">
         <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-xl font-black italic underline decoration-[#E0E5D5] decoration-4 underline-offset-4">
                {activeTab === 'todo' ? '📝 TODOs' : activeTab === 'luggage' ? '🧳 Luggage' : '🛍️ Shopping'}
            </h3>
            <span className="text-xs font-bold bg-[#F7F4EB] px-3 py-1 rounded-full text-[#8B735B]">
                {items[activeTab].filter(i => i.completed).length} / {items[activeTab].length}
            </span>
         </div>

         <div className="flex flex-col gap-3">
            {items[activeTab].length > 0 ? items[activeTab].map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 transition-all bg-[#F7F4EB]/30 hover:bg-[#F7F4EB] rounded-2xl group border border-transparent hover:border-[#E0E5D5]">
                    <button 
                      onClick={() => toggleComplete(item.id)}
                      className={`w-8 h-8 rounded-full border-2 border-[#A8B58F] flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${item.completed ? 'bg-[#A8B58F] text-white rotate-[360deg]' : 'bg-white'}`}
                    >
                        {item.completed && <Icon name="check" />}
                    </button>
                    
                    <div className="flex-grow min-w-0 py-0.5" onClick={() => setEditingItem(item)}>
                        <p className={`font-bold text-sm break-words leading-relaxed ${item.completed ? 'line-through opacity-40 italic' : ''}`}>
                            {item.text}
                        </p>
                        {'user' in item && item.user && (
                          <p className="text-[10px] opacity-40 font-bold uppercase mt-1 flex items-center gap-1">
                            <Icon name="user" className="text-[8px]" /> {item.user}
                          </p>
                        )}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
                      <button onClick={() => setEditingItem(item)} className="w-8 h-8 rounded-full bg-white border border-[#E0E5D5] text-[#8B735B] flex items-center justify-center text-xs active:scale-90"><Icon name="pen" /></button>
                      <button onClick={() => handleDeleteItem(item.id)} className="w-8 h-8 rounded-full bg-white border border-[#E0E5D5] text-red-400 flex items-center justify-center text-xs active:scale-90"><Icon name="trash" /></button>
                    </div>
                </div>
            )) : (
              <div className="py-20 text-center opacity-30 italic flex flex-col items-center gap-2">
                <Icon name="feather" className="text-4xl" />
                <p>還沒有項目喔，快來新增吧！</p>
              </div>
            )}
         </div>

         <form onSubmit={handleAddItem} className="absolute bottom-5 left-5 right-5 flex gap-2 bg-white/50 backdrop-blur-sm pt-2">
            <input 
                type="text" 
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder={`+ 新增項目...`} 
                className="flex-grow bg-[#F7F4EB] border-2 border-dashed border-[#E0E5D5] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#A8B58F] transition-all"
            />
            <Button type="submit" className="w-14 h-14 p-0 rounded-2xl flex-shrink-0">
               <Icon name="plus" className="text-xl" />
            </Button>
         </form>
      </Card>

      {editingItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <Card className="w-full max-w-sm animate-in zoom-in-95 duration-200">
            <h4 className="text-lg font-black mb-4 flex items-center gap-2">
               <Icon name="pen-to-square" className="text-[#A8B58F]" /> 修改內容
            </h4>
            <form onSubmit={handleUpdateItem} className="flex flex-col gap-4">
              <textarea 
                rows={4}
                value={editingItem.text}
                onChange={(e) => setEditingItem({...editingItem, text: e.target.value})}
                className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#A8B58F] transition-all resize-none"
              />
              {activeTab === 'todo' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold opacity-60 uppercase pl-1">分配給</label>
                  <input 
                    type="text" 
                    value={editingItem.user || ''}
                    onChange={(e) => setEditingItem({...editingItem, user: e.target.value})}
                    placeholder="例如：所有人、小鹿..."
                    className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]"
                  />
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setEditingItem(null)}>取消</Button>
                <Button type="submit" className="flex-1">確定修改</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlanningPage;
