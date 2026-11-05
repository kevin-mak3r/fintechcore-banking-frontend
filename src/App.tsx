import { useEffect, useState, useCallback } from 'react';
import { Account, Transaction } from './types';
import { apiService } from './services/api';
import { Navbar } from './components/Navbar';
import { AccountCard } from './components/AccountCard';
import { TransferModal } from './components/TransferModal';
import { DepositWithdrawModal } from './components/DepositWithdrawModal';
import { NewAccountModal } from './components/NewAccountModal';
import { TransactionTable } from './components/TransactionTable';
import { Wallet, ArrowLeftRight, TrendingUp, AlertTriangle } from 'lucide-react';

export function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccountFilter, setSelectedAccountFilter] = useState<Account | undefined>(undefined);
  
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Modals state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferInitialSource, setTransferInitialSource] = useState<Account | undefined>(undefined);

  const [isDepositWithdrawModalOpen, setIsDepositWithdrawModalOpen] = useState(false);
  const [depWithdrawTarget, setDepWithdrawTarget] = useState<{ acc: Account; type: 'DEPOSIT' | 'WITHDRAWAL' } | null>(null);

  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);

  // Load Data
  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const healthy = await apiService.checkHealth();
      setIsBackendHealthy(healthy);

      if (healthy) {
        const accs = await apiService.getAccounts();
        setAccounts(accs);

        if (selectedAccountFilter) {
          const hist = await apiService.getAccountHistory(selectedAccountFilter.accountNumber);
          setTransactions(hist);
        } else if (accs.length > 0) {
          // Fetch history for first account by default or all
          const hist = await apiService.getAccountHistory(accs[0].accountNumber);
          setTransactions(hist);
        }
      }
    } catch (err) {
      console.error('Error loading data from Spring Boot backend:', err);
      setIsBackendHealthy(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedAccountFilter]);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      apiService.checkHealth().then(setIsBackendHealthy);
    }, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleOpenTransfer = (acc?: Account) => {
    setTransferInitialSource(acc);
    setIsTransferModalOpen(true);
  };

  const handleOpenDepositWithdraw = (acc: Account, type: 'DEPOSIT' | 'WITHDRAWAL') => {
    setDepWithdrawTarget({ acc, type });
    setIsDepositWithdrawModalOpen(true);
  };

  const handleFilterByAccount = async (acc: Account) => {
    setSelectedAccountFilter(acc);
    try {
      const hist = await apiService.getAccountHistory(acc.accountNumber);
      setTransactions(hist);
    } catch (err) {
      console.error('Error fetching account history', err);
    }
  };

  const handleClearFilter = async () => {
    setSelectedAccountFilter(undefined);
    if (accounts.length > 0) {
      const hist = await apiService.getAccountHistory(accounts[0].accountNumber);
      setTransactions(hist);
    }
  };

  // Stats calculation
  const totalBalancePEN = accounts
    .filter(a => a.currency === 'PEN')
    .reduce((acc, curr) => acc + curr.balance, 0);

  const totalBalanceUSD = accounts
    .filter(a => a.currency === 'USD')
    .reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        isBackendHealthy={isBackendHealthy}
        onRefresh={loadData}
        onOpenNewAccount={() => setIsNewAccountModalOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Backend offline warning banner */}
        {!isBackendHealthy && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <p className="font-semibold text-rose-200">El backend de Spring Boot no responde en el puerto 8085</p>
                <p className="text-xs text-rose-400">Asegúrate de tener corriendo: <code className="bg-rose-950/60 px-1 py-0.5 rounded font-mono">.\mvnw.cmd spring-boot:run</code></p>
              </div>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Global Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Capital Total en Soles (PEN)</p>
              <h4 className="text-2xl font-extrabold text-white mt-1">
                S/ {totalBalancePEN.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Capital en Dólares (USD)</p>
              <h4 className="text-2xl font-extrabold text-white mt-1">
                $ {totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Cuentas Activas / Registro</p>
              <h4 className="text-2xl font-extrabold text-white mt-1">
                {accounts.length} Cuentas
              </h4>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Bank Accounts Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Cuentas Bancarias Disponibles</h2>
              <p className="text-xs text-slate-400">Balances alimentados directamente por el microservicio Spring Boot 3</p>
            </div>
            <button
              onClick={() => handleOpenTransfer()}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center space-x-1 cursor-pointer"
            >
              <span>Nueva transferencia</span>
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-56 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : accounts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
              <p className="text-sm text-slate-400 mb-3">No hay cuentas bancarias registradas en la base de datos.</p>
              <button
                onClick={() => setIsNewAccountModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Crear primera cuenta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map(acc => (
                <AccountCard
                  key={acc.id}
                  account={acc}
                  onTransfer={handleOpenTransfer}
                  onDepositWithdraw={handleOpenDepositWithdraw}
                  onViewHistory={handleFilterByAccount}
                  isSelected={selectedAccountFilter?.accountNumber === acc.accountNumber}
                />
              ))}
            </div>
          )}
        </section>

        {/* Transactions Ledger Table */}
        <section>
          <TransactionTable
            transactions={transactions}
            selectedAccountNumber={selectedAccountFilter?.accountNumber}
            onClearFilter={handleClearFilter}
            isLoading={isLoading}
          />
        </section>

      </main>

      {/* Modals */}
      {isTransferModalOpen && (
        <TransferModal
          accounts={accounts}
          initialSource={transferInitialSource}
          onClose={() => setIsTransferModalOpen(false)}
          onSuccess={loadData}
        />
      )}

      {isDepositWithdrawModalOpen && depWithdrawTarget && (
        <DepositWithdrawModal
          account={depWithdrawTarget.acc}
          type={depWithdrawTarget.type}
          onClose={() => {
            setIsDepositWithdrawModalOpen(false);
            setDepWithdrawTarget(null);
          }}
          onSuccess={loadData}
        />
      )}

      {isNewAccountModalOpen && (
        <NewAccountModal
          onClose={() => setIsNewAccountModalOpen(false)}
          onSuccess={loadData}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>FintechCore Banking Ecosystem • Java 17 Spring Boot 3 & React TypeScript • Arquitectura Hexagonal</p>
      </footer>

    </div>
  );
}

export default App;
