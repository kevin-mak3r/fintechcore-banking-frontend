import React from 'react';
import { Landmark, ShieldCheck, ExternalLink, PlusCircle, RefreshCw } from 'lucide-react';

interface NavbarProps {
  isBackendHealthy: boolean;
  onRefresh: () => void;
  onOpenNewAccount: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isBackendHealthy,
  onRefresh,
  onOpenNewAccount,
  isRefreshing
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-white tracking-tight">FintechCore</span>
              <span className="text-[10px] uppercase font-semibold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                Spring Boot 3
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Ledger & Transaction Engine</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* API Health Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
            <span className={`w-2 h-2 rounded-full ${isBackendHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-slate-300 font-medium hidden md:inline">
              Backend {isBackendHealthy ? 'Online (8085)' : 'Desconectado'}
            </span>
          </div>

          {/* Swagger link */}
          <a
            href="http://localhost:8085/swagger-ui/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>OpenAPI Docs</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition disabled:opacity-50"
            title="Sincronizar cuentas"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          {/* New Account Button */}
          <button
            onClick={onOpenNewAccount}
            className="flex items-center space-x-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva Cuenta</span>
          </button>
        </div>

      </div>
    </header>
  );
};
