
import React, { useState, useEffect } from 'react';
import { Card, Icon, Button } from '../components/UI';

interface JournalEntry {
  id: number;
  user: string;
  text: string;
  date: string;
  location: string;
  image: string;
}

const STORAGE_KEY_JOURNAL = 'nagoya_trip_journal';

const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_JOURNAL);
    return saved ? JSON.parse(saved) : [
      { id: 1, user: '小鹿', text: '今天的燒肉真的太好吃了！尤其是牛舌的部分，入口即化 🤤', date: '2026-02-04', location: '新宿', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
      { id: 2, user: '我自己', text: '在名古屋城感受到了歷史的厚重。這座城堡真的好雄偉！', date: '2026-02-04', location: '名古屋城', image: 'https://images.unsplash.com/photo-1590236338093-424449b49761?auto=format&fit=crop&w=800&q=80' },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(entries));
  }, [entries]);

  const [isAdding, setIsAdding] = useState(false);
  const [newEntry, setNewEntry] = useState({
    text: '',
    location: '',
    image: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: JournalEntry = {
      id: Date.now(),
      user: '我自己',
      text: newEntry.text,
      location: newEntry.location || '名古屋',
      date: new Date().toLocaleDateString(),
      image: newEntry.image || `https://picsum.photos/seed/${Date.now()}/800/800`
    };
    setEntries([entry, ...entries]);
    setIsAdding(false);
    setNewEntry({ text: '', location: '', image: '' });
  };

  const deleteEntry = (id: number) => {
    if(window.confirm('確定刪除這篇日誌？')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black italic underline decoration-[#A8B58F] decoration-4 underline-offset-4">旅行日誌</h2>
        <div className="flex -space-x-2">
            {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/seed/${i+100}/50/50`} className="w-8 h-8 rounded-full border-2 border-white soft-shadow" alt="member" />)}
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {entries.map(post => (
          <div key={post.id} className="flex flex-col gap-3 group">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/${post.user}/50/50`} className="w-10 h-10 rounded-full border-2 border-white soft-shadow" alt="avatar" />
                    <div>
                        <h4 className="font-bold text-sm">{post.user}</h4>
                        <p className="text-[10px] opacity-60 font-bold uppercase">{post.date} • {post.location}</p>
                    </div>
                </div>
                <button onClick={() => deleteEntry(post.id)} className="opacity-0 group-hover:opacity-100 text-red-300 transition-opacity"><Icon name="trash-can" /></button>
             </div>
             
             <Card className="p-2 overflow-hidden border-none rounded-[2.5rem]">
                <img src={post.image} className="w-full aspect-square object-cover rounded-[2rem]" alt="Journal" />
                <div className="p-4">
                   <p className="text-sm leading-relaxed">{post.text}</p>
                   <div className="mt-4 flex gap-4 text-[#A8B58F]">
                      <button className="flex items-center gap-1 active:scale-90"><Icon name="heart" /> 12</button>
                      <button className="flex items-center gap-1 active:scale-90"><Icon name="comment" /> 3</button>
                   </div>
                </div>
             </Card>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <Card className="w-full max-w-md">
            <h3 className="text-xl font-black mb-6 text-center italic">紀錄此刻心情</h3>
            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <textarea required placeholder="寫下現在的心情..." rows={4} value={newEntry.text} onChange={e => setNewEntry({...newEntry, text: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-4 text-sm font-bold resize-none" />
              <input type="text" placeholder="在哪裡？" value={newEntry.location} onChange={e => setNewEntry({...newEntry, location: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold" />
              <input type="text" placeholder="照片 URL (可選)" value={newEntry.image} onChange={e => setNewEntry({...newEntry, image: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold" />
              <div className="flex gap-4 mt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setIsAdding(false)}>取消</Button>
                <Button type="submit" className="flex-1">發表</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <button onClick={() => setIsAdding(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-[#8B735B] text-white rounded-full flex items-center justify-center text-2xl soft-shadow z-[150]"><Icon name="camera" /></button>
    </div>
  );
};

export default JournalPage;
