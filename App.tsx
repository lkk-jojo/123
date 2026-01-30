
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
  const [shareUrl, setShareUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 自動從網址匯入資料 (裝置間同步核心) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const syncData = params.get('sync');
    if (syncData) {
      try {
        const decodedData = JSON.parse(atob(syncData));
        if (window.confirm('偵測到來自其他裝置的同步資料，是否覆蓋目前行程？')) {
          Object.keys(decodedData).forEach(key => {
            const val = decodedData[key];
            localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
          });
          // 移除網址中的 sync 參數並重新整理
          window.location.href = window.location.origin + window.location.pathname;
        }
      } catch (e) {
        console.error("同步失敗", e);
      }
    }
  }, []);

  const getDetectedUrl = () => {
    let url = window.location.href;
    if (url.startsWith('blob:')) url = url.replace('blob:', '');
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('localhost') || urlObj.hostname.includes('127.0.0.1')) return urlObj.origin + '/';
      return urlObj.origin + urlObj.pathname;
    } catch (e) { return url; }
  };

  useEffect(() => {
    if (showShareModal && !shareUrl) {
      setShareUrl(getDetectedUrl());
    }
  }, [showShareModal]);

  // --- 生成包含所有資料的同步連結 ---
  const generateSyncLink = () => {
    const keys = [
      'nagoya_trip_schedule', 
      'nagoya_trip_expenses', 
      'nagoya_trip_journal', 
      'nagoya_planning_items', 
      'shared_trip_id'
    ];
    const data: Record<string, any> = {};
    keys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val) {
        try { data[k] = JSON.parse(val); } catch(e) { data[k] = val; }
      }
    });
    const encoded = btoa(JSON.stringify(data));
    const fullSyncUrl = `${getDetectedUrl()}?sync=${encoded}`;
    
    navigator.clipboard.writeText(fullSyncUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert('已生成包含「完整資料」的同步連結！請將此連結傳給手機開啟即可完成同步。');
    });
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportData = () => {
    const keys = ['nagoya_trip_schedule', 'nagoya_trip_expenses', 'nagoya_trip_journal', 'nagoya_planning_items', 'shared_trip_id'];
    const data: Record<string, any> = {};
    keys.forEach(k => {
      const val = localStorage.getItem(k);
      if (val) {
        try { data[k] = JSON.parse(val); } catch(e) { data[k] = val; }
      }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nagoya-trip-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        Object.keys(data).forEach(key => {
          const val = data[key];
          // 重要：如果是物件，必須字串化後再存入 localStorage
          localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
        });
        alert('還原成功！網頁即將重新載入...');
        window.location.reload();
      } catch (err) { alert('還原失敗，請檢查檔案格式'); }
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
    <div className="min-h-screen pb-24 text-[#5D534A] max-w-lg mx-auto bg-[#F7F4EB] shadow-2xl relative">
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
            <span className="text-[9px] font-black">{tripId ? tripId : '備份'}</span>
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
              <h3 className="text-xl font-black italic">分享與同步</h3>
              <p className="text-[10px] opacity-40 mt-1">傳送連結到其他手機開啟</p>
            </div>
            
            <div className="p-3 bg-white rounded-3xl border-4 border-[#F7F4EB] soft-shadow">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(shareUrl)}&bgcolor=FFFFFF&color=5D534A&margin=10`}
                alt="QR Code"
                className="w-40 h-40"
              />
            </div>

            <div className="w-full space-y-2">
              <Button onClick={generateSyncLink} variant="primary" className="w-full text-sm bg-[#8B735B]">
                <Icon name="wand-magic-sparkles" />
                生成資料同步連結
              </Button>
              <Button onClick={handleCopyUrl} variant="ghost" className="w-full text-sm">
                <Icon name={copied ? "check" : "link"} />
                {copied ? '已複製主頁網址' : '複製主頁網址'}
              </Button>
            </div>
            <p className="text-[9px] opacity-50 text-center leading-tight">「同步連結」包含您目前所有的記帳與行程資料，發送到手機開啟即可更新手機上的資料。</p>
          </Card>
        </div>
      )}

      {showSyncModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-end sm:items-center justify-center p-4" onClick={() => setShowSyncModal(false)}>
          <Card className="w-full max-w-md flex flex-col gap-4 rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-black italic text-center">資料檔案備份</h3>
            <p className="text-[10px] text-center opacity-40 -mt-2">將資料下載為 JSON 檔，或從檔案還原</p>
            <div className="grid grid-cols-2 gap-3">
               <button onClick={handleExportData} className="flex flex-col items-center gap-2 p-4 bg-[#F7F4EB] rounded-2xl border-2 border-[#E0E5D5] active:scale-95 transition-all">
                 <Icon name="download" className="text-[#A8B58F] text-xl" />
                 <span className="text-[10px] font-black">匯出 JSON</span>
               </button>
               <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-2 p-4 bg-[#F7F4EB] rounded-2xl border-2 border-[#E0E5D5] active:scale-95 transition-all">
                 <Icon name="upload" className="text-[#8B735B] text-xl" />
                 <span className="text-[10px] font-black">匯入 JSON</span>
               </button>
               <input type="file" ref={fileInputRef} onChange={handleImportData} className="hidden" accept=".json" />
            </div>
            <div className="space-y-1 mt-2">
              <label className="text-[10px] font-black opacity-30 ml-2 uppercase">行程識別 ID</label>
              <input type="text" placeholder="如: MY-NAGOYA-2026" value={tempTripId} onChange={(e) => setTempTripId(e.target.value)} className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-3 text-center font-black tracking-widest focus:outline-none focus:border-[#A8B58F]" />
            </div>
            <Button onClick={handleSaveTripId} className="w-full">儲存識別標籤</Button>
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
