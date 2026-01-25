
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-[2rem] p-5 soft-shadow border-2 border-[#E0E5D5] transition-transform active:scale-[0.98] ${className}`}
  >
    {children}
  </div>
);

export const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'ghost'; className?: string; type?: "button" | "submit" | "reset" }> = ({ children, onClick, variant = 'primary', className = '', type = "button" }) => {
  const variants = {
    primary: 'bg-[#A8B58F] text-white',
    secondary: 'bg-[#8B735B] text-white',
    ghost: 'bg-transparent text-[#5D534A] border-2 border-[#E0E5D5]'
  };
  
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-bold transition-all active:scale-90 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Badge: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm" style={{ backgroundColor: color }}>
    {children}
  </span>
);

// Added style prop to allow inline styling (e.g., dynamic colors)
export const Icon: React.FC<{ name: string; className?: string; style?: React.CSSProperties }> = ({ name, className = "", style }) => (
  <i className={`fa-solid fa-${name} ${className}`} style={style}></i>
);
