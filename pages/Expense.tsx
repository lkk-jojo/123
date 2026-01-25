
import React, { useState, useMemo } from 'react';
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
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: 1, title: '矢場炸豬排', amount: 3500, currency: 'JPY', category: '美食', payer: 'Jimmy', paymentMethod: '刷卡', date: '2026-02-04' },
    { id: 2, title: '名古屋地鐵', amount: 500, currency: 'JPY', category: '交通', payer: '媽媽', paymentMethod: 'suica卡', date: '2026-02-04' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '美食',
    payer: 'Jimmy',
    paymentMethod: 'suica卡'
  });

  const exchangeRate = 0.21;
  const budgetGoal = 200000; // 預算目標 (JPY)

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

  return (
    <div className="flex flex-col gap-6">
      {/* Dashboard */}
      <Card className="bg-[#8B735B] text-white border-none flex flex-col gap-4 shadow-lg overflow-hidden relative">
        <div className="absolute -right-4 -top-4 opacity-10 text-8xl rotate-12">
            <Icon name="coins" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <p className="text-sm font-bold opacity-80 italic flex items-center gap-2">
            <Icon name="chart-line" /> 名古屋總支出
          </p>
          <Badge color="#B5C99A">JPY to TWD</Badge>
        </div>
        <div className="flex flex-col relative z-10">
            <h2 className="text-4xl font-black italic">¥ {totalJPY.toLocaleString()}</h2>
            <p className="text-lg font-bold opacity-80 mt-1">≈ TWD {totalTWD.toLocaleString()}</p>
        </div>
        <div className="mt-2 w-full h-3 bg-white/20 rounded-full overflow-hidden relative z-10">
            <div 
                className="h-full bg-[#B5C99A] transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
        <p className="text-xs opacity-60 relative z-10">目前已使用目標金額的 {progress.toFixed(1)}%</p>
      </Card>

      <div className="flex justify-between items-center px-2">
        <h3 className="text-lg font-black">收支明細</h3>
        <div className="flex gap-2">
            <span className="text-[10px] bg-[#E0E5D5] px-2 py-1 rounded-full font-bold">匯率 0.21</span>
        </div>
      </div>

      {/* Expense List */}
      <div className="flex flex-col gap-4">
        {expenses.length > 0 ? expenses.map(exp => {
          const catInfo = CATEGORIES.find(c => c.label === exp.category) || CATEGORIES[0];
          return (
            <Card key={exp.id} className="flex justify-between items-center py-4 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex items-center gap-4">
                <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white soft-shadow"
                    style={{ backgroundColor: catInfo.color }}
                >
                  <Icon name={catInfo.icon} />
                </div>
                <div>
                  <h4 className="font-bold text-[#5D534A]">{exp.title}</h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <span className="text-[10px] font-bold opacity-40 uppercase">{exp.date}</span>
                    <span className="text-[10px] font-bold text-[#A8B58F]">by {exp.payer}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#F7F4EB] text-[#8B735B] border border-[#E0E5D5] font-bold">{exp.paymentMethod}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-[#8B735B]">¥ {exp.amount.toLocaleString()}</p>
                <p className="text-[10px] opacity-40">TWD {Math.round(exp.amount * exchangeRate).toLocaleString()}</p>
              </div>
            </Card>
          );
        }) : (
          <div className="py-20 text-center opacity-30 italic flex flex-col items-center gap-4">
             <Icon name="piggy-bank" className="text-5xl" />
             <p>還沒有記帳喔！快點擊「+」新增吧</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
          <Card className="w-full max-w-md animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-black mb-6 text-center italic underline decoration-[#A8B58F] decoration-4 underline-offset-4 flex items-center justify-center gap-2">
                <Icon name="file-invoice-dollar" /> 新增支出
            </h3>
            <form onSubmit={handleAddSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-60 ml-1">項目名稱</label>
                <input 
                  type="text" 
                  required
                  placeholder="例如：名古屋電視塔門票"
                  value={newExpense.title}
                  onChange={e => setNewExpense({...newExpense, title: e.target.value})}
                  className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#A8B58F] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold opacity-60 ml-1">日圓金額 (JPY)</label>
                  <input 
                    type="number" 
                    inputMode="decimal"
                    required
                    placeholder="0"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                    className="bg-[#F7F4EB] border-2 border-[#E0E5D5] rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#A8B58F] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold opacity-60 ml-1">預估台幣</label>
                    <div className="bg-[#E0E5D5]/30 rounded-2xl p-4 text-sm font-bold text-opacity-60 flex items-center border-2 border-transparent h-[52px]">
                        ≈ TWD {newExpense.amount ? Math.round(parseFloat(newExpense.amount) * exchangeRate).toLocaleString() : 0}
                    </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-60 ml-1">類別</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.label}
                            type="button"
                            onClick={() => setNewExpense({...newExpense, category: cat.label})}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                                newExpense.category === cat.label 
                                ? 'bg-[#A8B58F] border-[#A8B58F] text-white shadow-sm' 
                                : 'bg-white border-[#E0E5D5] text-[#8B735B]'
                            }`}
                        >
                            <Icon name={cat.icon} className="mr-1" /> {cat.label}
                        </button>
                    ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-60 ml-1">支付方式</label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {PAYMENT_METHODS.map(method => (
                        <button
                            key={method}
                            type="button"
                            onClick={() => setNewExpense({...newExpense, paymentMethod: method})}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
                                newExpense.paymentMethod === method 
                                ? 'bg-[#A8B58F] border-[#A8B58F] text-white shadow-sm' 
                                : 'bg-white border-[#E0E5D5] text-[#8B735B]'
                            }`}
                        >
                            {method}
                        </button>
                    ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold opacity-60 ml-1">支付人</label>
                <div className="grid grid-cols-2 gap-3">
                    {PAYERS.map(p => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setNewExpense({...newExpense, payer: p})}
                            className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all ${
                                newExpense.payer === p 
                                ? 'bg-[#8B735B] border-[#8B735B] text-white shadow-md' 
                                : 'bg-white border-[#E0E5D5] text-[#8B735B]'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <Button variant="ghost" className="flex-1" onClick={() => setIsAdding(false)}>取消</Button>
                <Button type="submit" className="flex-1">確認新增</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsAdding(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#A8B58F] text-white rounded-full flex items-center justify-center text-2xl soft-shadow transition-transform active:scale-95 z-[150] hover:rotate-90 duration-300"
      >
        <Icon name="plus" />
      </button>
    </div>
  );
};

export default ExpensePage;
