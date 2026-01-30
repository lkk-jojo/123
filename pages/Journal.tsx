
import React, { useState, useEffect } from 'react';
import { Card, Icon, Button } from '../components/UI';

interface JournalEntry {
  id: string;
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // 關鍵：確保 ID 全為字串，防止刪除時因型別不同而失效
          return parsed.map(e => ({ ...e, id: String(e.id) }));
        }
      } catch (e) {
        console.error("載入日誌失敗", e);
      }
    }
    return [
      { id: '1', user: '小鹿', text: '今天的燒肉真的太好吃了！尤其是牛舌的部分，入口即化 🤤', date: '2026-02-04', location: '名古屋 敘敘苑', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
      { id: '2', user: '我自己', text: '在名古屋城感受到了歷史的厚重。這座城堡真的好雄偉！', date: '2026-02-04', location: '名古屋城', image: 'https://images.unsplash.com/photo-1590236338093-424449b49761?auto=format&fit=crop&w=800&q=80' },
    ];
  });

  // 當 entries 更新時同步到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(entries));
  }, [entries]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
  
  const [formData, setFormData] = useState({
    text: '',
    location: '',
    image: ''
  });

  const handleOpenAdd = () => {
    setEditingEntry(null);
    setFormData({ text: '', location: '', image: '' });
    setModalConfirmDelete(false);
    setConfirmDeleteId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: JournalEntry, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // 防止冒泡
    setEditingEntry(entry);
    setFormData({
      text: entry.text,
      location: entry.location,
      image: entry.image
    });
    setModalConfirmDelete(false);
    setConfirmDeleteId(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    if (editingEntry) {
      setEntries(prev => prev.map(e => String(e.id) === String(editingEntry.id) ? {
        ...e,
        text: formData.text,
        location: formData.location || '名古屋',
        image: formData.image || e.image
      } : e));
    } else {
      const newPost: JournalEntry = {
        id: String(Date.now()),
        user: '我自己',
        text: formData.text,
        location: formData.location || '名古屋',
        date: new Date().toLocaleDateString('zh-TW'),
        image: formData.image || `https://picsum.photos/seed/${Date.now()}/800/800`
      };
      setEntries([newPost, ...entries]);
    }
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  // 強制刪除函數
  const executeDelete = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const targetId = String(id);
    
    // 同步更新狀態與快取
    setEntries(prev => {
      const filtered = prev.filter(item => String(item.id) !== targetId);
      localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(filtered));
      return filtered;
    });

    // 關閉所有視窗與重置狀態
    setConfirmDeleteId(null);
    setModalConfirmDelete(false);
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-2xl font-black italic underline decoration-[#A8B58F] decoration-4 underline-offset-4">旅行日誌</h2>
        <div className="flex -space-x-2">
            {[1,2,3].map(i => <img key={i} src={`https://picsum.photos/seed/${i+100}/50/50`} className="w-8 h-8 rounded-full border-2 border-white soft-shadow" alt="member" />)}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {entries.length > 0 ? entries.map(post => {
          const isConfirming = confirmDeleteId === post.id;
          return (
            <div key={post.id} className="flex flex-col gap-3 group animate-in fade-in duration-500">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                      <img src={`https://picsum.photos/seed/${post.user}/50/50`} className="w-10 h-10 rounded-full border-2 border-white soft-shadow" alt="avatar" />
                      <div>
                          <h4 className="font-bold text-sm">{post.user}</h4>
                          <p className="text-[10px] opacity-60 font-black uppercase tracking-wider">{post.date} • {post.location}</p>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => handleOpenEdit(post, e)} 
                      className="w-8 h-8 rounded-full bg-white border border-[#E0E5D5] text-[#8B735B] flex items-center justify-center active:scale-90 opacity-40 hover:opacity-100 transition-all"
                    >
                      <Icon name="pen" className="text-[10px]" />
                    </button>
                    
                    <div className="relative">
                      {isConfirming ? (
                        <div className="flex items-center bg-red-500 rounded-full overflow-hidden shadow-sm animate-in slide-in-from-right-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} 
                            className="px-2 py-1 text-white border-r border-white/20"
                          >
                            <Icon name="xmark" className="text-[10px]" />
                          </button>
                          <button 
                            onClick={(e) => executeDelete(post.id, e)} 
                            className="px-3 py-1 text-white text-[10px] font-black active:bg-red-600"
                          >
                            確定
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(post.id); }} 
                          className="w-8 h-8 rounded-full bg-white border border-[#E0E5D5] text-red-200 flex items-center justify-center active:scale-90 hover:text-red-500 transition-all"
                        >
                          <Icon name="trash-can" className="text-[10px]" />
                        </button>
                      )}
                    </div>
                  </div>
               </div>

               <Card className="p-2 overflow-hidden border-none rounded-[2.5rem]" onClick={() => !isConfirming && handleOpenEdit(post)}>
                  <div className="relative overflow-hidden rounded-[2rem]">
                    <img src={post.image} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" alt="Journal" />
                  </div>
                  <div className="p-4">
                     <p className="text-sm leading-relaxed font-medium text-[#5D534A]">{post.text}</p>
                     <div className="mt-4 flex gap-4 text-[#A8B58F]">
                        <button className="flex items-center gap-1.5 text-xs font-bold active:scale-90"><Icon name="heart" /> 12</button>
                        <button className="flex items-center gap-1.5 text-xs font-bold active:scale-90"><Icon name="comment" /> 3</button>
                     </div>
                  </div>
               </Card>
            </div>
          );
        }) : (
          <div className="py-20 text-center opacity-30 italic text-sm">尚無任何日誌</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6" onClick={() => setIsModalOpen(false)}>
          <Card className="w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black italic">{editingEntry ? '編輯此刻心情' : '紀錄此刻心情'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="opacity-30 p-2"><Icon name="xmark" className="text-xl" /></button>
            </div>
            
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <textarea 
                required placeholder="寫下現在的心情..." rows={4} 
                value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} 
                className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-4 text-sm font-bold resize-none focus:outline-none focus:border-[#A8B58F]" 
              />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="在哪裡？" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]" />
                <input type="text" placeholder="照片 URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]" />
              </div>

              <div className="flex gap-3 mt-4">
                {editingEntry && (
                  <button 
                    type="button"
                    onClick={() => modalConfirmDelete ? executeDelete(editingEntry.id) : setModalConfirmDelete(true)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${modalConfirmDelete ? 'bg-red-500 text-white animate-pulse' : 'bg-red-50 text-red-400 border border-red-100'}`}
                  >
                    <Icon name={modalConfirmDelete ? "check" : "trash"} />
                  </button>
                )}
                <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>取消</Button>
                <Button type="submit" className="flex-[2] bg-[#8B735B]">儲存發表</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <button type="button" onClick={handleOpenAdd} className="fixed bottom-24 right-6 w-14 h-14 bg-[#8B735B] text-white rounded-full flex items-center justify-center text-2xl soft-shadow z-[150] active:scale-90 shadow-lg">
        <Icon name="camera" />
      </button>
    </div>
  );
};

export default JournalPage;
