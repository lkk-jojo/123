
import React, { useState, useMemo, useEffect } from 'react';
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

const STORAGE_KEY_SCHEDULE = 'nagoya_trip_schedule';

const SchedulePage: React.FC = () => {
  const tripStartDate = '2026-02-04';
  const [selectedDate, setSelectedDate] = useState(tripStartDate);
  
  const [items, setItems] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_SCHEDULE);
    return saved ? JSON.parse(saved) : MOCK_SCHEDULE;
  });

  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SCHEDULE, JSON.stringify(items));
  }, [items]);
  
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

  const handleDelete = (id: string) => {
    if(window.confirm('確定要刪除？')) {
      setItems(prev => prev.filter(item => item.id !== id));
      setEditingItem(null);
    }
  };

  const openGoogleMaps = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
  };

  const categories: Category[] = ['attraction', 'food', 'transport', 'hotel', 'entertainment'];

  return (
    <div className="flex flex-col gap-1.5">
      {/* 頂部日期選單：寬度高度縮小約 5% */}
      <div className="flex overflow-x-auto gap-2 pb-1.5 -mx-4 px-4 scrollbar-hide">
        {dates.map((date, idx) => {
          const isSelected = selectedDate === date;
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 w-[3.75rem] h-[4.3rem] rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                isSelected ? 'bg-[#A8B58F] border-[#A8B58F] text-white scale-105 soft-shadow' : 'bg-white border-[#E0E5D5]'
              }`}
            >
              <span className="text-[8.5px] font-bold opacity-60 uppercase leading-none">D{idx + 1}</span>
              <span className="text-lg font-black leading-none my-0.5">{date.split('-')[2]}</span>
              <span className="text-[7.5px] uppercase font-bold opacity-60 leading-none">Feb</span>
            </button>
          );
        })}
      </div>

      {/* 天氣卡片：同步微縮 */}
      <Card className="flex items-center justify-between bg-gradient-to-r from-[#87A2FB] to-[#B5C99A] text-white border-none relative overflow-hidden p-2">
        <div className="absolute -right-2 -bottom-1 opacity-20 text-5xl rotate-12"><Icon name="sun" /></div>
        <div className="flex items-center gap-2 relative z-10">
          <div className="text-xl">❄️</div>
          <div>
            <h3 className="font-bold text-[10px] leading-tight">今日：晴</h3>
            <p className="text-[8.5px] opacity-80">8°C / 2°C • 名古屋</p>
          </div>
        </div>
        <div className="text-right relative z-10 pr-1">
          <p className="text-[7.5px] font-black uppercase tracking-widest opacity-70 leading-none">Status</p>
          <p className="text-sm font-black italic leading-tight">{countdownText}</p>
        </div>
      </Card>

      {/* 行程列表：壓縮垂直距離與 Padding (縮小 10%) */}
      <div className="relative pl-4 mt-0.5">
        <div className="absolute left-[23px] top-0 bottom-0 w-1 bg-[#E0E5D5] rounded-full"></div>
        <div className="flex flex-col gap-[0.4rem]"> 
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <div key={item.id} className="relative flex gap-3 group">
              <div className="mt-2 w-5 h-5 rounded-full bg-white border-4 border-[#A8B58F] z-10 flex-shrink-0"></div>
              {/* Card Padding 從 p-2 降為 p-1.5 */}
              <Card className="flex-grow p-1.5 relative group hover:border-[#A8B58F] transition-colors rounded-[1.5rem]">
                <button onClick={() => setEditingItem({ ...item })} className="absolute top-1 right-1 text-[#8B735B] opacity-0 group-hover:opacity-100 transition-opacity bg-[#F7F4EB] w-5 h-5 rounded-full flex items-center justify-center border border-[#E0E5D5] z-20">
                  <Icon name="pen" className="text-[8px]" />
                </button>
                <div className="flex justify-between items-start mb-0">
                  <span className="text-[10.5px] font-black text-[#8B735B]">{item.time}</span>
                  <Badge color={COLORS.categories[item.category as keyof typeof COLORS.categories] || '#A8B58F'}>
                    <span className="text-[8.5px] leading-none">{CATEGORY_LABELS[item.category as Category] || item.category}</span>
                  </Badge>
                </div>
                <h4 className="font-bold text-[13px] mb-0.5 leading-tight pr-5 text-[#5D534A]">{item.title}</h4>
                <div className="flex justify-between items-end mt-0.5">
                  <p className="text-[9.5px] text-opacity-60 flex items-center gap-1 italic max-w-[65%]">
                    <Icon name="location-dot" className="text-[#A8B58F] text-[8px]" /> <span className="truncate">{item.location}</span>
                  </p>
                  <button onClick={() => openGoogleMaps(item.location)} className="flex items-center gap-1 px-1.5 py-0.5 bg-[#F7F4EB] hover:bg-[#A8B58F] hover:text-white text-[#8B735B] rounded-full text-[7.5px] font-black transition-all border border-[#E0E5D5]">
                    <Icon name="map-location-dot" /> <span>導航</span>
                  </button>
                </div>
              </Card>
            </div>
          )) : (
            <div className="py-6 text-center opacity-50 italic text-[10px]">暫無行程</div>
          )}
        </div>
      </div>
      
      {/* Modals & Add Button */}
      {(editingItem || isAdding) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <Card className="w-full max-w-md p-5">
            <h3 className="text-lg font-black mb-4 text-center italic">{isAdding ? '新冒險' : '編輯行程'}</h3>
            <form onSubmit={isAdding ? handleSaveNew : handleSaveEdit} className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                <input type="time" required value={isAdding ? newItem.time : editingItem.time} onChange={e => isAdding ? setNewItem({...newItem, time: e.target.value}) : setEditingItem({...editingItem, time: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-2.5 text-xs font-bold" />
                <select value={isAdding ? newItem.category : editingItem.category} onChange={e => isAdding ? setNewItem({...newItem, category: e.target.value as Category}) : setEditingItem({...editingItem, category: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-2.5 text-xs font-bold">
                  {categories.map(cat => <option key={cat} value={cat}>{CATEGORY_LABELS[cat]}</option>)}
                </select>
              </div>
              <input type="text" required placeholder="標題" value={isAdding ? newItem.title : editingItem.title} onChange={e => isAdding ? setNewItem({...newItem, title: e.target.value}) : setEditingItem({...editingItem, title: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-2.5 text-xs font-bold" />
              <input type="text" required placeholder="地點" value={isAdding ? newItem.location : editingItem.location} onChange={e => isAdding ? setNewItem({...newItem, location: e.target.value}) : setEditingItem({...editingItem, location: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-2.5 text-xs font-bold" />
              <div className="flex gap-2 mt-2">
                {!isAdding && <Button variant="ghost" className="p-2.5" onClick={() => handleDelete(editingItem.id)}><Icon name="trash" className="text-red-400" /></Button>}
                <Button variant="ghost" className="flex-1" onClick={() => { setEditingItem(null); setIsAdding(false); }}>取消</Button>
                <Button type="submit" className="flex-grow">儲存</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      <button onClick={() => setIsAdding(true)} className="fixed bottom-24 right-5 w-11 h-11 bg-[#8B735B] text-white rounded-full flex items-center justify-center text-lg soft-shadow z-[110] active:scale-90 transition-transform">
        <Icon name="plus" />
      </button>
    </div>
  );
};

export default SchedulePage;
