import React, { useState } from 'react';
import { Account } from '../types';
import { apiService } from '../services/api';
import { X, ArrowRight, KeyRound, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface TransferModalProps {
  accounts: Account[];
  initialSource?: Account;
  onClose: () => void;
  onSuccess: () => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  accounts,
  initialSource,
  onClose,
  onSuccess
}) => {
  const [sourceAcc, setSourceAcc] = useState<string>(initialSource?.accountNumber || accounts[0]?.accountNumber || '');
  const [destAcc, setDestAcc] = useState<string>(
    accounts.find(a => a.accountNumber !== (initialSource?.accountNumber || accounts[0]?.accountNumber))?.accountNumber || ''
  );
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('Transferencia inmediata');
  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => 'IDEMP-' + crypto.randomUUID().slice(0, 8).toUpperCase());
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const selectedSource = accounts.find(a => a.accountNumber === sourceAcc);

  const handleRegenerateKey = () => {
    setIdempotencyKey('IDEMP-' + crypto.randomUUID().slice(0, 8).toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessInfo(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Por favor ingrese un monto válido mayor a 0');
      return;
    }

    if (sourceAcc === destAcc) {
      setErrorMessage('La cuenta de origen y destino no pueden ser la misma');
      return;
    }

    if (selectedSource && numAmount > selectedSource.balance) {
      setErrorMessage(`Saldo insuficiente. Disponible: ${selectedSource.balance} ${selectedSource.currency}`);
      return;
    }

    setIsLoading(true);
    try {
      const tx = await apiService.transfer({
        sourceAccountNumber: sourceAcc,
        destinationAccountNumber: destAcc,
        amount: numAmount,
        description: description.trim()
      }, idempotencyKey);

      setSuccessInfo(`¡Transferencia exitosa! Ref: ${tx.transactionReference}. Idempotencia respetada.`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Fallo en la comunicación con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-blue-900/20">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Transferencia de Fondos</h3>
              <p className="text-xs text-slate-400">Transacción ACID con garantía de Idempotencia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Notifications */}
          {errorMessage && (
            <div className="flex items-start space-x-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successInfo && (
            <div className="flex items-start space-x-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              <span>{successInfo}</span>
            </div>
          )}

          {/* Accounts Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cuenta Origen</label>
              <select
                value={sourceAcc}
                onChange={e => setSourceAcc(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.accountNumber}>
                    {acc.accountNumber} ({acc.currency} {acc.balance.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cuenta Destino</label>
              <select
                value={destAcc}
                onChange={e => setDestAcc(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {accounts
                  .filter(a => a.accountNumber !== sourceAcc)
                  .map(acc => (
                    <option key={acc.id} value={acc.accountNumber}>
                      {acc.accountNumber} - {acc.holderName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Monto a Transferir ({selectedSource?.currency || 'PEN'})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">
                {selectedSource?.currency === 'USD' ? '$' : 'S/'}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Motivo / Glosa</label>
            <input
              type="text"
              placeholder="Ej: Pago de honorarios, Alquiler..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Idempotency Key Section (Enterprise Demo Feature) */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-slate-400">
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-semibold text-slate-300">Idempotency-Key Header:</span>
              </div>
              <button
                type="button"
                onClick={handleRegenerateKey}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
                title="Generar nueva clave única"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Nueva clave</span>
              </button>
            </div>
            <div className="font-mono text-xs text-blue-400 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 truncate">
              {idempotencyKey}
            </div>
            <p className="text-[10px] text-slate-500">
              Garantiza que reintentos de red no debiten doble saldo en la base de datos.
            </p>
          </div>

          {/* Footer Submit */}
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
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? 'Procesando...' : 'Confirmar Transferencia'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
