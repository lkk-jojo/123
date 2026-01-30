
import React, { useState, useEffect, useRef } from 'react';
import SchedulePage from './pages/Schedule';
import BookingsPage from './pages/Bookings';
import ExpensePage from './pages/Expense';
import JournalPage from './pages/Journal';
import PlanningPage from './pages/Planning';
import { Card, Button, Icon } from './components/UI';

const tabs = [
  { id: 'schedule', label: '行程', icon: 'calendar-days' },
  { id: 'bookings', label: '預訂', icon: 'ticket' },
  { id: 'expense', label: '記帳', icon: 'wallet' },
  { id: 'journal', label: '日誌', icon: 'book' },
  { id: 'planning', label: '準備', icon: 'list-check' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [tripId, setTripId] = useState(() => localStorage.getItem('shared_trip_id') || '');
  const [tempTripId, setTempTripId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUrl = window.location.href;

  const exportAllData = () => {
    const data: Record<string, string | null> = {};
    const keys = [
      'nagoya_trip_schedule',
      'nagoya_trip_expenses',
      'nagoya_trip_journal',
      'nagoya_planning_items',
      'shared_trip_id'
    ];
    
    keys.forEach(key => {
      data[key] = localStorage.getItem(key);
    });

    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nagoya-play-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('備份檔案已下載！');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.keys(data).forEach(key => {
          if (data[key]) localStorage.setItem(key, data[key]);
        });
        alert('資料還原成功！');
        window.location.reload();
      } catch (err) {
        alert('還原失敗');
      }
    };
    reader.readAsText(file);
  };

  const handleSaveTripId = () => {
    const formattedId = tempTripId.trim().toUpperCase();
    if (!formattedId) return;
    localStorage.setItem('shared_trip_id', formattedId);
    setTripId(formattedId);
    setShowSyncModal(false);
  };

  const clearSync = () => {
    if(window.confirm('確定要切換回本地模式嗎？')) {
      localStorage.removeItem('shared_trip_id');
      setTripId('');
      setShowSyncModal(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule': return <SchedulePage />;
      case 'bookings': return <BookingsPage />;
      case 'expense': return <ExpensePage />;
      case 'journal': return <JournalPage />;
      case 'planning': return <PlanningPage />;
      default: return <SchedulePage />;
    }
  };

  return (
    <div className="min-h-screen pb-24 text-[#5D534A] max-w-lg mx-auto bg-[#F7F4EB] shadow-2xl shadow-black/5 relative">
      {/* Header: 壓縮 Padding (p-6 pt-12 -> px-4 py-3 pt-10) */}
      <header className="px-4 py-3 pt-10 sticky top-0 bg-[#F7F4EB]/90 backdrop-blur-md z-[60] flex justify-between items-center border-b border-[#E0E5D5]/50">
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#8B735B] italic leading-none">NAGOYA <span className="text-[#A8B58F]">PLAY</span></h1>
          <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">Feb 04 - Feb 08, 2026</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => setShowShareModal(true)}
            className="w-9 h-9 rounded-full bg-white border-2 border-[#E0E5D5] text-[#8B735B] flex items-center justify-center active:scale-90 transition-all soft-shadow"
          >
            <Icon name="share-nodes" className="text-xs" />
          </button>
          <button 
            onClick={() => { setTempTripId(tripId); setShowSyncModal(true); }}
            className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border-2 transition-all active:scale-90 ${tripId ? 'bg-[#B5C99A] border-[#B5C99A] text-white soft-shadow' : 'bg-white border-[#E0E5D5] text-[#8B735B]'}`}
          >
            <Icon name={tripId ? "users" : "cloud"} className="text-[10px]" />
            <span className="text-[9px] font-black">{tripId ? tripId : '同步'}</span>
          </button>
        </div>
      </header>

      {/* Main Content: 壓縮頂部 Padding (pt-6 -> pt-2) */}
      <main className="px-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-6" onClick={() => setShowShareModal(false)}>
          <Card className="w-full max-w-xs flex flex-col items-center gap-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black italic">手機掃描開啟</h3>
            <div className="p-3 bg-white rounded-3xl border-4 border-[#F7F4EB] soft-shadow">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}&bgcolor=FFFFFF&color=5D534A&margin=10`}
                alt="QR Code"
                className="w-40 h-40"
              />
            </div>
            <Button onClick={() => { navigator.clipboard.writeText(currentUrl); alert('已複製！'); }} className="w-full text-sm">複製網址</Button>
          </Card>
        </div>
      )}

      {/* Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-4" onClick={() => setShowSyncModal(false)}>
          <Card className="w-full max-w-md flex flex-col gap-4 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black italic text-center">資料備份與同步</h3>
            <div className="grid grid-cols-2 gap-2">
               <button onClick={exportAllData} className="flex flex-col items-center gap-2 p-3 bg-[#F7F4EB] rounded-2xl border-2 border-[#E0E5D5]">
                 <Icon name="download" className="text-[#A8B58F]" />
                 <span className="text-[10px] font-black">備份</span>
               </button>
               <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 p-3 bg-[#F7F4EB] rounded-2xl border-2 border-[#E0E5D5]">
                 <Icon name="upload" className="text-[#8B735B]" />
                 <span className="text-[10px] font-black">還原</span>
               </button>
               <input type="file" ref={fileInputRef} onChange={handleImportData} className="hidden" accept=".json" />
            </div>
            <input type="text" placeholder="自訂同步 ID" value={tempTripId} onChange={(e) => setTempTripId(e.target.value)} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-3 text-center font-black tracking-widest focus:outline-none focus:border-[#A8B58F]" />
            <Button onClick={handleSaveTripId} className="w-full">儲存 ID</Button>
            <Button variant="ghost" onClick={() => setShowSyncModal(false)} className="w-full border-none opacity-50 text-xs">關閉</Button>
          </Card>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-2 soft-shadow border-2 border-[#E0E5D5] z-[100] flex justify-around items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 w-14 rounded-2xl transition-all ${
              activeTab === tab.id ? 'bg-[#A8B58F] text-white scale-105 soft-shadow' : 'text-[#8B735B] opacity-40'
            }`}
          >
            <i className={`fa-solid fa-${tab.icon} text-base`}></i>
            <span className="text-[8px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default App;
