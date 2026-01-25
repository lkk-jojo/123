
import React, { useState, useMemo } from 'react';
import { Card, Badge, Icon, Button } from '../components/UI';
import { COLORS, MOCK_SCHEDULE } from '../constants';
import { Category } from '../types';

const CATEGORY_LABELS: Record<Category, string> = {
  attraction: '景點',
  food: '美食',
  transport: '交通',
  hotel: '住宿',
  entertainment: '娛樂'
};

const SchedulePage: React.FC = () => {
  const tripStartDate = '2026-02-04';
  const [selectedDate, setSelectedDate] = useState(tripStartDate);
  const [items, setItems] = useState(MOCK_SCHEDULE);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  // 計算倒數天數
  const countdownText = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(tripStartDate);
    start.setHours(0, 0, 0, 0);
    
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) return `倒數 ${diffDays} 天`;
    if (diffDays === 0) return "今天出發！";
    return "大冒險中！";
  }, []);

  // 初始化新行程的模板
  const [newItem, setNewItem] = useState({
    time: '09:00',
    title: '',
    location: '',
    category: 'attraction' as Category,
  });
  
  const dates = ['2026-02-04', '2026-02-05', '2026-02-06', '2026-02-07', '2026-02-08'];
  const filteredItems = items.filter(item => item.date === selectedDate)
                             .sort((a, b) => a.time.localeCompare(b.time));

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setItems(prev => prev.map(item => item.id === editingItem.id ? editingItem : item));
    setEditingItem(null);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    const itemToAdd = {
      ...newItem,
      id: `s-${Date.now()}`,
      date: selectedDate
    };
    setItems(prev => [...prev, itemToAdd]);
    setIsAdding(false);
    setNewItem({ time: '09:00', title: '', location: '', category: 'attraction' });
  };

  const openGoogleMaps = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  const categories: Category[] = ['attraction', 'food', 'transport', 'hotel', 'entertainment'];

  return (
    <div className="flex flex-col gap-6">
      {/* Date Selector */}
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
        {dates.map((date, idx) => {
          const isSelected = selectedDate === date;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 w-20 h-24 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${
                isSelected ? 'bg-[#A8B58F] border-[#A8B58F] text-white scale-105 soft-shadow' : 'bg-white border-[#E0E5D5]'
              }`}
            >
              <span className="text-xs font-bold opacity-60">Day {idx + 1}</span>
              <span className="text-2xl font-black">{date.split('-')[2]}</span>
              <span className="text-[10px] uppercase font-bold">Feb</span>
            </button>
          );
        })}
      </div>

      {/* Weather Card */}
      <Card className="flex items-center justify-between bg-gradient-to-r from-[#87A2FB] to-[#B5C99A] text-white border-none relative overflow-hidden">
        <div className="absolute -right-2 -bottom-2 opacity-20 text-6xl rotate-12">
            <Icon name="sun" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="text-4xl animate-bounce duration-[3000ms]">❄️</div>
          <div>
            <h3 className="font-bold">今日天氣：晴</h3>
            <p className="text-sm opacity-80">8°C / 2°C • 名古屋冬日</p>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Distance to Trip</p>
          <p className="text-2xl font-black italic">{countdownText}</p>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative pl-4">
        <div className="absolute left-[23px] top-0 bottom-0 w-1 bg-[#E0E5D5] rounded-full"></div>
        <div className="flex flex-col gap-6">
          {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
            <div key={item.id} className="relative flex gap-6 group">
              <div className="mt-2 w-5 h-5 rounded-full bg-white border-4 border-[#A8B58F] z-10 flex-shrink-0"></div>
              
              <Card className="flex-grow p-4 relative group hover:border-[#A8B58F] transition-colors">
                <button 
                  onClick={() => setEditingItem({ ...item })}
                  className="absolute top-4 right-4 text-[#8B735B] opacity-0 group-hover:opacity-100 transition-opacity bg-[#F7F4EB] w-8 h-8 rounded-full flex items-center justify-center border border-[#E0E5D5]"
                >
                  <Icon name="pen" className="text-xs" />
                </button>

                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-black text-[#8B735B]">{item.time}</span>
                  <Badge color={COLORS.categories[item.category as keyof typeof COLORS.categories] || '#A8B58F'}>
                    {CATEGORY_LABELS[item.category as Category] || item.category}
                  </Badge>
                </div>
                <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                
                <div className="flex justify-between items-end mt-2">
                  <p className="text-xs text-opacity-60 flex items-center gap-1 italic max-w-[70%]">
                    <Icon name="location-dot" className="text-[#A8B58F]" /> 
                    <span className="truncate">{item.location}</span>
                  </p>
                  
                  {/* Google Maps Shortcut */}
                  <button 
                    onClick={() => openGoogleMaps(item.location)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F4EB] hover:bg-[#A8B58F] hover:text-white text-[#8B735B] rounded-full text-[10px] font-black transition-all border border-[#E0E5D5] active:scale-90"
                  >
                    <Icon name="map-location-dot" />
                    <span>查看地圖</span>
                  </button>
                </div>
              </Card>
            </div>
          )) : (
            <div className="py-10 text-center opacity-50 italic">這天還沒有行程喔，點擊下方新增吧！</div>
          )}
        </div>
      </div>
      
      {/* Edit / Add Modal */}
      {(editingItem || isAdding) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <Card className="w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-xl font-black mb-6 text-center italic underline decoration-[#A8B58F] decoration-4 underline-offset-4">
              {isAdding ? '開啟新的冒險' : '編輯冒險行程'}
            </h3>
            <form onSubmit={isAdding ? handleSaveNew : handleSaveEdit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold opacity-60 pl-1">時間</label>
                  <input 
                    type="time" 
                    required
                    value={isAdding ? newItem.time : editingItem.time} 
                    onChange={e => isAdding ? setNewItem({...newItem, time: e.target.value}) : setEditingItem({...editingItem, time: e.target.value})}
                    className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold opacity-60 pl-1">類別</label>
                  <select 
                    value={isAdding ? newItem.category : editingItem.category} 
                    onChange={e => isAdding ? setNewItem({...newItem, category: e.target.value as Category}) : setEditingItem({...editingItem, category: e.target.value})}
                    className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-60 pl-1">標題</label>
                <input 
                  type="text" 
                  required
                  placeholder="例如：名古屋電視塔看夜景"
                  value={isAdding ? newItem.title : editingItem.title} 
                  onChange={e => isAdding ? setNewItem({...newItem, title: e.target.value}) : setEditingItem({...editingItem, title: e.target.value})}
                  className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-60 pl-1">地點</label>
                <input 
                  type="text" 
                  required
                  placeholder="輸入地點名稱"
                  value={isAdding ? newItem.location : editingItem.location} 
                  onChange={e => isAdding ? setNewItem({...newItem, location: e.target.value}) : setEditingItem({...editingItem, location: e.target.value})}
                  className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]"
                />
              </div>

              <div className="flex gap-4 mt-4">
                <Button variant="ghost" className="flex-1" onClick={() => { setEditingItem(null); setIsAdding(false); }}>取消</Button>
                <Button type="submit" className="flex-1">{isAdding ? '加入行程' : '儲存更新'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAdding(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#8B735B] text-white rounded-full flex items-center justify-center text-2xl soft-shadow transition-transform active:rotate-90 z-[110]"
      >
        <Icon name="plus" />
      </button>
    </div>
  );
};

export default SchedulePage;
