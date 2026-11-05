import React, { useState } from 'react';
import { Account } from '../types';
import { ArrowUpRight, ArrowDownLeft, Copy, Check, Clock, User, ShieldCheck } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  onTransfer: (acc: Account) => void;
  onDepositWithdraw: (acc: Account, type: 'DEPOSIT' | 'WITHDRAWAL') => void;
  onViewHistory: (acc: Account) => void;
  isSelected?: boolean;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onTransfer,
  onDepositWithdraw,
  onViewHistory,
  isSelected
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedBalance = new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(account.balance);

  const currencySymbol = account.currency === 'PEN' ? 'S/' : account.currency === 'USD' ? '$' : '€';

  return (
    <div className={`relative rounded-2xl p-6 bg-gradient-to-b from-slate-900 to-slate-900/90 border transition-all duration-200 ${
      isSelected 
        ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/50' 
        : 'border-slate-800 hover:border-slate-700 shadow-lg shadow-black/40'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs text-slate-400 font-semibold tracking-wider">
              {account.accountNumber}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition"
              title="Copiar número de cuenta"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-300 text-sm font-medium">
            <User className="w-3.5 h-3.5 text-slate-500" />
            <span>{account.holderName}</span>
          </div>
        </div>

        {/* Status Badge */}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3 mr-1" />
          {account.status}
        </span>
      </div>

      {/* Balance */}
      <div className="my-6">
        <p className="text-xs text-slate-400 font-medium mb-1">Saldo Disponible ({account.currency})</p>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-xl font-bold text-slate-400">{currencySymbol}</span>
          <span className="text-3xl font-extrabold text-white tracking-tight">{formattedBalance}</span>
        </div>
      </div>

      {/* Holder Details */}
      <div className="text-xs text-slate-500 flex justify-between items-center pt-3 border-t border-slate-800/80 mb-5">
        <span>Doc: {account.holderDocument}</span>
        <span>{account.currency} • Caja de Ahorro</span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onTransfer(account)}
          className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition cursor-pointer"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Transferir</span>
        </button>

        <button
          onClick={() => onDepositWithdraw(account, 'DEPOSIT')}
          className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ingreso</span>
        </button>

        <button
          onClick={() => onViewHistory(account)}
          className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Kardex</span>
        </button>
      </div>
    </div>
  );
};
