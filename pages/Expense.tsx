
import React, { useState, useMemo, useEffect } from 'react';
import { Card, Badge, Button, Icon } from '../components/UI';
import { COLORS } from '../constants';

interface ExpenseItem {
  id: number;
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

const PAYERS = ['媽媽', 'Jimmy', 'Cindy', '爸爸'];
const PAYMENT_METHODS = ['suica卡', '現金', '刷卡'];

const ExpensePage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EXPENSE);
    return saved ? JSON.parse(saved) : [
      { id: 1, title: '矢場炸豬排', amount: 3500, currency: 'JPY', category: '美食', payer: 'Jimmy', paymentMethod: '刷卡', date: '2026-02-04' },
      { id: 2, title: '名古屋地鐵', amount: 500, currency: 'JPY', category: '交通', payer: '媽媽', paymentMethod: 'suica卡', date: '2026-02-04' },
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EXPENSE, JSON.stringify(expenses));
  }, [expenses]);

  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '美食',
    payer: 'Jimmy',
    paymentMethod: 'suica卡'
  });

  const exchangeRate = 0.21;
  const budgetGoal = 200000;
  const totalJPY = useMemo(() => expenses.reduce((sum, item) => sum + item.amount, 0), [expenses]);
  const totalTWD = Math.round(totalJPY * exchangeRate);
  const progress = Math.min((totalJPY / budgetGoal) * 100, 100);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;
    const item: ExpenseItem = {
      id: Date.now(),
      title: newExpense.title,
      amount: parseFloat(newExpense.amount),
      currency: 'JPY',
      category: newExpense.category,
      payer: newExpense.payer,
      paymentMethod: newExpense.paymentMethod,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([item, ...expenses]);
    setIsAdding(false);
    setNewExpense({ title: '', amount: '', category: '美食', payer: 'Jimmy', paymentMethod: 'suica卡' });
  };

  const deleteExpense = (id: number) => {
    if(window.confirm('確定刪除這筆開支？')) {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="bg-[#8B735B] text-white border-none flex flex-col gap-4 shadow-lg overflow-hidden relative">
        <div className="absolute -right-4 -top-4 opacity-10 text-8xl rotate-12"><Icon name="coins" /></div>
        <div className="flex justify-between items-center relative z-10">
          <p className="text-sm font-bold opacity-80 italic">名古屋總支出</p>
          <Badge color="#B5C99A">JPY to TWD</Badge>
        </div>
        <div className="flex flex-col relative z-10">
            <h2 className="text-4xl font-black italic">¥ {totalJPY.toLocaleString()}</h2>
            <p className="text-lg font-bold opacity-80 mt-1">≈ TWD {totalTWD.toLocaleString()}</p>
        </div>
        <div className="mt-2 w-full h-3 bg-white/20 rounded-full overflow-hidden relative z-10">
            <div className="h-full bg-[#B5C99A] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-xs opacity-60 relative z-10">預算目標：¥ {budgetGoal.toLocaleString()}</p>
      </Card>

      <div className="flex flex-col gap-4">
        {expenses.map(exp => {
          const catInfo = CATEGORIES.find(c => c.label === exp.category) || CATEGORIES[0];
          return (
            <Card key={exp.id} className="flex justify-between items-center py-4 relative group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white soft-shadow" style={{ backgroundColor: catInfo.color }}><Icon name={catInfo.icon} /></div>
                <div>
                  <h4 className="font-bold text-[#5D534A]">{exp.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-bold opacity-40">
                    <span>{exp.date}</span>
                    <span className="text-[#A8B58F]">by {exp.payer}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <p className="font-black text-lg text-[#8B735B]">¥ {exp.amount.toLocaleString()}</p>
                <button onClick={() => deleteExpense(exp.id)} className="opacity-0 group-hover:opacity-100 text-red-300 text-xs transition-opacity"><Icon name="trash-can" /></button>
              </div>
            </Card>
          );
        })}
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black mb-6 text-center italic">新增支出</h3>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-5">
              <input type="text" required placeholder="項目名稱" value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#A8B58F]" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" inputMode="decimal" required placeholder="金額 (JPY)" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#A8B58F]" />
                <div className="bg-[#E0E5D5]/30 rounded-2xl p-4 text-sm font-bold flex items-center">≈ TWD {newExpense.amount ? Math.round(parseFloat(newExpense.amount) * exchangeRate).toLocaleString() : 0}</div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-60">類別</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button key={cat.label} type="button" onClick={() => setNewExpense({...newExpense, category: cat.label})} className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 ${newExpense.category === cat.label ? 'bg-[#A8B58F] border-[#A8B58F] text-white' : 'bg-white border-[#E0E5D5] text-[#8B735B]'}`}>{cat.label}</button>
                    ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-60">支付人</label>
                <div className="grid grid-cols-2 gap-2">
                    {PAYERS.map(p => (
                        <button key={p} type="button" onClick={() => setNewExpense({...newExpense, payer: p})} className={`py-3 rounded-xl text-xs font-bold border-2 ${newExpense.payer === p ? 'bg-[#8B735B] border-[#8B735B] text-white' : 'bg-white border-[#E0E5D5] text-[#8B735B]'}`}>{p}</button>
                    ))}
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setIsAdding(false)}>取消</Button>
                <Button type="submit" className="flex-1">確認</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
      <button onClick={() => setIsAdding(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-[#A8B58F] text-white rounded-full flex items-center justify-center text-2xl soft-shadow z-[150]"><Icon name="plus" /></button>
    </div>
  );
};

export default ExpensePage;
