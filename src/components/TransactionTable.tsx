import React from 'react';
import { Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Clock, ShieldCheck } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  selectedAccountNumber?: string;
  onClearFilter?: () => void;
  isLoading?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  selectedAccountNumber,
  onClearFilter,
  isLoading
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/40">
      
      {/* Table Header / Title */}
      <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Libro Diario de Transacciones (Ledger)</span>
          </h3>
          <p className="text-xs text-slate-400">
            {selectedAccountNumber 
              ? `Filtrado por cuenta: ${selectedAccountNumber}` 
              : 'Registro inmutable de movimientos auditables'}
          </p>
        </div>

        {selectedAccountNumber && onClearFilter && (
          <button
            onClick={onClearFilter}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-blue-400 px-3 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            Ver todas las cuentas
          </button>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-6 py-3">Referencia</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Origen</th>
              <th className="px-6 py-3">Destino</th>
              <th className="px-6 py-3">Monto</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Fecha y Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-sans">
                  Cargando movimientos...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-sans">
                  Aún no se registran transacciones para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              transactions.map(tx => {
                const isDeposit = tx.type === 'DEPOSIT';
                const isWithdraw = tx.type === 'WITHDRAWAL';
                const isTransfer = tx.type === 'TRANSFER';

                const formattedAmount = new Intl.NumberFormat('es-PE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(tx.amount);

                return (
                  <tr key={tx.transactionReference} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-3.5 text-slate-300 font-bold whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span>{tx.transactionReference}</span>
                        {tx.idempotencyKey && (
                          <span title={`Idempotency-Key: ${tx.idempotencyKey}`}>
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 inline" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-3.5 font-sans whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isDeposit
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isWithdraw
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {isDeposit && <ArrowDownLeft className="w-3 h-3 mr-1" />}
                        {isWithdraw && <ArrowUpRight className="w-3 h-3 mr-1" />}
                        {isTransfer && <ArrowLeftRight className="w-3 h-3 mr-1" />}
                        {tx.type}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-slate-400 whitespace-nowrap">{tx.sourceAccountNumber}</td>
                    <td className="px-6 py-3.5 text-slate-400 whitespace-nowrap">{tx.destinationAccountNumber}</td>

                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className={`font-bold ${
                        isDeposit ? 'text-emerald-400' : isWithdraw ? 'text-amber-400' : 'text-white'
                      }`}>
                        {isDeposit ? '+' : isWithdraw ? '-' : ''} {tx.currency} {formattedAmount}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 font-sans whitespace-nowrap">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium border border-slate-700">
                        {tx.status}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-slate-500 font-sans text-xs whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
