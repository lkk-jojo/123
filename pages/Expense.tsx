
import React, { useState, useMemo, useEffect } from 'react';
import { Card, Badge, Button, Icon } from '../components/UI';

interface ExpenseItem {
  id: string; // 強制為字串
  title: string;
  amount: number;
  currency: string;
  category: string;
  payer: string;
  paymentMethod: string;
  date: string;
}

const STORAGE_KEY_EXPENSE = 'nagoya_trip_expenses';

const CATEGORIES = [
  { label: '美食', icon: 'utensils', color: '#FFC898' },
  { label: '交通', icon: 'train', color: '#87A2FB' },
  { label: '景點', icon: 'camera', color: '#B5C99A' },
  { label: '住宿', icon: 'bed', color: '#E6A4B4' },
  { label: '娛樂', icon: 'gamepad', color: '#C3B1E1' },
  { label: '購物', icon: 'bag-shopping', color: '#E9D5CA' },
];

const PAYERS = ['爸爸', '媽媽', 'Jimmy', 'Cindy'];
const PAYMENT_METHODS = ['現金', '刷卡'];

const ExpensePage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXPENSE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // 初始化時強制將所有 ID 轉為字串
          return parsed.map(item => ({ ...item, id: String(item.id) }));
        }
      } catch (e) {
        console.error("Parse failed", e);
      }
    }
    return [
      { id: '1', title: '矢場炸豬排', amount: 3500, currency: 'JPY', category: '美食', payer: 'Jimmy', paymentMethod: '刷卡', date: '2026-02-04' },
      { id: '2', title: '名古屋地鐵', amount: 500, currency: 'JPY', category: '交通', payer: '媽媽', paymentMethod: '現金', date: '2026-02-04' },
    ];
  });

  // 追蹤「哪一筆正處於確認刪除狀態」
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSE, JSON.stringify(expenses));
  }, [expenses]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '美食',
    payer: '爸爸',
    paymentMethod: '現金'
  });

  const exchangeRate = 0.21;
  const totalJPY = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const totalTWD = Math.round(totalJPY * exchangeRate);

  const payerStats = useMemo(() => {
    const stats: Record<string, number> = {};
    PAYERS.forEach(p => stats[p] = 0);
    expenses.forEach(exp => {
      if (stats[exp.payer] !== undefined) stats[exp.payer] += exp.amount;
    });
    return stats;
  }, [expenses]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ title: '', amount: '', category: '美食', payer: '爸爸', paymentMethod: '現金' });
    setConfirmDeleteId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (expense: ExpenseItem) => {
    setEditingItem(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      payer: expense.payer,
      paymentMethod: expense.paymentMethod
    });
    setConfirmDeleteId(null);
    setIsModalOpen(true);
  };

  // 核心刪除函式：不再彈窗，直接對傳入 ID 進行過濾
  const executeFinalDelete = (id: string) => {
    const targetId = String(id);
    const newExpenses = expenses.filter(item => String(item.id) !== targetId);
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY_EXPENSE, JSON.stringify(newExpenses)); // 強制立即同步
    
    // 清除所有狀態
    setConfirmDeleteId(null);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.amount);
    if (!formData.title || isNaN(amountNum)) return;

    if (editingItem) {
      setExpenses(prev => prev.map(exp => String(exp.id) === String(editingItem.id) ? {
        ...exp,
        title: formData.title,
        amount: amountNum,
        category: formData.category,
        payer: formData.payer,
        paymentMethod: formData.paymentMethod
      } : exp));
    } else {
      const newItem: ExpenseItem = {
        id: String(Date.now()), // 確保 ID 是字串
        title: formData.title,
        amount: amountNum,
        currency: 'JPY',
        category: formData.category,
        payer: formData.payer,
        paymentMethod: formData.paymentMethod,
        date: new Date().toISOString().split('T')[0]
      };
      setExpenses([newItem, ...expenses]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 pb-24">
      {/* 總額摘要 */}
      <Card className="bg-[#8B735B] text-white border-none p-4 shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10 text-8xl rotate-12"><Icon name="coins" /></div>
        <div className="relative z-10">
          <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1 text-white/80">Total Spending</p>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black italic leading-none">¥ {totalJPY.toLocaleString()}</h2>
              <p className="text-xs font-bold opacity-80 mt-1">≈ TWD {totalTWD.toLocaleString()}</p>
            </div>
            <Badge color="#B5C99A"><span className="text-[10px]">Rate 0.21</span></Badge>
          </div>
        </div>
      </Card>

      {/* 成員支出統計 */}
      <div className="grid grid-cols-2 gap-2">
        {PAYERS.map(payer => (
          <div key={payer} className="bg-white rounded-2xl p-3 border-2 border-[#E0E5D5] flex justify-between items-center soft-shadow">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#F7F4EB] flex items-center justify-center text-[10px] font-black text-[#8B735B] flex-shrink-0 border border-[#E0E5D5]">{payer[0]}</div>
              <span className="text-xs font-black text-[#5D534A] truncate">{payer}</span>
            </div>
            <span className="text-xs font-black text-[#8B735B]">¥{payerStats[payer].toLocaleString()}</span>
          </div>
        ))}
      </div>

      {/* 支出清單 */}
      <div className="flex flex-col gap-2 mt-2">
        {expenses.length > 0 ? expenses.map(exp => {
          const catInfo = CATEGORIES.find(c => c.label === exp.category) || CATEGORIES[0];
          const isConfirming = confirmDeleteId === exp.id;

          return (
            <div key={exp.id} className="relative">
              <Card className="p-0 overflow-hidden border-2 border-[#E0E5D5] soft-shadow rounded-3xl">
                <div className="flex items-stretch min-h-[72px]">
                  {/* 主要區域：點擊開啟編輯 */}
                  <div 
                    className={`flex-grow flex justify-between items-center py-3 px-4 cursor-pointer active:bg-[#F7F4EB] transition-colors ${isConfirming ? 'opacity-20' : 'opacity-100'}`}
                    onClick={() => !isConfirming && handleOpenEdit(exp)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: catInfo.color }}>
                        <Icon name={catInfo.icon} className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-[#5D534A] leading-tight truncate">{exp.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black text-[#A8B58F]">{exp.payer}</span>
                          <Badge color="#F7F4EB"><span className="text-[#8B735B] text-[8px]">{exp.paymentMethod}</span></Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right mr-1">
                      <p className="font-black text-sm text-[#8B735B]">¥{exp.amount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* 刪除按鈕：二段式確認 UI */}
                  <div className="flex border-l border-[#E0E5D5]">
                    {isConfirming ? (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                          className="w-12 flex items-center justify-center bg-gray-50 text-gray-400"
                        >
                          <Icon name="xmark" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); executeFinalDelete(exp.id); }}
                          className="w-16 flex items-center justify-center bg-red-500 text-white font-black text-[10px] animate-pulse"
                        >
                          刪除
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setConfirmDeleteId(exp.id);
                        }}
                        className="w-14 flex items-center justify-center text-red-200 hover:text-red-500 transition-colors group"
                      >
                        <Icon name="trash-can" className="text-lg group-active:scale-125 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          );
        }) : (
          <div className="py-20 text-center opacity-30 italic text-sm">尚無支出紀錄</div>
        )}
      </div>

      {/* 新增/修改彈窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-6" onClick={() => setIsModalOpen(false)}>
          <Card className="w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-black italic">{editingItem ? '編輯紀錄' : '新增紀錄'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-[#8B735B] opacity-40">
                <Icon name="xmark" className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black opacity-40 uppercase ml-1">項目</label>
                <input 
                  type="text" required placeholder="如：名古屋雞翅" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black opacity-40 uppercase ml-1">日幣金額</label>
                  <input 
                    type="number" inputMode="decimal" required placeholder="0" 
                    value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} 
                    className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-3 text-sm font-bold focus:outline-none focus:border-[#A8B58F]" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black opacity-40 uppercase ml-1">分類</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-3 text-sm font-bold"
                  >
                    {CATEGORIES.map(cat => <option key={cat.label} value={cat.label}>{cat.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black opacity-40 uppercase ml-1">付款人</label>
                  <select 
                    value={formData.payer} 
                    onChange={e => setFormData({...formData, payer: e.target.value})} 
                    className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-3 text-sm font-bold"
                  >
                    {PAYERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black opacity-40 uppercase ml-1">支付方式</label>
                  <select 
                    value={formData.paymentMethod} 
                    onChange={e => setFormData({...formData, paymentMethod: e.target.value})} 
                    className="w-full bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-3 text-sm font-bold"
                  >
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {editingItem && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-14 p-0 border-red-100 text-red-400 hover:bg-red-50 active:scale-95" 
                    onClick={() => {
                        if (confirmDeleteId === editingItem.id) {
                            executeFinalDelete(editingItem.id);
                        } else {
                            setConfirmDeleteId(editingItem.id);
                        }
                    }}
                  >
                    <Icon name={confirmDeleteId === editingItem.id ? "check" : "trash"} className={confirmDeleteId === editingItem.id ? "animate-bounce" : ""} />
                  </Button>
                )}
                <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>取消</Button>
                <Button type="submit" className="flex-[2] bg-[#8B735B]">儲存變更</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* 懸浮新增按鈕 */}
      <button 
        type="button"
        onClick={handleOpenAdd} 
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#A8B58F] text-white rounded-full flex items-center justify-center text-2xl soft-shadow z-[150] active:scale-90 transition-transform shadow-lg"
      >
        <Icon name="plus" />
      </button>
    </div>
  );
};

export default ExpensePage;
