
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
        { id: 2, text: '預約吉卜力公園門票：大倉庫、青春之丘', completed: false, user: '小鹿' },
        { id: 3, text: '下載名古屋地下鐵圖與離線地圖', completed: false, user: '所有人' },
      ],
      luggage: [
        { id: 4, text: '護照 & 簽證 & Visit Japan Web', completed: true },
        { id: 5, text: '行動電源 & 多國萬用轉接頭', completed: false },
        { id: 6, text: '保暖手套 & 發熱衣 (名古屋 2 月冷！)', completed: true },
      ],
      shopping: [
        { id: 7, text: '合利他命 EX Plus 270錠', completed: false },
        { id: 8, text: '名古屋蝦餅 (えびせんべいの里)', completed: false },
        { id: 9, text: '小倉吐司抹醬 (Pasco 限定)', completed: false },
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

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
    const newItem: PlanningItem = { id: Date.now(), text: newItemText, completed: false, user: activeTab === 'todo' ? '我自己' : undefined };
    setItems(prev => ({ ...prev, [activeTab]: [...prev[activeTab], newItem] }));
    setNewItemText('');
  };

  const handleDeleteItem = (id: number) => {
    setItems(prev => ({ ...prev, [activeTab]: prev[activeTab].filter(item => item.id !== id) }));
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setItems(prev => ({ ...prev, [activeTab]: prev[activeTab].map(item => item.id === editingItem.id ? editingItem : item) }));
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col gap-4"> {/* gap-6 -> gap-4 */}
      {tripId && (
        <div className="bg-[#B5C99A]/15 border border-[#B5C99A]/50 rounded-xl p-2.5 flex items-center justify-between mx-1">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#B5C99A] rounded-full animate-ping"></div>
              <p className="text-[10px] font-black text-[#5D534A]/60">雲端同步: {tripId}</p>
           </div>
           <Icon name="cloud-check" className="text-[#B5C99A] text-xs" />
        </div>
      )}

      <div className="flex bg-white p-1 rounded-full border-2 border-[#E0E5D5] soft-shadow">
        {(['todo', 'luggage', 'shopping'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-full text-[11px] font-black transition-all ${
              activeTab === tab ? 'bg-[#A8B58F] text-white soft-shadow' : 'text-[#8B735B] opacity-60'
            }`}
          >
            {tab === 'todo' ? '待辦' : tab === 'luggage' ? '行李' : '購物'}
          </button>
        ))}
      </div>

      <Card className="min-h-[400px] relative pb-20 p-4">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black italic underline decoration-[#E0E5D5] decoration-4 underline-offset-4 uppercase tracking-tighter">
                {activeTab === 'todo' ? '📝 TODOs' : activeTab === 'luggage' ? '🧳 Luggage' : '🛍️ Shopping'}
            </h3>
            <span className="text-[10px] font-black bg-[#F7F4EB] px-2.5 py-1 rounded-full text-[#8B735B]">
                {items[activeTab].filter(i => i.completed).length}/{items[activeTab].length}
            </span>
         </div>

         <div className="flex flex-col gap-2"> {/* gap-3 -> gap-2 */}
            {items[activeTab].map(item => (
                <div key={item.id} className="flex items-start gap-2.5 p-2 bg-[#F7F4EB]/20 hover:bg-[#F7F4EB]/50 rounded-xl group transition-all border border-transparent hover:border-[#E0E5D5]">
                    <button onClick={() => toggleComplete(item.id)} className={`w-7 h-7 rounded-full border-2 border-[#A8B58F] flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${item.completed ? 'bg-[#A8B58F] text-white' : 'bg-white'}`}>
                        {item.completed && <Icon name="check" className="text-[10px]" />}
                    </button>
                    <div className="flex-grow min-w-0 py-0.5" onClick={() => setEditingItem(item)}>
                        <p className={`font-bold text-sm leading-tight ${item.completed ? 'line-through opacity-30 italic' : ''}`}>{item.text}</p>
                        {'user' in item && item.user && <p className="text-[9px] opacity-40 font-bold uppercase mt-0.5">{item.user}</p>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 flex-shrink-0">
                      <button onClick={() => handleDeleteItem(item.id)} className="w-7 h-7 rounded-full bg-white border border-[#E0E5D5] text-red-300 flex items-center justify-center text-[10px]"><Icon name="trash" /></button>
                    </div>
                </div>
            ))}
         </div>

         <form onSubmit={handleAddItem} className="absolute bottom-4 left-4 right-4 flex gap-2">
            <input value={newItemText} onChange={(e) => setNewItemText(e.target.value)} placeholder={`+ 新增...`} className="flex-grow bg-[#F7F4EB] border-2 border-dashed border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]" />
            <Button type="submit" className="w-12 h-12 p-0 rounded-xl flex-shrink-0"><Icon name="plus" /></Button>
         </form>
      </Card>

      {editingItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <Card className="w-full max-w-sm">
            <h4 className="text-lg font-black mb-4">修改內容</h4>
            <form onSubmit={handleUpdateItem} className="flex flex-col gap-3">
              <textarea rows={3} value={editingItem.text} onChange={(e) => setEditingItem({...editingItem, text: e.target.value})} className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F] resize-none" />
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setEditingItem(null)}>取消</Button>
                <Button type="submit" className="flex-1">儲存</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PlanningPage;
