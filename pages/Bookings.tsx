
import React, { useState } from 'react';
import { Card, Button, Icon, Badge } from '../components/UI';

const BookingsPage: React.FC = () => {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [flightDirection, setFlightDirection] = useState<'outbound' | 'inbound'>('outbound');

  const handleEdit = () => {
    setShowPin(true);
  };

  // 航班資料定義
  const flightData = {
    outbound: {
      airline: '泰國獅航 SL398',
      airlineShort: 'Thai Lion Air',
      color: '#E6A4B4', // 粉色
      from: 'TPE',
      fromFull: '台北 T1',
      to: 'NGO',
      toFull: '名古屋 T1',
      duration: '2H 40M',
      date: '04 FEB 2026',
      gate: 'T1',
      depTime: '09:00',
      arrTime: '12:40',
      aircraft: '波音 737-800 (中型)'
    },
    inbound: {
      airline: '臺灣虎航 IT207',
      airlineShort: 'Tigerair Taiwan',
      color: '#FF9F66', // 虎航橘
      from: 'NGO',
      fromFull: '名古屋 T2',
      to: 'TPE',
      toFull: '台北 T1',
      duration: '3H 35M',
      date: '08 FEB 2026',
      gate: 'T2',
      depTime: '19:40',
      arrTime: '22:15',
      aircraft: '空中巴士 A320 (中型)'
    }
  };

  const currentFlight = flightData[flightDirection];

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-xl font-black flex items-center gap-2">
          <Icon name="passport" className="text-[#A8B58F]" /> 我的憑證
        </h2>
        <div className="flex items-center gap-1 text-[10px] font-bold text-[#8B735B] opacity-40">
           <Icon name="shield-check" /> 隱私加密中
        </div>
      </div>

      {/* Flight Section */}
      <div className="flex flex-col gap-3">
        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-full border-2 border-[#E0E5D5] soft-shadow mx-2">
          <button 
            onClick={() => setFlightDirection('outbound')}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${flightDirection === 'outbound' ? 'bg-[#A8B58F] text-white' : 'text-[#8B735B] opacity-60'}`}
          >
            去程 Outbound
          </button>
          <button 
            onClick={() => setFlightDirection('inbound')}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${flightDirection === 'inbound' ? 'bg-[#A8B58F] text-white' : 'text-[#8B735B] opacity-60'}`}
          >
            回程 Inbound
          </button>
        </div>

        {/* Boarding Pass */}
        <div className="relative overflow-hidden bg-white rounded-[2.5rem] border-2 border-[#E0E5D5] soft-shadow transition-all duration-500">
          <div 
            className="p-5 text-white flex justify-between items-center transition-colors duration-500" 
            style={{ backgroundColor: currentFlight.color }}
          >
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">Boarding Pass</p>
              <h3 className="text-lg font-black italic">{currentFlight.airline}</h3>
            </div>
            <Icon name="plane" className={`text-2xl transition-transform duration-700 ${flightDirection === 'inbound' ? 'rotate-180' : ''}`} />
          </div>
          
          <div className="p-5 pb-4 flex justify-between items-center">
            <div className="text-center">
              <h4 className="text-3xl font-black text-[#5D534A] leading-none">{currentFlight.from}</h4>
              <p className="text-[10px] opacity-60 mt-1">{currentFlight.fromFull}</p>
            </div>
            <div className="flex-grow flex flex-col items-center px-4">
              <div className="w-full h-[1px] border-t-2 border-dashed border-[#E0E5D5] relative">
                <Icon 
                  name="plane" 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm"
                  style={{ color: currentFlight.color }} 
                />
              </div>
              <p className="text-[9px] mt-4 font-bold opacity-40 uppercase tracking-tighter">{currentFlight.duration}</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-black text-[#5D534A] leading-none">{currentFlight.to}</h4>
              <p className="text-[10px] opacity-60 mt-1">{currentFlight.toFull}</p>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-[#E0E5D5] mx-4 relative">
              <div className="absolute -left-6 -top-2 w-4 h-4 rounded-full bg-[#F7F4EB] border-r-2 border-[#E0E5D5]"></div>
              <div className="absolute -right-6 -top-2 w-4 h-4 rounded-full bg-[#F7F4EB] border-l-2 border-[#E0E5D5]"></div>
          </div>

          <div className="p-5 py-4 grid grid-cols-2 gap-y-3 gap-x-8">
            <div>
              <p className="text-[9px] font-bold uppercase opacity-50 mb-0">日期 Date</p>
              <p className="font-bold text-[#8B735B] text-sm">{currentFlight.date}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase opacity-50 mb-0">航廈 Terminal</p>
              <p className="font-bold text-[#8B735B] text-sm">{currentFlight.gate}</p>
            </div>
          </div>
          
          {/* Flight Extra Info - Optimized Spacing */}
          <div className="px-5 pb-5 pt-0 flex justify-between items-end animate-in fade-in slide-in-from-top-1">
              <div className="flex gap-5">
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-50 mb-0">起飛 Dep</p>
                  <p className="text-base font-black text-[#8B735B] leading-none">{currentFlight.depTime}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase opacity-50 mb-0">抵達 Arr</p>
                  <p className="text-base font-black text-[#8B735B] leading-none">{currentFlight.arrTime}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[8px] font-bold uppercase opacity-40 mb-1">Aircraft</p>
                <Badge color="#F7F4EB">
                  <span className="text-[#8B735B] text-[9px] font-bold">{currentFlight.aircraft}</span>
                </Badge>
              </div>
          </div>
        </div>
      </div>

      {/* Hotel Card - Nagoya Sakae Green Hotel */}
      <Card className="relative group overflow-hidden border-2 border-[#E0E5D5]">
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
          <button 
            onClick={handleEdit} 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 border soft-shadow ${
                isUnlocked ? 'bg-[#A8B58F] text-white border-[#A8B58F]' : 'bg-white/90 backdrop-blur-sm text-[#8B735B] border-[#E0E5D5]'
            }`}
          >
             <Icon name={isUnlocked ? "lock-open" : "lock"} />
          </button>
          {!isUnlocked && <span className="text-[8px] bg-black/60 text-white px-2 py-0.5 rounded-full font-bold">隱私鎖定</span>}
        </div>
        
        <div className="h-44 -m-5 mb-4 overflow-hidden relative bg-[#E0E5D5]">
           <img 
              src="https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=1000&q=80" 
              className={`w-full h-full object-cover transition-all duration-700 ${!isUnlocked ? 'blur-sm grayscale-[0.5]' : 'blur-0 grayscale-0'}`} 
              alt="Nagoya Sakae Green Hotel Exterior"
              loading="lazy"
              referrerPolicy="no-referrer"
           />
           <div className="absolute bottom-4 left-4">
              <Badge color={isUnlocked ? "#A8B58F" : "#87A2FB"}>
                {isUnlocked ? "驗證成功" : "住宿憑證"}
              </Badge>
           </div>
        </div>

        <div className="flex flex-col gap-1">
            <h3 className="text-xl font-black">名古屋榮格林飯店</h3>
            <p className="text-xs font-bold text-[#8B735B] opacity-60 italic">Nagoya Sakae Green Hotel</p>
            
            <div className={`mt-3 space-y-2 transition-all duration-500 ${!isUnlocked ? 'opacity-30 select-none' : 'opacity-100'}`}>
                <p className="text-xs opacity-80 flex items-start gap-2 leading-relaxed">
                    <Icon name="map-pin" className="mt-1 flex-shrink-0 text-[#A8B58F]" />
                    <span>3 Chome-17-26 Nishiki, 中區, 460-0003 名古屋市, 愛知縣, 日本</span>
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <p className="text-[11px] opacity-80 flex items-center gap-2">
                      <Icon name="phone" className="flex-shrink-0 text-[#A8B58F]" />
                      <span>{isUnlocked ? '+81-52-9518' : '••••••••'}</span>
                  </p>
                  <p className="text-[11px] opacity-80 flex items-center gap-2 truncate">
                      <Icon name="envelope" className="flex-shrink-0 text-[#A8B58F]" />
                      <span className="truncate">{isUnlocked ? 'Email OK' : '••••@••••'}</span>
                  </p>
                </div>
            </div>
        </div>

        <div className="mt-5 pt-4 border-t-2 border-dashed border-[#E0E5D5] grid grid-cols-2 gap-4">
             <div className={!isUnlocked ? 'opacity-40' : ''}>
                <p className="text-[9px] font-bold uppercase opacity-50 mb-0">入住 Check-In</p>
                <p className="text-sm font-bold">02/04 15:00</p>
             </div>
             <div className={!isUnlocked ? 'opacity-40' : ''}>
                <p className="text-[9px] font-bold uppercase opacity-50 mb-0">退房 Check-Out</p>
                <p className="text-sm font-bold">02/08 11:00</p>
             </div>
        </div>
      </Card>

      {/* PIN Overlay */}
      {showPin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
            <Card className="w-full max-w-xs flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-[#F7F4EB] flex items-center justify-center">
                    <Icon name="shield-halved" className="text-3xl text-[#A8B58F]" />
                </div>
                <div className="text-center">
                    <h3 className="font-black text-lg">隱私保護 PIN 碼</h3>
                    <p className="text-[10px] text-center opacity-60 mt-1">為了保護您的個資，請輸入解鎖碼 (007)</p>
                </div>
                <div className="flex gap-4">
                    {[1,2,3].map(i => (
                        <div key={i} className={`w-4 h-4 rounded-full border-2 border-[#A8B58F] transition-all duration-300 ${pin.length >= i ? 'bg-[#A8B58F] scale-125' : 'bg-white'}`}></div>
                    ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {[1,2,3,4,5,6,7,8,9, 'C', 0, '✓'].map(n => (
                        <button 
                            key={n} 
                            onClick={() => {
                                if (n === 'C') setPin('');
                                else if (n === '✓') {
                                    if (pin === '007') {
                                        setIsUnlocked(true);
                                        setShowPin(false);
                                    } else {
                                        alert('密碼錯誤，請再試一次');
                                        setPin('');
                                    }
                                }
                                else if (pin.length < 3) setPin(p => p + n);
                            }}
                            className={`w-14 h-14 rounded-full border-2 border-[#E0E5D5] font-black transition-all active:scale-75 flex items-center justify-center ${
                                n === '✓' ? 'bg-[#A8B58F] text-white border-[#A8B58F]' : 
                                n === 'C' ? 'text-red-400' : 'hover:bg-[#F7F4EB]'
                            }`}
                        >
                            {n === '✓' ? <Icon name="check" /> : n === 'C' ? <Icon name="xmark" /> : n}
                        </button>
                    ))}
                </div>
                <Button variant="ghost" className="w-full" onClick={() => {setShowPin(false); setPin('');}}>
                    返回
                </Button>
            </Card>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
