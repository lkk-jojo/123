
import React, { useState } from 'react';
import SchedulePage from './pages/Schedule';
import BookingsPage from './pages/Bookings';
import ExpensePage from './pages/Expense';
import JournalPage from './pages/Journal';
import PlanningPage from './pages/Planning';

const tabs = [
  { id: 'schedule', label: '行程', icon: 'calendar-days' },
  { id: 'bookings', label: '預訂', icon: 'ticket' },
  { id: 'expense', label: '記帳', icon: 'wallet' },
  { id: 'journal', label: '日誌', icon: 'book' },
  { id: 'planning', label: '準備', icon: 'list-check' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('schedule');

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
    <div className="min-h-screen pb-24 text-[#5D534A]">
      {/* Header */}
      <header className="p-6 pt-10 sticky top-0 bg-[#F7F4EB] bg-opacity-90 backdrop-blur-sm z-50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">名古屋大冒險</h1>
          <p className="text-sm opacity-60">2026/02/04 ~ 2026/02/08</p>
        </div>
        <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white soft-shadow">
          <img src="https://picsum.photos/seed/traveler/100/100" alt="Profile" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 animate-in fade-in duration-500">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-4 right-4 bg-white/80 backdrop-blur-md rounded-[2.5rem] p-3 soft-shadow border-2 border-[#E0E5D5] z-[100] flex justify-around items-center">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${
              activeTab === tab.id ? 'bg-[#A8B58F] text-white scale-110' : 'text-[#8B735B]'
            }`}
          >
            <i className={`fa-solid fa-${tab.icon} text-lg`}></i>
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </nav>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
};

export default App;
