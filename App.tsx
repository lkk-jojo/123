
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
  const [copied, setCopied] = useState(false);
  const [tripId, setTripId] = useState(() => localStorage.getItem('shared_trip_id') || '');
  const [tempTripId, setTempTripId] = useState('');
  
  // 提供一個狀態讓使用者可以修改分享網址，防止開發環境抓錯
  const [shareUrl, setShareUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 獲取乾淨且可用的網址
  const getDetectedUrl = () => {
    let url = window.location.href;
    
    // 移除 blob: 前綴 (這是造成手機 404 的元兇)
    if (url.startsWith('blob:')) {
      url = url.replace('blob:', '');
    }

    try {
      const urlObj = new URL(url);
      // 如果是在沙盒或預覽環境中，網址通常包含 UUID，手機無法讀取
      // 我們嘗試返回一個乾淨的 Origin
      if (urlObj.hostname.includes('localhost') || urlObj.hostname.includes('127.0.0.1')) {
        return urlObj.origin + '/';
      }
      
      // 移除結尾的 index.html 或隨機 path
      if (urlObj.pathname.length > 10) {
        return urlObj.origin + '/';
      }
      
      return urlObj.origin + urlObj.pathname;
    } catch (e) {
      return url;
    }
  };

  // 彈窗開啟時自動偵測
  useEffect(() => {
    if (showShareModal && !shareUrl) {
      setShareUrl(getDetectedUrl());
    }
  }, [showShareModal]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.keys(data).forEach(key => { if (data[key]) localStorage.setItem(key, data[key]); });
        window.location.reload();
      } catch (err) { alert('還原失敗'); }
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
      <header className="px-4 py-3 pt-10 sticky top-0 bg-[#F7F4EB]/90 backdrop-blur-md z-[60] flex justify-between items-center border-b border-[#E0E5D5]/50">
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#8B735B] italic leading-none">NAGOYA <span className="text-[#A8B58F]">PLAY</span></h1>
          <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest mt-1">Feb 04 - Feb 08, 2026</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowShareModal(true)} className="w-9 h-9 rounded-full bg-white border-2 border-[#E0E5D5] text-[#8B735B] flex items-center justify-center active:scale-90 transition-all soft-shadow">
            <Icon name="share-nodes" className="text-xs" />
          </button>
          <button onClick={() => { setTempTripId(tripId); setShowSyncModal(true); }} className={`px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border-2 transition-all active:scale-90 ${tripId ? 'bg-[#B5C99A] border-[#B5C99A] text-white soft-shadow' : 'bg-white border-[#E0E5D5] text-[#8B735B]'}`}>
            <Icon name={tripId ? "users" : "cloud"} className="text-[10px]" />
            <span className="text-[9px] font-black">{tripId ? tripId : '同步'}</span>
          </button>
        </div>
      </header>

      <main className="px-3 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </main>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6" onClick={() => setShowShareModal(false)}>
          <Card className="w-full max-w-xs flex flex-col items-center gap-4 p-6 border-none" onClick={e => e.stopPropagation()}>
            <div className="text-center w-full">
              <h3 className="text-xl font-black italic">分享此行程</h3>
              <p className="text-[10px] opacity-40 mt-1">手機掃描 QR Code 開啟</p>
            </div>
            
            <div className="p-3 bg-white rounded-3xl border-4 border-[#F7F4EB] soft-shadow">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}&bgcolor=FFFFFF&color=5D534A&margin=10`}
                alt="QR Code"
                className="w-40 h-40"
              />
            </div>

            <div className="w-full space-y-2">
              <div className="bg-[#F7F4EB] p-3 rounded-2xl border-2 border-[#E0E5D5]">
                <label className="text-[8px] font-black uppercase opacity-40 block mb-1">網址修正 (若掃描出現 404 請手動填入正式網址)</label>
                <input 
                  type="text" 
                  value={shareUrl} 
                  onChange={(e) => setShareUrl(e.target.value)}
                  className="w-full bg-transparent text-[11px] font-bold text-[#8B735B] focus:outline-none"
                />
              </div>

              {tripId && (
                <div className="bg-[#B5C99A]/10 p-3 rounded-2xl border border-[#B5C99A]/30 text-center">
                  <p className="text-[8px] font-black uppercase opacity-40">同步 ID 備援</p>
                  <p className="text-lg font-black text-[#8B735B] tracking-widest">{tripId}</p>
                </div>
              )}
            </div>
            
            <Button onClick={handleCopyUrl} className={`w-full text-sm transition-all ${copied ? 'bg-[#B5C99A]' : ''}`}>
              <Icon name={copied ? "check" : "copy"} />
              {copied ? '已複製網址' : '複製網址'}
            </Button>
            <p className="text-[8px] opacity-40 text-center leading-tight">提示：開發預覽環境網址常會過期，正式分享請使用發布後的網址。</p>
          </Card>
        </div>
      )}

      {showSyncModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-4" onClick={() => setShowSyncModal(false)}>
          <Card className="w-full max-w-md flex flex-col gap-4 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black italic text-center">資料備份與同步</h3>
            <div className="grid grid-cols-2 gap-2">
               <button onClick={() => {}} className="flex flex-col items-center gap-2 p-3 bg-[#F7F4EB] rounded-2xl border-2 border-[#E0E5D5] opacity-50 cursor-not-allowed">
                 <Icon name="download" className="text-[#A8B58F]" />
                 <span className="text-[10px] font-black">備份</span>
               </button>
               <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 p-3 bg-[#F7F4EB] rounded-2xl border-2 border-[#E0E5D5]">
                 <Icon name="upload" className="text-[#8B735B]" />
                 <span className="text-[10px] font-black">還原</span>
               </button>
               <input type="file" ref={fileInputRef} onChange={handleImportData} className="hidden" accept=".json" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black opacity-30 ml-2">輸入同步 ID</label>
              <input type="text" placeholder="如: MY-TRIP-01" value={tempTripId} onChange={(e) => setTempTripId(e.target.value)} className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-3 text-center font-black tracking-widest focus:outline-none focus:border-[#A8B58F]" />
            </div>
            <Button onClick={handleSaveTripId} className="w-full">儲存 ID 並連線</Button>
            <Button variant="ghost" onClick={() => setShowSyncModal(false)} className="w-full border-none opacity-50 text-xs">取消</Button>
          </Card>
        </div>
      )}

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
