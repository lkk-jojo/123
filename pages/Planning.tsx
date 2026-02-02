
import React, { useState, useEffect } from 'react';
import { Card, Button, Icon } from '../components/UI';

interface PlanningItem {
  id: number;
  text: string;
  completed: boolean;
  user?: string;
  url?: string; // 為筆記分頁新增網址屬性
}

const STORAGE_KEY = 'nagoya_planning_items';

const PlanningPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'todo' | 'luggage' | 'shopping' | 'notes'>('todo');
  const [newItemText, setNewItemText] = useState('');
  const [newItemUrl, setNewItemUrl] = useState(''); // 筆記分頁專用的網址輸入狀態
  const [editingItem, setEditingItem] = useState<PlanningItem | null>(null);
  const tripId = localStorage.getItem('shared_trip_id');

  const [items, setItems] = useState<{
    todo: PlanningItem[];
    luggage: PlanningItem[];
    shopping: PlanningItem[];
    notes: PlanningItem[];
  }>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // 確保如果舊資料沒有 notes 分頁，則初始化它
        if (!parsed.notes) parsed.notes = [];
        return parsed;
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
      ],
      notes: [
        { id: 10, text: '名古屋必吃清單部落格', completed: false, url: 'https://travel.yam.com/article/12345' },
        { id: 11, text: '吉卜力公園入園攻略', completed: false, url: 'https://ghibli-park.jp/' }
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
    
    const newItem: PlanningItem = { 
      id: Date.now(), 
      text: newItemText, 
      completed: false, 
      user: activeTab === 'todo' ? '我自己' : undefined,
      url: activeTab === 'notes' ? (newItemUrl.startsWith('http') ? newItemUrl : `https://${newItemUrl}`) : undefined
    };
    
    setItems(prev => ({ ...prev, [activeTab]: [...prev[activeTab], newItem] }));
    setNewItemText('');
    setNewItemUrl('');
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

  const openExternalUrl = (url?: string) => {
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col gap-4">
      {tripId && (
        <div className="bg-[#B5C99A]/15 border border-[#B5C99A]/50 rounded-xl p-2.5 flex items-center justify-between mx-1">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#B5C99A] rounded-full animate-ping"></div>
              <p className="text-[10px] font-black text-[#5D534A]/60">雲端同步: {tripId}</p>
           </div>
           <Icon name="cloud-check" className="text-[#B5C99A] text-xs" />
        </div>
      )}

      {/* 更新後的分頁導覽：新增「筆記」 */}
      <div className="flex bg-white p-1 rounded-full border-2 border-[#E0E5D5] soft-shadow">
        {(['todo', 'luggage', 'shopping', 'notes'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setNewItemText('');
              setNewItemUrl('');
            }}
            className={`flex-1 py-2 rounded-full text-[10px] font-black transition-all ${
              activeTab === tab ? 'bg-[#A8B58F] text-white soft-shadow' : 'text-[#8B735B] opacity-60'
            }`}
          >
            {tab === 'todo' ? '待辦' : tab === 'luggage' ? '行李' : tab === 'shopping' ? '購物' : '筆記'}
          </button>
        ))}
      </div>

      <Card className="min-h-[420px] relative pb-32 p-4">
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-black italic underline decoration-[#E0E5D5] decoration-4 underline-offset-4 uppercase tracking-tighter">
                {activeTab === 'todo' ? '📝 TODOs' : activeTab === 'luggage' ? '🧳 Luggage' : activeTab === 'shopping' ? '🛍️ Shopping' : '📑 Notes'}
            </h3>
            <span className="text-[10px] font-black bg-[#F7F4EB] px-2.5 py-1 rounded-full text-[#8B735B]">
                {items[activeTab].filter(i => i.completed).length}/{items[activeTab].length}
            </span>
         </div>

         <div className="flex flex-col gap-2">
            {items[activeTab].map(item => (
                <div key={item.id} className="flex items-start gap-2.5 p-2 bg-[#F7F4EB]/20 hover:bg-[#F7F4EB]/50 rounded-xl group transition-all border border-transparent hover:border-[#E0E5D5]">
                    {/* 筆記分頁不需要打勾，顯示筆記圖示 */}
                    {activeTab === 'notes' ? (
                      <div className="w-7 h-7 rounded-full bg-white border-2 border-[#A8B58F] text-[#A8B58F] flex-shrink-0 flex items-center justify-center mt-0.5">
                        <Icon name="bookmark" className="text-[10px]" />
                      </div>
                    ) : (
                      <button onClick={() => toggleComplete(item.id)} className={`w-7 h-7 rounded-full border-2 border-[#A8B58F] flex-shrink-0 flex items-center justify-center transition-all mt-0.5 ${item.completed ? 'bg-[#A8B58F] text-white' : 'bg-white'}`}>
                          {item.completed && <Icon name="check" className="text-[10px]" />}
                      </button>
                    )}
                    
                    <div className="flex-grow min-w-0 py-0.5" onClick={() => setEditingItem(item)}>
                        <p className={`font-bold text-sm leading-tight ${item.completed ? 'line-through opacity-30 italic' : ''}`}>{item.text}</p>
                        {'user' in item && item.user && <p className="text-[9px] opacity-40 font-bold uppercase mt-0.5">{item.user}</p>}
                        
                        {/* 筆記專屬：顯示連結按鈕 */}
                        {activeTab === 'notes' && item.url && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); openExternalUrl(item.url); }}
                            className="mt-1.5 flex items-center gap-1.5 text-[9px] font-black text-[#87A2FB] bg-white border border-[#87A2FB]/30 px-2 py-1 rounded-lg hover:bg-[#87A2FB] hover:text-white transition-all max-w-full"
                          >
                            <Icon name="link" />
                            <span className="truncate max-w-[150px]">{item.url.replace('https://', '').replace('http://', '')}</span>
                          </button>
                        )}
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 flex-shrink-0">
                      <button onClick={() => handleDeleteItem(item.id)} className="w-7 h-7 rounded-full bg-white border border-[#E0E5D5] text-red-300 flex items-center justify-center text-[10px]"><Icon name="trash" /></button>
                    </div>
                </div>
            ))}
         </div>

         {/* 動態輸入區域：筆記分頁顯示兩個欄位 */}
         <form onSubmit={handleAddItem} className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
            {activeTab === 'notes' ? (
              <div className="flex flex-col gap-2 bg-[#F7F4EB] p-2 rounded-2xl border-2 border-dashed border-[#E0E5D5]">
                <input 
                  value={newItemText} 
                  onChange={(e) => setNewItemText(e.target.value)} 
                  placeholder="輸入筆記主題..." 
                  className="bg-transparent p-2 text-sm font-bold focus:outline-none" 
                />
                <div className="flex gap-2">
                  <input 
                    value={newItemUrl} 
                    onChange={(e) => setNewItemUrl(e.target.value)} 
                    placeholder="貼上網址連結..." 
                    className="flex-grow bg-white/50 rounded-xl px-3 py-2 text-[11px] font-bold focus:outline-none focus:border-[#A8B58F] border border-transparent" 
                  />
                  <Button type="submit" className="w-10 h-10 p-0 rounded-xl flex-shrink-0"><Icon name="plus" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={newItemText} onChange={(e) => setNewItemText(e.target.value)} placeholder={`+ 新增項目...`} className="flex-grow bg-[#F7F4EB] border-2 border-dashed border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]" />
                <Button type="submit" className="w-12 h-12 p-0 rounded-xl flex-shrink-0"><Icon name="plus" /></Button>
              </div>
            )}
         </form>
      </Card>

      {editingItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <Card className="w-full max-w-sm">
            <h4 className="text-lg font-black mb-4">修改內容</h4>
            <form onSubmit={handleUpdateItem} className="flex flex-col gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black opacity-40 ml-1">主題 / 名稱</label>
                <textarea rows={2} value={editingItem.text} onChange={(e) => setEditingItem({...editingItem, text: e.target.value})} className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F] resize-none" />
              </div>
              
              {activeTab === 'notes' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black opacity-40 ml-1">連結 URL</label>
                  <input value={editingItem.url || ''} onChange={(e) => setEditingItem({...editingItem, url: e.target.value})} className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]" />
                </div>
              )}

              <div className="flex gap-3 mt-2">
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
