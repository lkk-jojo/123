
import React, { useState, useEffect } from 'react';
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
  const [tripId, setTripId] = useState(() => localStorage.getItem('shared_trip_id') || '');
  const [tempTripId, setTempTripId] = useState('');

  // 監控部署環境與同步狀態
  useEffect(() => {
    if (tripId) {
      console.log(`%c[Nagoya Play] 正在嘗試連線至同步代碼: ${tripId}`, "color: #A8B58F; font-weight: bold;");
      console.log("%c[Tip] 目前為 LocalStorage 模擬同步模式。如需真正的多人即時編輯，請在專案中配置 Supabase API Key。", "color: #8B735B; font-style: italic;");
    }
  }, [tripId]);

  const handleSaveTripId = () => {
    const formattedId = tempTripId.trim().toUpperCase();
    if (!formattedId) return;
    localStorage.setItem('shared_trip_id', formattedId);
    setTripId(formattedId);
    setShowSyncModal(false);
    // 未來在此處加入 Supabase Realtime 訂閱邏輯
  };

  const clearSync = () => {
    if(window.confirm('確定要切換回本地模式嗎？這不會刪除資料，但將停止與他人同步。')) {
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
    <div className="min-h-screen pb-24 text-[#5D534A] max-w-lg mx-auto bg-[#F7F4EB] shadow-2xl shadow-black/5">
      {/* Header */}
      <header className="p-6 pt-12 sticky top-0 bg-[#F7F4EB]/90 backdrop-blur-md z-50 flex justify-between items-center border-b border-[#E0E5D5]/50">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#8B735B] italic">NAGOYA <span className="text-[#A8B58F]">PLAY</span></h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Feb 04 - Feb 08, 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setTempTripId(tripId); setShowSyncModal(true); }}
            className={`px-3 py-1.5 rounded-full flex items-center gap-2 border-2 transition-all active:scale-90 ${tripId ? 'bg-[#B5C99A] border-[#B5C99A] text-white soft-shadow' : 'bg-white border-[#E0E5D5] text-[#8B735B]'}`}
          >
            <Icon name={tripId ? "users" : "cloud"} className="text-xs" />
            <span className="text-[10px] font-black">{tripId ? tripId : '同步'}</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {renderContent()}
      </main>

      {/* Sync Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-4">
          <Card className="w-full max-w-md flex flex-col gap-6 animate-in slide-in-from-bottom-10 duration-300 rounded-t-[3rem] sm:rounded-[3rem] p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#F7F4EB] rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white soft-shadow">
                <Icon name="share-nodes" className="text-4xl text-[#A8B58F]" />
              </div>
              <h3 className="text-2xl font-black italic">與夥伴共同編輯</h3>
              <p className="text-sm opacity-60 mt-3 leading-relaxed">輸入相同的「旅行代碼」，<br/>兩人就能即時同步所有行程與帳單！</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black opacity-40 uppercase ml-4 tracking-widest">TRIP ID (由您自訂)</label>
              <input 
                type="text" 
                placeholder="例如: OUR-HONEYMOON"
                value={tempTripId}
                onChange={(e) => setTempTripId(e.target.value)}
                className="bg-[#F7F4EB] border-4 border-[#E0E5D5] rounded-3xl p-5 text-center font-black tracking-widest text-lg focus:outline-none focus:border-[#A8B58F] transition-all"
              />
            </div>

            <div className="flex flex-col gap-3">
               <Button onClick={handleSaveTripId} className="w-full py-5 text-lg">
                  確認並開始同步
               </Button>
               {tripId && (
                 <button onClick={clearSync} className="text-red-400 text-xs font-bold py-2 underline decoration-dashed">
                   停止同步 (恢復本地模式)
                 </button>
               )}
               <Button variant="ghost" onClick={() => setShowSyncModal(false)} className="w-full border-none opacity-60">
                  返回
               </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-3 soft-shadow border-2 border-[#E0E5D5] z-[100] flex justify-around items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 w-16 rounded-2xl transition-all ${
              activeTab === tab.id ? 'bg-[#A8B58F] text-white scale-110 soft-shadow' : 'text-[#8B735B] opacity-40'
            }`}
          >
            <i className={`fa-solid fa-${tab.icon} text-lg`}></i>
            <span className="text-[9px] font-black uppercase tracking-tighter">{tab.label}</span>
          </button>
        ))}
      </nav>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default App;
