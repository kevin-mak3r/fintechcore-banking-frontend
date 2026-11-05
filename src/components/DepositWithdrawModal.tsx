import React, { useState } from 'react';
import { Account } from '../types';
import { apiService } from '../services/api';
import { X, ArrowDownLeft, ArrowUpRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface DepositWithdrawModalProps {
  account: Account;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  onClose: () => void;
  onSuccess: () => void;
}

export const DepositWithdrawModal: React.FC<DepositWithdrawModalProps> = ({
  account,
  type,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>(type === 'DEPOSIT' ? 'Depósito en ventanilla' : 'Retiro por ATM');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const isDeposit = type === 'DEPOSIT';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Ingrese un monto válido mayor a 0');
      return;
    }

    if (!isDeposit && numAmount > account.balance) {
      setErrorMessage(`Saldo insuficiente. Disponible: ${account.currency} ${account.balance.toFixed(2)}`);
      return;
    }

    setIsLoading(true);
    try {
      const idempKey = 'TX-' + crypto.randomUUID().slice(0, 8).toUpperCase();
      if (isDeposit) {
        await apiService.deposit({
          accountNumber: account.accountNumber,
          amount: numAmount,
          description: description.trim()
        }, idempKey);
      } else {
        await apiService.withdraw({
          accountNumber: account.accountNumber,
          amount: numAmount,
          description: description.trim()
        }, idempKey);
      }

      setSuccessInfo(`Operación completada exitosamente`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error en la transacción');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDeposit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
            }`}>
              {isDeposit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isDeposit ? 'Depósito de Fondos' : 'Retiro de Fondos'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">{account.accountNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successInfo && (
            <div className="flex items-start space-x-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successInfo}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Monto ({account.currency})
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center space-x-1.5 px-5 py-2 rounded-xl text-white text-xs font-semibold transition cursor-pointer ${
                isDeposit ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'
              }`}
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isDeposit ? 'Acreditar Saldo' : 'Debitar Saldo'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
