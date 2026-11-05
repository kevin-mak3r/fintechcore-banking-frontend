import { Account, ApiResponse, CreateAccountDTO, DepositWithdrawDTO, Transaction, TransferDTO } from '../types';

const API_BASE_URL = 'http://localhost:8085/api/v1';

export const apiService = {
  // Cuentas
  async getAccounts(): Promise<Account[]> {
    const res = await fetch(`${API_BASE_URL}/accounts`);
    if (!res.ok) throw new Error(`Error ${res.status}: Fallo al obtener cuentas`);
    const json: ApiResponse<Account[]> = await res.json();
    return json.data;
  },

  async createAccount(data: CreateAccountDTO): Promise<Account> {
    const res = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error al crear cuenta');
    return json.data;
  },

  // Transacciones
  async transfer(data: TransferDTO, idempotencyKey?: string): Promise<Transaction> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const res = await fetch(`${API_BASE_URL}/transactions/transfer`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Fallo en la transferencia');
    return json.data;
  },

  async deposit(data: DepositWithdrawDTO, idempotencyKey?: string): Promise<Transaction> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const res = await fetch(`${API_BASE_URL}/transactions/deposit`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error en depósito');
    return json.data;
  },

  async withdraw(data: DepositWithdrawDTO, idempotencyKey?: string): Promise<Transaction> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (idempotencyKey) {
      headers['Idempotency-Key'] = idempotencyKey;
    }

    const res = await fetch(`${API_BASE_URL}/transactions/withdraw`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Error en retiro');
    return json.data;
  },

  async getAccountHistory(accountNumber: string): Promise<Transaction[]> {
    const res = await fetch(`${API_BASE_URL}/transactions/history/${accountNumber}`);
    if (!res.ok) throw new Error('Error al obtener movimientos');
    const json: ApiResponse<Transaction[]> = await res.json();
    return json.data;
  },

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/accounts`);
      return res.ok;
    } catch {
      return false;
    }
  }
};
